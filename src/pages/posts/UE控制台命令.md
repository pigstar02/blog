---
author: pigstar
cover:
  alt: cover
  square: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLBRw4ETs0pE0bP6OXse4jfMOotclHykLZEw-qP6LVonmdkTU5bu_ZuJyJqPB0tGWNHw&usqp=CAU
  url: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLBRw4ETs0pE0bP6OXse4jfMOotclHykLZEw-qP6LVonmdkTU5bu_ZuJyJqPB0tGWNHw&usqp=CAU
description: UE 控制台命令速查：调试、性能、渲染等常用指令，便于运行时调试与自动化测试。
keywords: Unreal Engine, 控制台命令, 调试, 性能, Obj List, Stat FPS
layout: ../../layouts/MarkdownPost.astro
meta:
- content: pigstar
  name: author
- content: UE, 控制台命令, 调试
  name: keywords
pubDate: 2025-12-07 13:10:00
tags:
- UE5
- 调试
- 游戏开发
theme: light
title: UE控制台命令
---

### 🏷 摘要

> UE 控制台命令是 Unreal Engine 中用于**在运行时快速调试和配置游戏**的一整套指令系统。开发者可以通过输入控制台命令，在**不改代码、不重启游戏**的前提下，动态调整渲染效果、性能参数、关卡状态以及角色属性等，从而显著提升迭代效率。合理地归纳和使用常见控制台命令，不但能帮助快速定位问题、对比不同配置带来的表现差异，还能为后续搭建调试工具链与自动化测试打下基础。
> 

---

## 调试类

### Obj GC

- **用途描述**：立刻触发一次垃圾回收，将所有不再被引用的 UObject 回收，配合 Obj List / Obj Refs 用于精准判断是否存在泄露。
- **语法**：`Obj GC`
- **使用示例**：`Obj GC`
- **引擎版本**：全部版本
- **使用场景**：在移除对象引用或关闭 UI 后，手动触发 GC，再用 Obj List 检查是否还有残留实例，以排除“只是还没到 GC 时间”的干扰。

### Obj List

- **用途描述**：列出内存中某个类的所有实例，并给出 Count 和资源占用，用于确认对象是否仍在内存中以及数量是否异常。
- **语法**：`Obj List Class=<类名>`
- **使用示例**：`Obj List Class=WB_WorldMap_ExplorationReward_C`
- **引擎版本**：全部版本
- **使用场景**：在关闭 UI 或关卡后，快速确认某个类是否还有实例存活，并观察随时间推移实例数量是否增加，用于初步判断是否存在内存泄露。

### Obj Refs

- **用途描述**：反向追踪某个对象或类被谁引用，打印引用链，帮助定位真正的持有者，用于内存泄露和编辑器缓存误报分析。
- **语法**：`Obj Refs Name=<对象名> <深度|shortest>` 或 `Obj Refs Class=<类名> <深度|shortest>`
- **使用示例**：`Obj Refs Name=WB_WorldMap_ExplorationReward_C_0 shortest`、`Obj Refs Class=WB_WorldMap_Main_C 10`
- **引擎版本**：全部版本
- **使用场景**：当 Blueprint Debugger 或 Obj List 显示某个对象始终存在时，用来追踪引用路径，区分是真正逻辑泄露还是被 GCObjectReferencer / FBlueprintNodeTemplateCache 等系统缓存。

---

## 性能类

### Stat FPS

- **用途描述**：显示当前游戏或编辑器的每秒帧数(FPS)、帧时间和其他基本性能统计信息。
- **语法**：`stat fps`
- **使用示例**：`stat fps`
- **引擎版本**：全部版本

---

## 渲染类

### r.SetRes

- **用途描述**：设置游戏窗口的分辨率。
- **语法**：`r.SetRes [宽度]x[高度][f|w|b]`，f=全屏，w=窗口，b=无边框窗口
- **使用示例**：`r.SetRes 1920x1080f`
- **引擎版本**：全部版本
