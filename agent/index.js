"use strict";
// agent/index.ts
// LoLaBo Orchestrator Script
// Designed to run in GitHub Actions environment
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
const admin = __importStar(require("firebase-admin"));
const collector_1 = require("./collector");
const writer_1 = require("./writer");
const imageGen_1 = require("./imageGen");
const distributor_1 = require("./distributor");
// ─── Firebase Initialization ───
let serviceAccount = {};
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    }
}
catch (err) {
    console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", err);
}
let db = null;
if (serviceAccount && serviceAccount.project_id) {
    try {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }
        db = admin.firestore();
    }
    catch (err) {
        console.error("❌ Failed to initialize Firebase Admin:", err);
    }
}
else {
    console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT not found or missing project_id. Running in dry-run mode.");
}
async function runAgent() {
    console.log("🚀 Starting LoLaBo Agent...");
    if (!db) {
        console.warn("⚠️ No Firestore connection available. Exiting safely.");
        return;
    }
    // 1. Fetch Config
    const configDoc = await db.collection('agent_config').doc('lolabo_settings').get();
    let config = configDoc.exists ? configDoc.data() : null;
    if (!config) {
        console.log("ℹ️ Agent config not found in Firestore. Initializing default config...");
        config = {
            isEnabled: true,
            intervalHours: 1,
            lastRunAt: null,
            writingProvider: 'gemini',
            imageGenMode: 'auto',
            enabledSocials: ['discord'],
            targetAudience: 'Developers & Engineers',
            tone: 'Technical & precise',
            triggerRequested: true
        };
        try {
            await db.collection('agent_config').doc('lolabo_settings').set(config);
            console.log("✅ Default agent config initialized in Firestore (1-hour publishing interval).");
        }
        catch (err) {
            console.warn("⚠️ Could not persist default config to Firestore:", err);
        }
    }
    if (!config.isEnabled && !process.env.FORCE_RUN) {
        console.log("⏸️ Agent is currently disabled. Skipping run.");
        return;
    }
    // 2. Check Interval or Manual Trigger (Hourly schedule with jitter margin)
    let lastRun = new Date(0);
    if (config.lastRunAt && typeof config.lastRunAt.toDate === 'function') {
        lastRun = config.lastRunAt.toDate();
    }
    else if (config.lastRunAt) {
        lastRun = new Date(config.lastRunAt);
    }
    const now = new Date();
    const hoursSinceLastRun = (now.getTime() - lastRun.getTime()) / (1000 * 60 * 60);
    const targetInterval = typeof config.intervalHours === 'number' ? config.intervalHours : 1;
    // Allow a 15% tolerance margin for GitHub Actions cron scheduling jitter
    const jitterThreshold = Math.max(0.75, targetInterval * 0.85);
    const isManualTrigger = config.triggerRequested === true || process.env.FORCE_RUN === 'true';
    if (hoursSinceLastRun < jitterThreshold && !process.env.FORCE_RUN && !isManualTrigger) {
        console.log(`⏳ Only ${hoursSinceLastRun.toFixed(2)}h since last run. Interval target is ${targetInterval}h (jitter threshold: ${jitterThreshold.toFixed(2)}h). Skipping.`);
        return;
    }
    if (isManualTrigger) {
        console.log("⚡ Manual trigger detected. Bypassing interval.");
    }
    else {
        console.log(`⏱️ Hourly cycle triggered (${hoursSinceLastRun.toFixed(2)}h elapsed >= ${jitterThreshold.toFixed(2)}h threshold). Generating post...`);
    }
    try {
        // 3. News Collection
        const news = await (0, collector_1.collectNews)();
        if (news.length === 0)
            throw new Error("No news collected.");
        // 4. Content Generation
        const blogPost = await (0, writer_1.writeBlogPost)(news, {
            provider: config.writingProvider || 'gemini',
            targetAudience: config.targetAudience || 'Developers',
            tone: config.tone || 'Technical'
        });
        // 5. Image Generation
        blogPost.coverImage = await (0, imageGen_1.generateCoverImage)(blogPost.title, blogPost.tags, config.imageGenMode || 'auto');
        // 6. Generate Slug
        blogPost.slug = blogPost.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        // 7. Save to Firestore
        console.log(`📝 Publishing post: ${blogPost.title}`);
        const postRef = await db.collection('blog_posts').add(blogPost);
        console.log(`✅ Post saved with ID: ${postRef.id}`);
        // 8. Social Distribution
        const socialResults = await (0, distributor_1.distributeSocially)(blogPost, config.enabledSocials || [], config.discordWebhookUrl);
        // 9. Update Config & Reset Trigger
        await db.collection('agent_config').doc('lolabo_settings').update({
            lastRunAt: admin.firestore.Timestamp.now(),
            triggerRequested: false
        });
        console.log("🎉 LoLaBo Agent run completed successfully!");
    }
    catch (e) {
        console.error("💥 LoLaBo Agent failed:", e);
        process.exit(1);
    }
}
runAgent();
