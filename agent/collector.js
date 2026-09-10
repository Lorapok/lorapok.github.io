"use strict";
// agent/collector.ts
// News Collector Module for LoLaBo
// Fetches trending tech news from curated RSS feeds
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectNews = collectNews;
const rss_parser_1 = __importDefault(require("rss-parser"));
// Support both ES default import and CommonJS export shapes
const RSSParser = typeof rss_parser_1.default === 'function' ? rss_parser_1.default : (rss_parser_1.default?.default || rss_parser_1.default);
const parser = new RSSParser();
const FEEDS = [
    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
    { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
    { name: 'Hacker News', url: 'https://news.ycombinator.com/rss' },
    { name: 'Dev.to', url: 'https://dev.to/feed' },
    { name: 'Wired', url: 'https://www.wired.com/feed/rss' }
];
async function collectNews() {
    console.log("📡 Collecting news from RSS feeds...");
    const allItems = [];
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
        }
        catch (e) {
            console.error(`❌ Failed to fetch feed ${feed.name}:`, e);
        }
    }
    // Basic filtering: remove items without title or link
    return allItems.filter(item => item.title && item.link);
}
