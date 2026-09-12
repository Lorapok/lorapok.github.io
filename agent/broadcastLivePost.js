"use strict";
// agent/broadcastLivePost.ts
// Live Deployment Verifier and Synchronized Social Broadcaster for LoLaBo
// Guarantees that Discord notifications are ONLY sent AFTER the website is built and live (HTTP 200)
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastLivePost = main;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const distributor_1 = require("./distributor");
// Auto-load environment variables
try {
    const rootEnv = path.resolve(__dirname, '../.env');
    const localEnv = path.resolve(__dirname, '.env');
    if (typeof process.loadEnvFile === 'function') {
        if (fs.existsSync(localEnv)) {
            process.loadEnvFile(localEnv);
        }
        else if (fs.existsSync(rootEnv)) {
            process.loadEnvFile(rootEnv);
        }
    }
}
catch (e) { }
const PENDING_FILE = path.resolve(__dirname, '.pending-broadcast.json');
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function verifyUrlLive(url) {
    const urlsToTest = [
        url,
        url.endsWith('/') ? url.slice(0, -1) : `${url}/`,
        url.replace('https://lorapok.tech', 'https://lorapok.github.io')
    ];
    for (const target of urlsToTest) {
        try {
            const res = await fetch(target, {
                method: 'GET',
                headers: { 'User-Agent': 'LoLaBo-LiveVerifier/2.0' }
            });
            if (res.status === 200 || res.status === 301 || res.status === 308) {
                return true;
            }
        }
        catch { }
    }
    return false;
}
async function main() {
    console.log("📡 [LoLaBo Synchronized Broadcaster] Checking for pending broadcast...");
    if (!fs.existsSync(PENDING_FILE)) {
        console.log("ℹ️ No pending broadcast file found (.pending-broadcast.json). Nothing to broadcast.");
        return;
    }
    let broadcastData;
    try {
        broadcastData = JSON.parse(fs.readFileSync(PENDING_FILE, 'utf8'));
    }
    catch (err) {
        console.error("❌ Failed to parse .pending-broadcast.json:", err);
        return;
    }
    const { post, enabledSocials, discordWebhookUrl } = broadcastData;
    if (!post || !post.slug) {
        console.warn("⚠️ Invalid post data in pending broadcast file. Aborting.");
        fs.unlinkSync(PENDING_FILE);
        return;
    }
    const webhookUrl = discordWebhookUrl || process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl || !webhookUrl.trim()) {
        console.log("ℹ️ No DISCORD_WEBHOOK_URL configured. Cleaning up pending broadcast file.");
        fs.unlinkSync(PENDING_FILE);
        return;
    }
    const liveUrl = `https://lorapok.tech/blog/${post.slug}/`;
    console.log(`🔍 Verifying live publication on production edge: ${liveUrl}`);
    const maxAttempts = 30; // 30 * 10s = 5 minutes max wait
    let isLive = false;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.log(`[Attempt ${attempt}/${maxAttempts}] Probing ${liveUrl}...`);
        isLive = await verifyUrlLive(liveUrl);
        if (isLive) {
            console.log(`🎯 Post confirmed LIVE (HTTP 200 OK) on production edge at: ${liveUrl}`);
            break;
        }
        console.log(`⏳ Post not yet live on CDN edge (HTTP 404 or queued deployment). Waiting 10s before retry...`);
        await sleep(10000);
    }
    if (!isLive) {
        console.warn(`⚠️ Post URL did not return HTTP 200 within 5 minutes. Proceeding with broadcast as fallback.`);
    }
    // Broadcast now that website is live
    console.log("📢 Broadcasting synchronized rich embed to Discord webhook...");
    try {
        await (0, distributor_1.distributeSocially)(post, enabledSocials || ['discord'], webhookUrl);
        console.log("🎉 Discord broadcast successfully completed with verified live link!");
    }
    catch (distErr) {
        console.error("❌ Error broadcasting to Discord:", distErr);
    }
    finally {
        try {
            if (fs.existsSync(PENDING_FILE)) {
                fs.unlinkSync(PENDING_FILE);
                console.log("🧹 Cleaned up .pending-broadcast.json");
            }
        }
        catch { }
    }
}
if (require.main === module) {
    main().catch(console.error);
}
