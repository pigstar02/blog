---
# === 主要信息 ===
author: "pigstar"
title: "UE控制台指令"
pubDate: "2025-07-23 17:50:04"
description: "[请填写文章的简短描述]"

# === 封面图片 ===
cover:
  alt: "UE控制台指令"
  square: "[请粘贴方形封面图片URL]"
  url: "[请粘贴主封面图片URL]"

# === 分类与主题 ===
tags:
theme: light

# === 博客框架配置 (重要!) ===
# 请确保这个路径指向您项目中正确的布局文件
layout: ../../layouts/MarkdownPost.astro

# === SEO 元数据 ===
# 这部分内容通常会自动生成网页的 <meta> 标签
keywords: "[关键词1, 关键词2, 关键词3]"
meta:
  - name: author
    content: "pigstar" # 建议与上面的 author 保持一致
  - name: keywords
    content: "[关键词1, 关键词2, 关键词3]" # 建议与上面的 keywords 保持一致
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


