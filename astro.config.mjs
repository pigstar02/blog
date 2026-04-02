import { defineConfig } from 'astro/config';
import { visit } from 'unist-util-visit'
import md5 from 'md5';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import { SITE_URL } from './src/consts';

import fs from 'node:fs';
import path from 'node:path';

function adminApiPlugin() {
  const postsDir = path.join(process.cwd(), 'src', 'pages', 'posts');

  function jsonResponse(res, data, status = 200) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  function readBody(req) {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        try { resolve(JSON.parse(body)); } catch { reject(new Error('Invalid JSON')); }
      });
      req.on('error', reject);
    });
  }

  function readRawBody(req) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });
  }

  function safePath(file) {
    const resolved = path.resolve(postsDir, file);
    if (!resolved.startsWith(postsDir)) return null;
    return resolved;
  }

  return {
    name: 'admin-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/__admin_api/')) return next();

        const route = req.url.split('?')[0].replace('/__admin_api/', '');
        const url = new URL(req.url, 'http://localhost');

        try {
          if (route === 'get-post' && req.method === 'GET') {
            const file = url.searchParams.get('file');
            if (!file) return jsonResponse(res, { error: '缺少 file 参数' }, 400);
            const fp = safePath(file);
            if (!fp) return jsonResponse(res, { error: '非法路径' }, 403);
            if (!fs.existsSync(fp)) return jsonResponse(res, { error: '文件不存在' }, 404);
            const content = fs.readFileSync(fp, 'utf-8');
            return jsonResponse(res, { content, file });
          }

          if (route === 'save-post' && req.method === 'POST') {
            const { file, content } = await readBody(req);
            if (!file || content == null) return jsonResponse(res, { error: '缺少必要参数' }, 400);
            const fp = safePath(file);
            if (!fp) return jsonResponse(res, { error: '非法路径' }, 403);
            fs.mkdirSync(path.dirname(fp), { recursive: true });
            fs.writeFileSync(fp, content, 'utf-8');
            return jsonResponse(res, { success: true, file });
          }

          if (route === 'delete-post' && req.method === 'POST') {
            const { file } = await readBody(req);
            if (!file) return jsonResponse(res, { error: '缺少 file 参数' }, 400);
            const fp = safePath(file);
            if (!fp) return jsonResponse(res, { error: '非法路径' }, 403);
            if (!fs.existsSync(fp)) return jsonResponse(res, { error: '文件不存在' }, 404);
            fs.unlinkSync(fp);
            return jsonResponse(res, { success: true });
          }

          if (route === 'upload-image' && req.method === 'POST') {
            const contentType = req.headers['content-type'] || '';
            const imagesDir = path.join(process.cwd(), 'public', 'static', 'images', 'posts');
            fs.mkdirSync(imagesDir, { recursive: true });

            if (contentType.includes('application/json')) {
              const { name, data } = await readBody(req);
              if (!name || !data) return jsonResponse(res, { error: '缺少参数' }, 400);
              const ext = path.extname(name) || '.png';
              const safeName = path.basename(name, ext).replace(/[^a-zA-Z0-9_\u4e00-\u9fff-]/g, '_');
              const filename = `${Date.now()}_${safeName}${ext}`;
              fs.writeFileSync(path.join(imagesDir, filename), Buffer.from(data, 'base64'));
              return jsonResponse(res, {
                msg: '',
                code: 0,
                data: { errFiles: [], succMap: { [name]: `/static/images/posts/${filename}` } },
              });
            }

            const raw = await readRawBody(req);
            const boundary = contentType.split('boundary=')[1];
            if (!boundary) return jsonResponse(res, { error: '无法解析上传' }, 400);

            const results = {};
            const parts = raw.toString('binary').split('--' + boundary).slice(1, -1);
            for (const part of parts) {
              const [headerSection, ...bodyParts] = part.split('\r\n\r\n');
              const bodyBinary = bodyParts.join('\r\n\r\n').replace(/\r\n$/, '');
              const nameMatch = headerSection.match(/name="([^"]+)"/);
              const fnMatch = headerSection.match(/filename="([^"]+)"/);
              if (!fnMatch || !nameMatch) continue;
              const origName = fnMatch[1];
              const ext = path.extname(origName) || '.png';
              const safeName = path.basename(origName, ext).replace(/[^a-zA-Z0-9_\u4e00-\u9fff-]/g, '_');
              const filename = `${Date.now()}_${safeName}${ext}`;
              fs.writeFileSync(path.join(imagesDir, filename), Buffer.from(bodyBinary, 'binary'));
              results[origName] = `/static/images/posts/${filename}`;
            }
            return jsonResponse(res, {
              msg: '',
              code: 0,
              data: { errFiles: [], succMap: results },
            });
          }

          return jsonResponse(res, { error: 'Not found' }, 404);
        } catch (e) {
          return jsonResponse(res, { error: e.message }, 500);
        }
      });
    },
  };
}


