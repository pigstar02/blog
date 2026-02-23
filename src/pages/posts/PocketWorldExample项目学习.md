---
author: pigstar
cover:
  alt: cover
  square: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLBRw4ETs0pE0bP6OXse4jfMOotclHykLZEw-qP6LVonmdkTU5bu_ZuJyJqPB0tGWNHw&usqp=CAU
  url: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLBRw4ETs0pE0bP6OXse4jfMOotclHykLZEw-qP6LVonmdkTU5bu_ZuJyJqPB0tGWNHw&usqp=CAU
description: PocketWorldExample 是学习 Lyra 中 PocketWorld 插件的最小集示例，介绍如何使用该插件实现角色选单渲染。
keywords: UE5, Lyra, PocketWorld, 插件, 角色选单
layout: ../../layouts/MarkdownPost.astro
meta:
- content: pigstar
  name: author
- content: UE5, Lyra, PocketWorld
  name: keywords
pubDate: 2025-12-14 10:43:00
tags:
- UE5
- Lyra
- 游戏开发
theme: light
title: PocketWorldExample项目学习
---

### 🏷 摘要

> PocketWorldExample是学习Lyra中的PocketWorld插件的一个最小集示例项目，介绍了如何使用这个插件。
> 

---

### 流程

1. BP_ThirdPersonCharacterde beginplay通过PWEUISubsystem的`SpawnPocketLevel`spawn一个subLevel，Level路径来自DA_MenuCharacter的Level，Level名为P_MenuCharacter
2. P_MenuCharacter中摆放了一个BP_MenuStage的蓝图
3. BP_MenuStage在关卡创建时beginplay
    1. 生成一个character在指定位置
    2. 通过PocketCaptureSubsystem的`CreateThumbnailRenderer` 创建一个PocketCapture
    3. 设置了PocketCapture的大小和CaptureTarget为BP_MenuStage
    4. 递归收集了所有Actor 通过`SetAlphaMaskedActors` 存放在`AlphaMaskActorPtrs` 
    5. 把生成的character存放在AlphaMaskMaterialActor的数组中
    6. 把上述生成的PocketCapture和BP_MenuStage缓存到PWEUISubsystem中
4. BP_ThirdPersonCharacter中按下E键打开UI  WBP_TestMenu
5. WBP_TestMenu把WBP_MenuCharacterRender的公共变量Material设置到WidgetDropShadow上，WidgetDropShadow的color是全黑，这样可以得到一个假阴影（通过WidgetDropShadow的位置偏移得到，不受光照变化影响）
6. WBP_MenuCharacterRender在Construct时通过PWEUISubsystem拿到刚才创建的PocketCapture并创建两张RrenderTexture，分别对应颜色和透明度。通过SetTextureParameterValue设置到图片控件Character的AlphaMask和Diffuse上。
7. 然后WBP_MenuCharacterRender每一帧Tick
    1. 叫PocketCapture执行`CaptureDiffuse` 获取BP_MenuStage子节点下的所有Actor然后通过`CaptureScene` 拍下来存到Diffuse那张RT上。
    2. 通过事件PreCaptureAlphaMask让BP_MenuStage把上面存下来的Character的材质设置成M_White（纯白）这样CaptureScene就能看到了，同时把原来的对应的材质存下来。
    3. 叫PocketCapture执行`CaptureAlphaMask` ，它会把BP_MenuStage上面存下来的所有Actor的材质设置成`AlphaMaskActorPtrs` ，但是这个变量没有设置所以CPP这边没有材质覆写，都保持原来的。所以只有上面生成的Character能被看到。因为这层只Capture Alpha层，所以和颜色无关。
    4. 通过事件PostCaptureAlphaMask让BP_MenuStage把Character的材质还原。
8. Diffuse和AlphaMask的RT叠加会得到只有Character的抠图效果。因为只有Character的透明度是1

```mermaid
flowchart TD

A[BP_ThirdPersonCharacter BeginPlay] --> B[PWEUISubsystem SpawnPocketLevel Level from DA_MenuCharacter to P_MenuCharacter]

B --> C[P_MenuCharacter Level Loaded]
C --> D[BP_MenuStage BeginPlay]

D --> D1[Spawn Character at target location]
D --> D2[Create PocketCapture via PocketCaptureSubsystem CreateThumbnailRenderer]
D2 --> D3[Set PocketCapture size and CaptureTarget = BP_MenuStage]
D3 --> D4[SetAlphaMaskedActors gather all actors into AlphaMaskActorPtrs]
D4 --> D5[Add spawned Character to AlphaMaskMaterialActors]
D5 --> D6[Cache PocketCapture and BP_MenuStage in PWEUISubsystem]

A2[BP_ThirdPersonCharacter press E] --> E[Open UI WBP_TestMenu]
E --> F[WBP_TestMenu sets WBP_MenuCharacterRender Material to WidgetDropShadow black fake shadow]

F --> G[WBP_MenuCharacterRender Construct]
G --> G1[Get PocketCapture from PWEUISubsystem]
G1 --> G2[Create DiffuseRT and AlphaRT RenderTargets]
G2 --> G3[Assign DiffuseRT and AlphaRT to Character image material Diffuse and AlphaMask]

H[Every Tick in WBP_MenuCharacterRender] --> H1[CaptureDiffuse CaptureScene BP_MenuStage children to DiffuseRT]
H --> H2[PreCaptureAlphaMask on BP_MenuStage override Character materials to M_White and cache originals]
H2 --> H3[CaptureAlphaMask CaptureScene using AlphaMaskActorPtrs to AlphaRT]
H3 --> H4[PostCaptureAlphaMask on BP_MenuStage restore Character materials]

H4 --> I[UI combines DiffuseRT and AlphaRT only Character opaque with fake shadow]

```
