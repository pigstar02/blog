#!/usr/bin/env node

/**
 * 快速创建新文章
 * 用法: node scripts/new-post.mjs "文章标题" [--dir 子目录]
 * 示例:
 *   node scripts/new-post.mjs "我的新文章"
 *   node scripts/new-post.mjs "GAMES101笔记" --dir GAMES101
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.resolve(__dirname, "../src/pages/posts");

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
  console.log(`用法: node scripts/new-post.mjs "文章标题" [--dir 子目录] [--tags 标签1,标签2]`);
  console.log(`示例:`);
  console.log(`  node scripts/new-post.mjs "我的新文章"`);
  console.log(`  node scripts/new-post.mjs "GAMES101笔记" --dir GAMES101 --tags 图形学,学习笔记`);
  process.exit(0);
}

const title = args[0];

let subDir = "";
let tags = "";
for (let i = 1; i < args.length; i++) {
  if (args[i] === "--dir" && args[i + 1]) {
    subDir = args[++i];
  } else if (args[i] === "--tags" && args[i + 1]) {
    tags = args[++i];
  }
}

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const pubDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

const fileName = title.replace(/[<>:"/\\|?*]/g, "_") + ".md";

const tagsLine = tags
  ? `[${tags.split(",").map((t) => t.trim()).join(", ")}]`
  : "[]";

const content = `---
title: ${title}
pubDate: ${pubDate}
description: ''
tags: ${tagsLine}
---

`;

const targetDir = subDir ? path.join(postsDir, subDir) : postsDir;
fs.mkdirSync(targetDir, { recursive: true });

const filePath = path.join(targetDir, fileName);

if (fs.existsSync(filePath)) {
  console.error(`文件已存在: ${filePath}`);
  process.exit(1);
}

fs.writeFileSync(filePath, content, "utf-8");
console.log(`文章已创建: ${path.relative(path.resolve(__dirname, ".."), filePath)}`);