// Fallback: convert unprocessed **text** in text nodes to <strong>.
// CommonMark won't close ** after CJK punctuation (e.g. **示例：**),
// so we catch those in rehype as a post-parse fixup.
function rehypeFallbackStrong() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index == null) return;
      const re = /\*\*(.+?)\*\*/g;
      let m, matches = [];
      while ((m = re.exec(node.value)) !== null) {
        matches.push({ idx: m.index, len: m[0].length, txt: m[1] });
      }
      if (!matches.length) return;
      const kids = [];
      let last = 0;
      for (const { idx, len, txt } of matches) {
        if (idx > last) kids.push({ type: 'text', value: node.value.slice(last, idx) });
        kids.push({
          type: 'element', tagName: 'strong', properties: {},
          children: [{ type: 'text', value: txt }],
        });
        last = idx + len;
      }
      if (last < node.value.length) kids.push({ type: 'text', value: node.value.slice(last) });
      parent.children.splice(index, 1, ...kids);
      return index + kids.length;
    });
  };
}

// Rebuild HTML tree.
function pipeline() {
  return [

    rehypeFallbackStrong,

    () => (tree) => {
      visit(tree, 'element', (node, index) => {
        if (node.tagName === 'p' && node.children[0].tagName === 'img') {
          node.tagName = 'figure';
          
          let img = node.children[0];
          let sign = md5(img.properties.src);
          let data = img.properties.alt.split("|");
          let alt = data[0];
          let size = "big";
          if (data.length > 1) {
            size = data[1];
          }

          let classes = ['image component image-fullbleed body-copy-wide nr-scroll-animation nr-scroll-animation--on'];
          classes.push(`image-${size}`);

          node.properties.className = classes;
          node.children = [
            {
              type: 'element',
              tagName: 'div',
              properties: { className: ['component-content'] },
              children: [
                {
                  type: 'element',
                  tagName: 'div',
                  properties: { className: ['image-sharesheet'] },
                  children: [
                    {
                      type: 'element',
                      tagName: 'div',
                      properties: { className: [`image image-load image-asset image-${sign}`], id: `lht${sign}` },
                      children: [
                        {
                          type: 'element',
                          tagName: 'picture',
                          properties: { className: ['picture'] },
                          children: [
                            {
                              type: 'element',
                              tagName: 'img',
                              properties: {
                                'data-src': img.properties.src,
                                alt: alt,
                                className: ['picture-image'],
                              }
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  type: 'element',
                  tagName: 'div',
                  properties: { className: ['image-description'] },
                  children: [
                    {
                      type: 'element',
                      tagName: 'div',
                      properties: { className: ['image-caption'] },
                      children: [
                        {
                          type: 'text',
                          value: alt
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      })
    },

    () => (tree) => {
      tree.children.forEach((node) => {
        if (node.type === "raw") {
          node.value = `<div class="pagebody code component"><div class="component-content code"> ${node.value} </div></div>`
          // node.value = node.value.replace(/astro-code/g, 'astro-code')
        }
      });
    },

    // 为 mermaid 代码块添加 data 属性，便于前端脚本识别并渲染流程图
    () => (tree) => {
      visit(tree, 'element', (node) => {
        if (node.tagName === 'code' && node.properties?.className) {
          const classes = Array.isArray(node.properties.className) ? node.properties.className : [node.properties.className];
          if (classes.some(c => String(c).includes('mermaid'))) {
            node.properties['data-mermaid-block'] = 'true';
          }
        }
      });
    },


    () => (tree) => {
      for (let i = 0; i < tree.children.length; i++) {
        let node = tree.children[i];
        if (node.type === "element" && ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', "ul", "ol", "blockquote", "hr"].includes(node.tagName)) {

          let next = tree.children[i + 1];
          let nodes = [node];
          while (next && !['figure'].includes(next.tagName) && next.type != "raw") {

            nodes.push(next);
            next = tree.children[tree.children.indexOf(next) + 1];
          }

          if (nodes.length >= 1) {
            // rename label
            nodes.forEach((node) => {
              if (node.tagName === "p") {
                node.properties.className = ['pagebody-copy'];
                node.tagName = "div";
              }
              if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
                node.properties.className = ['pagebody-header'];
              }
            });

            tree.children.splice(i, nodes.length, {
              type: 'element',
              tagName: 'div',
              properties: { className: ['pagebody  text component'] },
              children: [
                {
                  type: 'element',
                  tagName: 'div',
                  properties: { className: ['component-content'] },
                  children: nodes
                }
              ]
            });

          }
        }
      }
    },
    () => (tree) => {
      let len = tree.children.length;
      for (let index = 0; index < len; index++) {
        let node = tree.children[index];
        if (node.type === "element" && node.tagName === "figure") {
          tree.children.splice(index, 0, {
            type: 'element',
            tagName: 'div',
            properties: { className: ['tertiarynav component'] },
            children: [{
              type: 'element',
              tagName: 'div',
              properties: { className: ['component-content'] },
            }]
          })
          index++;
        }
      }
    }
  ]
}



// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, ...pipeline()],
    syntaxHighlight: 'prism',
  },
  integrations: [sitemap()],
  vite: {
    plugins: [adminApiPlugin()],
  },
});
