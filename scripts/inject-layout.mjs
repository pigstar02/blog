import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const postsDir = join(fileURLToPath(import.meta.url), '../../src/pages/posts');
const LAYOUT = 'layouts/MarkdownPost.astro';

function walk(dir) {
  const results = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) results.push(...walk(full));
    else if (name.endsWith('.md')) results.push(full);
  }
  return results;
}

let count = 0;
for (const file of walk(postsDir)) {
  const raw = readFileSync(file, 'utf-8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) continue;
  if (/^layout\s*:/m.test(m[1])) continue;

  const depth = relative(postsDir, file).replace(/\\/g, '/').split('/').length - 1;
  const layoutValue = '../'.repeat(depth + 2) + LAYOUT;
  const patched = raw.replace(m[0], `---\nlayout: ${layoutValue}\n${m[1]}\n---`);
  writeFileSync(file, patched, 'utf-8');
  count++;
}
if (count > 0) console.log(`[inject-layout] ${count} file(s) patched`);
