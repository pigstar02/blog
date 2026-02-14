---
author: pigstar
cover:
  alt: cover
  square: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLBRw4ETs0pE0bP6OXse4jfMOotclHykLZEw-qP6LVonmdkTU5bu_ZuJyJqPB0tGWNHw&usqp=CAU
  url: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLBRw4ETs0pE0bP6OXse4jfMOotclHykLZEw-qP6LVonmdkTU5bu_ZuJyJqPB0tGWNHw&usqp=CAU
description: UMG 离屏渲染并异步保存为 PNG，解决分享图、隐藏 UI 截图等问题。
keywords: UE5, UMG, 离屏渲染, RenderTarget, FWidgetRenderer
layout: ../../layouts/MarkdownPost.astro
meta:
- content: pigstar
  name: author
- content: UE5, UMG, 离屏渲染
  name: keywords
pubDate: 2025-12-10 22:11:00
tags:
- UE5
- UMG
- 游戏开发
theme: light
title: UE5离屏渲染
---

在游戏开发中，我们经常遇到这样的需求：**生成一张分享图** 📸

比如在 MOBA 游戏的结算界面，或者 RPG 游戏的角色详情页，我们需要生成一张包含丰富信息（角色立绘、战绩数据、装备图标）的图片供玩家分享。通常，这张“分享图”的排版和游戏中实际显示的 UI 并不完全一样，甚至我们希望在后台静默生成，不打断玩家的当前操作。

传统的 `HighResShot` 或 `TakeScreenshot` 无法满足这个需求，因为它们只能截取当前屏幕上显示的内容。

本文将分享一套基于 C++ 的方案，实现 **UMG 离屏渲染 (Off-screen Rendering)** 并 **异步保存为 PNG**，解决“截图中 UI 没有渲染 / 截不到隐藏 UI”的问题 ✅

---

## 🧠 整体思路概览

要实现这个功能，我们需要解决两个核心问题：

1. **如何渲染「看不见」的控件？**
    
    利用 `FWidgetRenderer` 将 UMG 绘制到一个临时的 `RenderTarget` 上，而不是屏幕视口。
    
2. **如何不卡顿地保存成图片？**
    
    图片压缩和文件写入是非常耗时的 IO 操作，必须放到后台线程（Async）执行，避免阻塞游戏主线程（GameThread）。
    

整体流程可以概括为：

1. 创建 Widget（不加到 Viewport）并完成数据绑定。
2. 使用 `FWidgetRenderer` 将 Widget 渲染到 `UTextureRenderTarget2D`。
3. 将 RenderTarget 拍扁成一张 `UTexture2D`。
4. 在主线程拷贝像素数据后，把压缩和写盘丢到后台线程异步执行。

下面分别展开介绍每一步 👇

---

## 🧩 第一步：将 Widget 渲染为 Texture2D

这个函数负责将一个 `UUserWidget` 实例“拍扁”成一张 `UTexture2D`。

### 🔧 代码实现（C++)

```cpp
UTexture2D* UCommonBPLibrary::RenderWidgetToTexture(UUserWidget* Widget, FVector2D Size)
{
    if (!Widget || Size.X <= 0 || Size.Y <= 0)
    {
        return nullptr;
    }

    // 1. 创建临时 RenderTarget
    UTextureRenderTarget2D* RenderTarget = NewObject<UTextureRenderTarget2D>();
    RenderTarget->InitAutoFormat(Size.X, Size.Y);
    RenderTarget->RenderTargetFormat = RTF_RGBA8_SRGB;
    RenderTarget->ClearColor = FLinearColor::Transparent;
    RenderTarget->UpdateResourceImmediate(true);

    // 2. 绘制 Widget
    FWidgetRenderer* WidgetRenderer = new FWidgetRenderer(false); // Gamma=false
    
    // 强制布局计算 (关键)
    TSharedPtr<SWidget> SlateWidget = Widget->TakeWidget();
    SlateWidget->SlatePrepass(1.0f);

    WidgetRenderer->DrawWidget(RenderTarget, SlateWidget.ToSharedRef(), Size, 0.0f);
    
    // 3. 等待渲染并读取像素 (阻塞操作)
    FlushRenderingCommands(); // 确保 GPU 画完了
    FTextureRenderTargetResource* RTResource = RenderTarget->GameThread_GetRenderTargetResource();
    
    TArray<FColor> Bitmap;
    RTResource->ReadPixels(Bitmap); // 这里会阻塞直到读取完成

    // 4. 【清理阶段 1】清理 C++ 对象
    delete WidgetRenderer; 
    WidgetRenderer = nullptr;

    // 5. 【清理阶段 2】销毁 RenderTarget (你指出的部分)
    // 先释放 GPU 资源 (显存)
    RenderTarget->ReleaseResource(); 
    // 再标记 UObject 为待销毁，让 GC 在下一帧立刻回收它，不要等很久
    RenderTarget->MarkAsGarbage(); 
    // 或者使用更强制的 RenderTarget->ConditionalBeginDestroy();

    // 6. 创建结果 Texture2D (Transient)
    UTexture2D* OutTexture = UTexture2D::CreateTransient(Size.X, Size.Y, PF_B8G8R8A8);
    if (!OutTexture) return nullptr;

    OutTexture->SRGB = true;
    
    // 填充数据
    void* TextureData = OutTexture->GetPlatformData()->Mips[0].BulkData.Lock(LOCK_READ_WRITE);
    if (TextureData && Bitmap.Num() > 0)
    {
        FMemory::Memcpy(TextureData, Bitmap.GetData(), Bitmap.Num() * sizeof(FColor));
    }
    OutTexture->GetPlatformData()->Mips[0].BulkData.Unlock();

    OutTexture->UpdateResource();

    return OutTexture;
}
```

