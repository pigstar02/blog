#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.resolve(__dirname, "../src/pages/posts");

function getAllMdFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getAllMdFiles(full));
    else if (entry.name.endsWith(".md")) results.push(full);
  }
  return results;
}

function isPlaceholder(val) {
  if (!val || val === "null") return true;
  if (typeof val === "string" && val.startsWith("[") && val.endsWith("]") && val.includes("请")) return true;
  return false;
}

function simplifyFrontmatter(raw) {
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return null;

  const fmText = fmMatch[1];
  const body = raw.slice(fmMatch[0].length);

  const lines = fmText.split(/\r?\n/);
  const kept = [];
  let coverUrl = null;
  let coverSquare = null;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const fieldMatch = line.match(/^(\w[\w-]*)\s*:/);

    if (!fieldMatch) {
      kept.push(line);
      i++;
      continue;
    }

    const field = fieldMatch[1];

    if (["author", "theme", "keywords", "layout", "meta"].includes(field)) {
      i++;
      while (i < lines.length && (lines[i].startsWith("  ") || lines[i].startsWith("- ") || lines[i].startsWith("\t"))) {
        i++;
      }
      continue;
    }

    if (field === "cover") {
      const valueAfterColon = line.slice(line.indexOf(":") + 1).trim();

      if (valueAfterColon && !valueAfterColon.startsWith("{")) {
        if (isPlaceholder(valueAfterColon)) {
          i++;
          continue;
        }
        kept.push(line);
        i++;
        continue;
      }

      i++;
      while (i < lines.length && (lines[i].startsWith("  ") || lines[i].startsWith("\t"))) {
        const sub = lines[i].trim();
        const kvMatch = sub.match(/^(\w+)\s*:\s*(.*)$/);
        if (kvMatch) {
          const k = kvMatch[1];
          let v = kvMatch[2].trim();
          if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
          if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
          if (k === "url") coverUrl = v;
          else if (k === "square") coverSquare = v;
        }
        i++;
      }

      const effectiveUrl = (!coverUrl || coverUrl === "null") ? null : coverUrl;
      const effectiveSquare = (!coverSquare || coverSquare === "null") ? null : coverSquare;

      let finalCover = effectiveUrl || effectiveSquare;
      if (finalCover && isPlaceholder(finalCover)) finalCover = null;

      if (finalCover) {
        kept.push(`cover: ${finalCover}`);
      }
      coverUrl = null;
      coverSquare = null;
      continue;
    }

    kept.push(line);
    i++;
    while (i < lines.length && lines[i].match(/^(\s+|- |\t)/)) {
      kept.push(lines[i]);
      i++;
    }
  }

  while (kept.length > 0 && kept[kept.length - 1].trim() === "") kept.pop();
  while (kept.length > 0 && kept[0].trim() === "") kept.shift();

  return `---\n${kept.join("\n")}\n---${body}`;
}

const files = getAllMdFiles(postsDir);
let changed = 0;

for (const filePath of files) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const result = simplifyFrontmatter(raw);
  if (result && result !== raw) {
    fs.writeFileSync(filePath, result, "utf-8");
    changed++;
    const rel = path.relative(postsDir, filePath);
    console.log(`  Simplified: ${rel}`);
  }
}

console.log(`\nDone: ${changed}/${files.length} files simplified.`);
