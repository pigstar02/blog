import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '../consts.js';

export async function get() {
  const posts = import.meta.glob([
    './posts/**/*.md',        // 最佳实践：明确指定posts文件夹
  ]);

  // 2. 将这个常量传递给 pagesGlobToRssItems 函数
  let items = await pagesGlobToRssItems(posts);

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: SITE_URL,
    items: items.sort((a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate)),
    customData: `<language>zh-cn</language>`,
  });
}