### 📌 技术要点小结

- **SlatePrepass** ✨
    
    这是最容易被遗漏的一步。如果你的截图出来是一团乱或者是空的，通常是因为没有调用这个函数。它负责在绘制前计算 UI 元素的相对位置。
    
- **FlushRenderingCommands** ⏱️
    
    虽然会造成短暂的 CPU 等待，但为了确保 `ReadPixels` 能读到刚刚画上去的内容，这是必须的。
    
- **Transient Texture** 🧾
    
    我们生成的是一个运行时的 `UTexture2D`，可以：
    
    - 直接赋值给 UMG 里的 `Image` 控件显示。
    - 作为材质贴图使用，用在 3D 物体、屏幕、看板等表面。

---

## 🚀 第二步：异步保存为 PNG

如果在主线程直接保存大分辨率图片（比如 4K），游戏画面会明显卡顿甚至卡帧。我们利用 `AsyncTask` 将繁重的编码和写入工作移至后台线程。

### 🔧 代码实现（C++)

```cpp
void UCommonBPLibrary::SaveTextureAsPNG(UTexture2D* Texture, FString FullFilePath, FSaveTextureAsPNGFinishDelegate OnFinish)
{
    if (!Texture || FullFilePath.IsEmpty())
    {
        return;
    }

    // 1. 获取原始数据 (只能在 GameThread 做)
    FTexture2DMipMap& MipMap = Texture->GetPlatformData()->Mips[0];
    void* RawData = MipMap.BulkData.Lock(LOCK_READ_ONLY);
    
    if (!RawData)
    {
        return;
    }

    int32 Width = Texture->GetSizeX();
    int32 Height = Texture->GetSizeY();

    // 拷贝一份数据到 TArray，以便在异步线程中使用
    // 注意：这里假设源数据格式是 BGRA (UE默认)，如果不一致可能需要手动交换通道
    TArray<uint8> SourceData;
    SourceData.AddUninitialized(Width * Height * 4);
    FMemory::Memcpy(SourceData.GetData(), RawData, SourceData.Num());

    MipMap.BulkData.Unlock();

    // 2. 异步处理压缩和保存 (防止主线程卡死)
    AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask, [SourceData, Width, Height, FullFilePath, OnFinish]()
    {
        // 转换 RawData (uint8) 为 FColor 数组
        TArray<FColor> ColorData;
        ColorData.SetNumUninitialized(Width * Height);

        const uint8* SrcPtr = SourceData.GetData();
        for (int32 i = 0; i < Width * Height; i++)
        {
            // 如果你发现保存出来的图片颜色红蓝反了，请修改这里的顺序
            // 通常情况：B=0, G=1, R=2, A=3 (BGRA) -> FColor 也是 BGRA 内存布局
            // 但 PNG 压缩器会自动处理 FColor 到 PNG 的转换
            ColorData[i] = FColor(SrcPtr[i * 4 + 2], SrcPtr[i * 4 + 1], SrcPtr[i * 4], SrcPtr[i * 4 + 3]);
        }

        // 压缩为 PNG
        TArray<uint8> CompressedData;
        FImageUtils::CompressImageArray(Width, Height, ColorData, CompressedData);

        // 保存文件
        bool bSuccess = FFileHelper::SaveArrayToFile(CompressedData, *FullFilePath);

        // 3. 回到主线程执行回调
        AsyncTask(ENamedThreads::GameThread, [OnFinish, FullFilePath, bSuccess]()
        {
            if (bSuccess)
            {
                OnFinish.ExecuteIfBound(FullFilePath);
            }
            else
            {
                OnFinish.ExecuteIfBound(TEXT("")); // 失败返回空字符串
            }
        });
    });
}
```

