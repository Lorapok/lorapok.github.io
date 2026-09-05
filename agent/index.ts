// agent/index.ts
// LoLaBo Orchestrator Script
// Designed to run in GitHub Actions environment

import * as admin from 'firebase-admin';
import { collectNews } from './collector';
import { writeBlogPost } from './writer';
import { generateCoverImage } from './imageGen';
import { distributeSocially } from './distributor';

// ─── Firebase Initialization ───
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

if (serviceAccount.project_id) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT not found. Running in dry-run mode.");
}

const db = admin.firestore();

async function runAgent() {
  console.log("🚀 Starting LoLaBo Agent...");

  // 1. Fetch Config
  const configDoc = await db.collection('agent_config').doc('lolabo_settings').get();
  const config = configDoc.exists ? configDoc.data() : null;

  if (!config) {
    console.error("❌ Agent config not found in Firestore. Please configure in Admin Panel.");
    return;
  }

  if (!config.isEnabled && !process.env.FORCE_RUN) {
    console.log("⏸️ Agent is currently disabled. Skipping run.");
    return;
  }

  // 2. Check Interval or Manual Trigger
  const lastRun = config.lastRunAt?.toDate() || new Date(0);
  const now = new Date();
  const hoursSinceLastRun = (now.getTime() - lastRun.getTime()) / (1000 * 60 * 60);
  const isManualTrigger = config.triggerRequested === true;

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
    const socialResults = await distributeSocially(blogPost, config.enabledSocials || []);
    
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
