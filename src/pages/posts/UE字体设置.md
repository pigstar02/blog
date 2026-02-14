---
author: pigstar
title: UE字体设置
pubDate: 2025-08-19 11:31:18
description: "[请填写文章的简短描述]"
cover:
  alt: UE字体设置
  square: "[请粘贴方形封面图片URL]"
  url: "[请粘贴主封面图片URL]"
tags:
  - 虚幻引擎
theme: light
layout: ../../layouts/MarkdownPost.astro
keywords: "[关键词1, 关键词2, 关键词3]"
meta:
  - name: author
    content: pigstar
  - name: keywords
    content: "[关键词1, 关键词2, 关键词3]"
---
相关参数都在**FontCache.cpp**文件里

![FontCache.cpp](https://raw.githubusercontent.com/pigstar02/blog_img/main/20250819113341087.png)

## 1. **MaxFontAtlasPagesBeforeFlush**

- 控制台变量名：`slate.MaxFontAtlasPagesBeforeFlush`
    
- 变量作用：定义“字体图集页面”最多可创建并使用多少张。当达到这个数量且当前图集已满时，字体缓存系统会触发flush（刷新），清空字体缓存并释放显存，避免无节制膨胀。
    
- 实际意义：  
    _直接影响内存和性能平衡。值较小导致频繁刷新（抖动、文字闪烁），值过大则占用显存_
    

---

## 2. **MaxFontNonAtlasTexturesBeforeFlush**

- 控制台变量名：`slate.MaxFontNonAtlasTexturesBeforeFlush`
    
- 变量作用：定义“非字体图集的大字形字体纹理”最多可创建和使用的数量。超过这个数量后会触发flush。
    
- 实际意义：  
    _类似于上面，但针对大字形（“非图集”渲染）类型的字体纹理。数值需综合判断纹理大小与显存限制_
    

---

## 3. **GrowFontAtlasFrameWindow**

- 控制台变量名：`slate.GrowFontAtlasFrameWindow`
    
- 变量作用：设置“字体图集在多少帧内可以被动态扩容而不是直接刷新”。
    
- 实际意义：  
    _如果短时间内（如几帧）频繁需要更多字体空间，系统会优先进行扩容而不是刷新，可以减少性能波动。值越大图集中保留越久，可以避免频繁清空；越小则刷新更快，更节省资源_
    

---

## 4. **GrowFontNonAtlasFrameWindow**

- 控制台变量名：`slate.GrowFontNonAtlasFrameWindow`
    
- 变量作用：与上面类似，但针对“大字形池”的帧动态扩容设置。
    
- 实际意义：  
    _用于控制大字形渲染方式的缓存扩容行为_
    

---

## 5. **UnloadFreeTypeDataOnFlush**

- 控制台变量名：`slate.UnloadFreeTypeDataOnFlush`
    
- 变量作用：决定在flush时是否卸载FreeType字体数据（1=卸载，0=保留）。
    
- 实际意义：  
    _卸载能够释放更多内存，但可能导致后续文字重新加载时性能损耗_

---

## 6. **Slate.DefaultTextShapingMethod**

- 作用：设定字体文本“整形”方式。所谓“文本整形”指的是将字符（glyph）按语言和规则正确组合，比如阿拉伯语连写、印地语复杂脚本等。
    
- 参数值释义：
    
    - 0: Auto（默认）——引擎自动选择最适合当前文本的整形方式。
        
    - 1: KerningOnly——只做字距调整，不做复杂整形（适合拉丁等简单文字）。
        
    - 2: FullShaping——启用完整形态调整（支持连接、变形等复杂语言）。
    
- 实际意义：决定多种语言、脚本的显示细节与正确性，影响国际化和高级文字排版。
    

---

## 7. **Slate.DumpFontCacheStats**

- 类型：FAutoConsoleVariableRef
    
- 作用：设为true时，触发调试输出，打印当前字体缓存统计数据（如已加载字体数、缓存占用等，仅开发及调试阶段可用）。
    
- 实际意义：帮助开发者定位字体性能或缓存异常问题，不影响运行时表现。
    

---

## 8. **Slate.FlushFontCache**

- 作用：设为true时，强制刷新字体缓存。和前面提到flush相关参数类似，不过此变量由开发者或调试工具直接触发。
    
- 实际意义：在调试或内存异常时手动清空缓存，观察效果，非玩家实际可见行为。
    

---

## 9. **SlateSdfText.Enable**

- 默认值：false
    
- 作用：控制Slate UI是否启用SDF（Signed Distance Field）方式的文本渲染。
    
- 实际意义：SDF是一种高质量且可缩放的文本渲染技术，适用于需要高分辨率文本的UI，开启后字体显示更平滑、不易锯齿，但也可能带来额外性能消耗。