### 📌 技术要点小结

- **线程安全** 🧵
    
    `UTexture2D` 的数据访问（Lock / Unlock）必须在主线程完成。一旦数据拷贝到临时数组，后续的压缩（Compress）和 IO（Save）就可以在后台线程安全执行。
    
- **通道顺序（BGRA → RGBA）** 🎨
    
    UE 贴图数据通常是 **BGRA** 格式。如果不做处理直接压缩，生成的 PNG 可能会出现红蓝通道颠倒（人物脸变蓝）。通过手动构建 `FColor`，可以显式保证颜色正确性。
    
- **回到 GameThread 做回调** 🔁
    
    保存结束后通过 `AsyncTask(ENamedThreads::GameThread, ...)` 回到主线程，执行蓝图委托通知 UI，比如弹出“保存成功”的 Toast。
    

---

## 🧷 蓝图中的使用流程

完成 C++ 库编写后，在蓝图中的典型使用流程可以整理为一个小 Checklist ✅：

1. **准备 Widget** 🧱
    - 使用 `Create Widget` 节点创建一个特定 UI（例如 `WBP_ShareCard`）。
    - *注意：不要将其 Add to Viewport。*
    - 在此处调用该 Widget 的自定义初始化函数，传入需要展示的数据（玩家名字、分数、排名、装备等）。
2. **渲染到纹理** 🖼️
    - 调用 `Render Widget To Texture`，传入 Widget 实例和目标分辨率（如 `1920x1080`）。
    - 得到一张 `Texture2D`：
        - 可以直接用于 UI 显示。
        - 或者暂存，后续再保存或上传服务器。
3. **保存为 PNG** 💾
    - 调用 `Save Texture As PNG`：
        - 构造完整文件路径（例如：`Project Saved Directory` + `/ShareCards/xxx.png`）。
        - 绑定 `OnFinish` 事件，在回调中：
            - 弹出“保存成功 ✅ / 保存失败 ❌”提示。
            - 或者继续执行后续逻辑（比如打开系统分享面板）。

---

## 🧮 适用场景与扩展思路

把 UI 渲染和屏幕显示解耦之后，这套方案不仅能用来生成分享图，还可以扩展到很多其他场景：

- 🧰 **Inventory 图标生成**：
    - 离屏渲染 3D 物品 + HUD UI，自动批量生成道具图标。
- 🧱 **动态贴花 / 看板**：
    - 将渲染结果作为材质贴图，用在关卡中的广告牌、评分板、排行榜等。
- 📊 **复杂统计图表**：
    - 在加载界面提前离屏渲染复杂 UMG 图表，进入关卡后直接显示成品贴图。
- 🧪 **自动化截图 / 视觉回归**：
    - 结合自动化流程，在无头模式下批量渲染 UI 状态用于对比和测试。

---

## 📎 所需头文件与模块清单

为了让上述代码正常编译运行，需要补齐相关依赖：

### 🧱 Build.cs 中需要的模块

```csharp
"UMG", "Slate", "SlateCore", "RenderCore", "RHI", "ImageWrapper"
```

### 📄 .cpp 中需要包含的头文件

```cpp
#include "Blueprint/UserWidget.h"
#include "Engine/TextureRenderTarget2D.h"
#include "Slate/WidgetRenderer.h"
#include "ImageUtils.h"
#include "Misc/FileHelper.h"
#include "Async/Async.h"
#include "TextureResource.h"
```

---

## ✅ 小结

- 利用 `FWidgetRenderer`，我们可以在**不把 UMG 加入视口**的前提下，将其离屏渲染到 RenderTarget，再转换为 `UTexture2D`。
- 通过 **主线程拷贝像素 + 后台线程压缩与写盘** 的模式，可以在几乎不影响帧率的前提下，生成高分辨率分享图。
- 这套方案既适合“生成分享卡片”这样的运营需求，也适合扩展到 Inventory 图标、贴花材质、统计图表等更多玩法。🎯

如果你在接入过程中遇到具体的崩溃、花屏或者渲染结果异常，也可以围绕：

- Widget 是否完成初始化、
- 是否调用 `SlatePrepass`、
- 是否正确 Flush / Lock / Unlock、
- 是否在正确的线程访问数据
