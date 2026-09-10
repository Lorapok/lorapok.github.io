// agent/index.ts
// LoLaBo Orchestrator Script
// Designed to run in GitHub Actions environment

import * as admin from 'firebase-admin';
import { collectNews } from './collector';
import { writeBlogPost } from './writer';
import { generateCoverImage } from './imageGen';
import { distributeSocially } from './distributor';

// ─── Firebase Initialization ───
let serviceAccount: any = {};
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
} catch (err) {
  console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", err);
}

let db: FirebaseFirestore.Firestore | null = null;
if (serviceAccount && serviceAccount.project_id) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    db = admin.firestore();
  } catch (err) {
    console.error("❌ Failed to initialize Firebase Admin:", err);
  }
} else {
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
      intervalHours: 24,
      lastRunAt: null,
      writingProvider: 'gemini',
      imageGenMode: 'auto',
      enabledSocials: ['discord'],
      targetAudience: 'Developers',
      tone: 'Technical & precise',
      triggerRequested: true
    };
    try {
      await db.collection('agent_config').doc('lolabo_settings').set(config);
      console.log("✅ Default agent config initialized in Firestore.");
    } catch (err) {
      console.warn("⚠️ Could not persist default config to Firestore:", err);
    }
  }

  if (!config.isEnabled && !process.env.FORCE_RUN) {
    console.log("⏸️ Agent is currently disabled. Skipping run.");
    return;
  }

  // 2. Check Interval or Manual Trigger
  let lastRun = new Date(0);
  if (config.lastRunAt && typeof config.lastRunAt.toDate === 'function') {
    lastRun = config.lastRunAt.toDate();
  } else if (config.lastRunAt) {
    lastRun = new Date(config.lastRunAt);
  }
  const now = new Date();
  const hoursSinceLastRun = (now.getTime() - lastRun.getTime()) / (1000 * 60 * 60);
  const isManualTrigger = config.triggerRequested === true || process.env.FORCE_RUN === 'true';

  if (hoursSinceLastRun < config.intervalHours && !process.env.FORCE_RUN && !isManualTrigger) {
    console.log(`⏳ Only ${hoursSinceLastRun.toFixed(1)}h since last run. Interval is ${config.intervalHours}h. Skipping.`);
    return;
  }

  if (isManualTrigger) {
    console.log("⚡ Manual trigger detected. Bypassing interval.");
  }

  try {
    // 3. News Collection
    const news = await collectNews();
    if (news.length === 0) throw new Error("No news collected.");

    // 4. Content Generation
    const blogPost = await writeBlogPost(news, {
      provider: config.writingProvider || 'gemini',
      targetAudience: config.targetAudience || 'Developers',
      tone: config.tone || 'Technical'
    });

    // 5. Image Generation
    blogPost.coverImage = await generateCoverImage(blogPost.title, blogPost.tags, config.imageGenMode || 'auto');

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
    const socialResults = await distributeSocially(blogPost, config.enabledSocials || [], config.discordWebhookUrl);
    
    // 9. Update Config & Reset Trigger
    await db.collection('agent_config').doc('lolabo_settings').update({
      lastRunAt: admin.firestore.Timestamp.now(),
      triggerRequested: false
    });

    console.log("🎉 LoLaBo Agent run completed successfully!");
  } catch (e) {
    console.error("💥 LoLaBo Agent failed:", e);
    process.exit(1);
  }
}

runAgent();
