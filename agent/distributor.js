"use strict";
// agent/distributor.ts
// Social Media Distribution Module for LoLaBo
// Posts eye-catching snippets to Discord, X, LinkedIn, etc.
Object.defineProperty(exports, "__esModule", { value: true });
exports.distributeSocially = distributeSocially;
async function distributeSocially(post, enabledSocials, customDiscordWebhook) {
    console.log(`📢 Distributing post socially: ${enabledSocials.join(', ')}`);
    const results = [];
    if (enabledSocials.includes('discord')) {
        results.push(await postToDiscord(post, customDiscordWebhook));
    }
    if (enabledSocials.includes('twitter')) {
        results.push(await postToTwitter(post));
    }
    if (enabledSocials.includes('linkedin')) {
        results.push(await postToLinkedIn(post));
    }
    return results;
}
async function postToDiscord(post, customWebhook) {
    const webhookUrl = customWebhook || process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl)
        return { platform: 'discord', status: 'skipped', reason: 'No webhook URL' };
    console.log("Posting to Discord with Lorapok Labs hashtags...");
    const rawTags = Array.isArray(post.tags) ? post.tags : ['LorapokLabs', 'Lorapok'];
    const hashtags = Array.from(new Set(['#LorapokLabs', '#Lorapok', ...rawTags.map((t) => '#' + String(t).replace(/[^a-zA-Z0-9]/g, ''))])).join(' ');
    const canonicalUrl = `https://lorapok.tech/blog/${post.slug}`;
    const payload = {
        username: "LoLaBo Agent",
        avatar_url: "https://lorapok.tech/assets/lolabo-icon.png",
        content: `🚀 **New LoLaBo Article Published** | ${hashtags}`,
        embeds: [{
                title: post.title,
                description: post.excerpt,
                url: canonicalUrl,
                color: 0x38bdf8,
                author: {
                    name: `${post.author?.name || 'LoLaBo AI'} (${post.author?.designation || 'Autonomous Writer'})`,
                    icon_url: "https://lorapok.tech/assets/lolabo-icon.png"
                },
                fields: [
                    { name: "Category", value: post.category || "Technology", inline: true },
                    { name: "Read Time", value: `${post.readTime || 5} min read`, inline: true },
                    { name: "Hashtags", value: hashtags, inline: false }
                ],
                image: { url: post.coverImage },
                footer: {
                    text: "⚡ LoLaBo Autonomous Agent • Lorapok Labs #LorapokLabs",
                    icon_url: "https://lorapok.tech/assets/lorapok-icon.png"
                },
                timestamp: new Date().toISOString()
            }]
    };
    try {
        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return { platform: 'discord', status: res.ok ? 'success' : 'failed' };
    }
    catch (e) {
        return { platform: 'discord', status: 'error', error: e.message };
    }
}
async function postToTwitter(post) {
    // Twitter API v2 implementation placeholder
    console.log("Twitter distribution requested (Requires API keys)");
    return { platform: 'twitter', status: 'pending_setup' };
}
async function postToLinkedIn(post) {
    // LinkedIn API implementation placeholder
    console.log("LinkedIn distribution requested (Requires OAuth)");
    return { platform: 'linkedin', status: 'pending_setup' };
}
