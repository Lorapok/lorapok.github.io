"use strict";
// agent/collector.ts
// News Collector Module for LoLaBo
// Fetches trending tech news from curated RSS feeds and filters duplicates
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectNews = collectNews;
const rss_parser_1 = __importDefault(require("rss-parser"));
const validator_1 = require("./validator");
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
async function collectNews(existingPosts = []) {
    console.log("📡 Collecting news from RSS feeds...");
    const allItems = [];
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
        }
        catch (e) {
            console.error(`❌ Failed to fetch feed ${feed.name}:`, e);
        }
    }
    // 1. Basic filtering: remove items without title or link
    const validItems = allItems.filter(item => item.title && item.link);
    // 2. Intelligent Duplicate Filtering against active catalog
    if (existingPosts && existingPosts.length > 0) {
        const novelItems = validItems.filter(item => {
            const check = (0, validator_1.validateDuplicatePost)({ title: item.title, url: item.link }, existingPosts, 0.55);
            if (check.isDuplicate) {
                console.log(`⏭️ [Collector] Skipping already-covered story: "${item.title}" (${check.reason})`);
                return false;
            }
            return true;
        });
        console.log(`🔍 [Collector] Filtered ${validItems.length - novelItems.length} duplicate stories. Returning ${novelItems.length} fresh candidates.`);
        return novelItems.length > 0 ? novelItems : validItems;
    }
    return validItems;
}
