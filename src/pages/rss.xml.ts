import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { articles } from '../data/articles';

export function GET(context: APIContext) {
  return rss({
    title: 'Valentina Tihova',
    description: "Write-ups on where a product's data misleads people, and how to fix it.",
    site: context.site!,
    items: articles.map((article) => ({
      title: article.title,
      description: article.summary,
      pubDate: new Date(article.date),
      link: `/article/${article.id}/`,
    })),
  });
}
