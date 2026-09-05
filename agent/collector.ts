// agent/collector.ts
// News Collector Module for LoLaBo
// Fetches trending tech news from curated RSS feeds

import Parser from 'rss-parser';

const parser = new Parser();

const FEEDS = [
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com/rss' },
  { name: 'Dev.to', url: 'https://dev.to/feed' },
  { name: 'Wired', url: 'https://www.wired.com/feed/rss' }
];

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  source: string;
}

export async function collectNews(): Promise<NewsItem[]> {
  console.log("📡 Collecting news from RSS feeds...");
  const allItems: NewsItem[] = [];

  for (const feed of FEEDS) {
    try {
      const result = await parser.parseURL(feed.url);
      const items = result.items.slice(0, 5).map(item => ({
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate || '',
        content: item.contentSnippet || item.content || '',
        source: feed.name
      }));
      allItems.push(...items);
      console.log(`✅ Fetched ${items.length} items from ${feed.name}`);
    } catch (e) {
      console.error(`❌ Failed to fetch feed ${feed.name}:`, e);
    }
  }

  // Basic filtering: remove items without title or link
  return allItems.filter(item => item.title && item.link);
}
