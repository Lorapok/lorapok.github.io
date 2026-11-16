// agent/collector.ts
// News Collector Module for LoLaBo
// Fetches trending tech news from curated RSS feeds and filters duplicates

import Parser from 'rss-parser';
import { validateDuplicatePost } from './validator';

// Support both ES default import and CommonJS export shapes
const RSSParser: any = typeof Parser === 'function' ? Parser : ((Parser as any)?.default || Parser);
const parser = new RSSParser();

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

export interface CollectionOptions {
  researchFocus?: string;
  categoryFocus?: string;
}

function focusScore(item: NewsItem, options: CollectionOptions): number {
  const tokens = `${options.researchFocus || ''} ${options.categoryFocus || ''}`
    .toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((token) => token.length > 3);
  if (!tokens.length) return 0;
  const haystack = `${item.title} ${item.content} ${item.source}`.toLowerCase();
  return tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}

export async function collectNews(existingPosts: any[] = [], options: CollectionOptions = {}): Promise<NewsItem[]> {
  console.log("📡 Collecting news from RSS feeds...");
  const allItems: NewsItem[] = [];

  for (const feed of FEEDS) {
    try {
      const result = await parser.parseURL(feed.url);
      const items = (result.items || []).slice(0, 5).map(item => ({
        title: (item.title || '').trim(),
        link: (item.link || '').trim(),
        pubDate: (item.pubDate || '').trim(),
        content: (item.contentSnippet || item.content || '').trim(),
        source: feed.name
      }));
      allItems.push(...items);
      console.log(`✅ Fetched ${items.length} items from ${feed.name}`);
    } catch (e) {
      console.error(`❌ Failed to fetch feed ${feed.name}:`, e);
    }
  }

  // 1. Basic filtering: remove items without title or link
  const validItems = allItems.filter(item => item.title && item.link);

  // 2. Intelligent Duplicate Filtering against active catalog
  if (existingPosts && existingPosts.length > 0) {
    const novelItems = validItems.filter(item => {
      const check = validateDuplicatePost({ title: item.title, url: item.link }, existingPosts, 0.55);
      if (check.isDuplicate) {
        console.log(`⏭️ [Collector] Skipping already-covered story: "${item.title}" (${check.reason})`);
        return false;
      }
      return true;
    });

    console.log(`🔍 [Collector] Filtered ${validItems.length - novelItems.length} duplicate stories. Returning ${novelItems.length} fresh candidates.`);
    const candidates = novelItems.length > 0 ? novelItems : validItems;
    return candidates.sort((a, b) => focusScore(b, options) - focusScore(a, options));
  }

  return validItems.sort((a, b) => focusScore(b, options) - focusScore(a, options));
}
