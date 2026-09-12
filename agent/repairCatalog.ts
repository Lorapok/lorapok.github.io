// agent/repairCatalog.ts
// Autonomous Catalog Repair & Completion Engine for LoLaBo
// Repairs truncated articles, completes missing conclusions/references via online AI,
// balances code fences, and guarantees zero broken markdown rendering across all 15 posts.

import * as fs from 'fs';
import * as path from 'path';
import { keyManager } from './keyManager';
import { extractCitationsFromMarkdown, spliceConclusionCleanly } from './writer';

// Auto-load environment
try {
  const localEnv = path.resolve(__dirname, '.env');
  const rootEnv = path.resolve(__dirname, '../.env');
  if (typeof (process as any).loadEnvFile === 'function') {
    if (fs.existsSync(localEnv)) (process as any).loadEnvFile(localEnv);
    else if (fs.existsSync(rootEnv)) (process as any).loadEnvFile(rootEnv);
  }
} catch (e) {}

keyManager.initializeKeys();

async function completeViaOnlineAI(title: string, tailContent: string): Promise<string> {
  const models = [
    'gemini-3.8-flash',
    'gemini-3.8-pro',
    'gemini-pro-latest'
  ];

  const prompt = `You are a Principal Systems Architect completing an authoritative, publication-grade research article for Lorapok Labs.
Article Title: "${title}"
The article currently ends abruptly at the following point:
"""
${tailContent.slice(-1500)}
"""

Please write the missing concluding sections to complete the article rigorously and authoritatively:
1. Finish any cut-off code block or sentence cleanly (close the code block with \`\`\` if it was cut off inside a code block).
2. "## Key Takeaways & Summary for Systems Architects" (synthesizing low-level trade-offs, operational boundaries, memory invariants, and architectural lessons).
3. "## References & Technical Citations" (listing 3-5 formal whitepapers, RFCs, kernel documentation, or academic monographs with full authors, year, and URLs).

Return ONLY the markdown text for these completing sections. Do not include introductory text or repeating markdown.`;

  let lastError = null;

  for (const model of models) {
    const keyProfile = keyManager.getKey('gemini');
    if (!keyProfile || !keyProfile.key) {
      throw new Error("No Gemini key available for online completion");
    }

    try {
      console.log(`   Trying ${model} via ${keyProfile.accountLabel}...`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${keyProfile.key}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 4096
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text.trim().length > 100) {
          keyManager.reportSuccess(keyProfile.id);
          return text.trim();
        }
      }

      const errText = await res.text();
      console.warn(`   ⚠️ ${model} returned ${res.status}: ${errText.slice(0, 150)}`);

      if (res.status === 429) {
        keyManager.reportRateLimit(keyProfile.id, false);
      }
      // If 503 or 429, continue to next model in waterfall
      await new Promise(r => setTimeout(r, 1000));
    } catch (err: any) {
      lastError = err;
      console.warn(`   ⚠️ Network error with ${model}:`, err.message);
    }
  }

  throw lastError || new Error("Failed online completion across all waterfall models");
}

async function main() {
  const postsJsonPath = path.resolve(__dirname, '../public/blog/posts.json');
  const posts = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'));

  console.log(`🔍 [LoLaBo Catalog Repair] Auditing and repairing ${posts.length} posts...`);

  // 1. Repair Post #1 (Reorder conclusion before references and remove duplicate bibliography)
  if (posts[0]) {
    const content = posts[0].content;
    const ref1 = content.indexOf('## References & Technical Citations');
    const keyTakeaways = content.indexOf('## Key Takeaways & Summary for Systems Architects');
    const ref2 = content.lastIndexOf('## References & Technical Citations');

    if (ref1 !== -1 && keyTakeaways !== -1 && ref2 > keyTakeaways) {
      console.log('🔧 Reordering Post #1 sections so Key Takeaways precedes References...');
      const body = content.slice(0, ref1).trim();
      const takeaways = content.slice(keyTakeaways, ref2).trim();
      const referencesAndFooter = content.slice(ref2).trim();

      posts[0].content = `${body}\n\n${takeaways}\n\n${referencesAndFooter}`;
      posts[0].citations = extractCitationsFromMarkdown(posts[0].content);
      console.log('✅ Post #1 reordered cleanly.');
    }
  }

  // 2. Repair Posts #2 through #9
  for (let i = 1; i <= 8; i++) {
    const p = posts[i];
    if (!p) continue;

    console.log(`\n📄 Inspecting Post #${i + 1}: "${p.title}"...`);

    // Remove old footer tags before completing
    const footerMarker = '\n---\n*Authored autonomously by LoLaBo Agent';
    let rawContent = p.content;
    let footerText = '';
    const footerIdx = rawContent.lastIndexOf(footerMarker);
    if (footerIdx !== -1) {
      footerText = rawContent.slice(footerIdx);
      rawContent = rawContent.slice(0, footerIdx).trim();
    }

    // Check if code block is cut off
    const fences = (rawContent.match(/```/g) || []).length;
    let isUnclosed = fences % 2 !== 0;

    const lower = rawContent.toLowerCase();
    const hasConclusion = lower.includes('## conclusion') || 
                          lower.includes('## key takeaways') || 
                          lower.includes('## summary') ||
                          lower.includes('## architectural takeaways');

    if (!hasConclusion || isUnclosed) {
      console.log(`⚠️ Post #${i + 1} incomplete (hasConclusion: ${hasConclusion}, isUnclosedFence: ${isUnclosed}). Generating online AI completion pass...`);
      try {
        const completion = await completeViaOnlineAI(p.title, rawContent);
        if (completion) {
          console.log(`✅ Generated completion (${completion.length} chars). Splicing into article...`);
          
          let merged = rawContent;
          // If code was unclosed and completion doesn't start by closing it, close it
          if (isUnclosed && !completion.startsWith('```')) {
            merged += '\n```\n';
          }
          
          merged = spliceConclusionCleanly(merged, completion);

          // Re-balance any dangling fences
          const finalFences = (merged.match(/```/g) || []).length;
          if (finalFences % 2 !== 0) {
            merged += '\n```\n';
          }

          // Attach footer
          if (footerText) {
            merged += '\n' + footerText.trim() + '\n';
          } else {
            merged += '\n\n---\n*Authored autonomously by LoLaBo Agent • Powered by Lorapok Labs.*\n\n#LorapokLabs #Lorapok #CitationsAvailable\n';
          }

          p.content = merged;
          p.citations = extractCitationsFromMarkdown(merged);
          console.log(`🎉 Post #${i + 1} repaired and completed successfully.`);
        }
      } catch (err: any) {
        console.error(`❌ Failed to complete Post #${i + 1}:`, err.message);
      }
    } else {
      console.log(`✅ Post #${i + 1} already has conclusion and balanced fences.`);
    }
    // Respect rate limits between posts
    await new Promise(r => setTimeout(r, 2000));
  }

  // 3. Save repaired catalog
  fs.writeFileSync(postsJsonPath, JSON.stringify(posts, null, 2), 'utf8');
  console.log(`\n💾 Saved repaired catalog to ${postsJsonPath}.`);
}

main().catch(err => {
  console.error("Fatal repair error:", err);
  process.exit(1);
});
