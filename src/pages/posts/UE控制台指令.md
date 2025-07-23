---
author: pigstar
title: UE控制台指令
pubDate: 2025-07-23 17:50:04
description: "[请填写文章的简短描述]"
cover:
  alt: UE控制台指令
  square: "[请粘贴方形封面图片URL]"
  url: "[请粘贴主封面图片URL]"
tags:
  - UE
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
**通用指令**

*   **`help`**: 显示所有可用的命令行指令。
*   **`quit`** 或 **`exit`**: 退出Unreal Engine编辑器或游戏。
*   **`stat fps`**: 显示当前帧率（FPS）。
*   **`stat unit`**: 显示帧率、游戏线程、渲染线程等性能信息。
*   **`stat engine`**: 显示引擎相关的统计信息。
*   **`stat gpu`**: 显示GPU相关的统计信息。
*   **`stat commands`**: 显示当前正在执行的控制台命令。
*   **`dump <ObjectName>`**: 转储指定对象的属性和信息。例如：`dump PlayerController`。
*   **`log <Message>`**: 在日志中输出一条消息。
*   **`exec <Filename>`**: 执行一个包含一系列命令的文本文件。例如：`exec MyCommands.txt`。


