"use strict";
// agent/writer.ts
// AI Writer Module for LoLaBo
// Transforms raw news items into professional, SEO-optimized blog posts
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeBlogPost = writeBlogPost;
const AUTHOR_PERSONAS = {
    'AI & Machine Learning': { name: "Dr. Larva", designation: "Chief Neural Officer", avatar: "🧬" },
    'Backend & Infrastructure': { name: "Captain Deploy", designation: "Infrastructure Overlord", avatar: "🚀" },
    'Security': { name: "Agent Cocoon", designation: "Director of Digital Defense", avatar: "🛡️" },
    'Frontend Engineering': { name: "Pixel Pete", designation: "Senior Aesthetic Engineer", avatar: "🎨" },
    'Open Source': { name: "Fork Master Flash", designation: "Head of Community Chaos", avatar: "🍴" },
    'Mobile & UX': { name: "Swipe Right Sally", designation: "Mobile Experience Architect", avatar: "📱" },
    'General Tech': { name: "The Lorapok Oracle", designation: "Tech Wisdom Dispenser", avatar: "🔮" }
};
async function writeBlogPost(newsItems, config) {
    console.log(`🧠 Writing blog post using ${config.provider}...`);
    // 1. Selection Strategy: AI picks the most relevant/trending news item to expand
    // For now, we take the top few items and ask the AI to synthesize or pick the best one.
    const newsContext = newsItems.map(n => `[${n.source}] ${n.title}\n${n.content.slice(0, 200)}...`).join('\n\n');
    const systemPrompt = `You are the LoLaBo (Lorapok Labs Blog) Autonomous Writer Agent.
Your goal is to write a high-fidelity, professional tech blog post based on trending news.

TARGET AUDIENCE: ${config.targetAudience}
TONE: ${config.tone}

INSTRUCTIONS:
1. Review the provided news context and pick the MOST IMPACTFUL story or synthesize a trend.
2. Write a comprehensive, Medium-quality technical article (~800-1200 words).
3. Use Markdown formatting (H1, H2, H3, bold, lists, code blocks).
4. Include an 'Excerpt' (2 concise sentences) and an engaging, click-worthy 'Title'.
5. Include 'Tags' array: MUST always include 'LorapokLabs' and 'Lorapok', plus 3-5 specific technical tags (e.g., 'WebDev', 'Architecture', 'AI', 'OpenSource', 'Cloud').
6. Category must be chosen from: AI & Machine Learning, Backend & Infrastructure, Security, Frontend Engineering, Open Source, Mobile & UX, General Tech.
7. Create an SEO object:
   - 'metaTitle': Search-optimized title (50-60 characters, mentioning topic & Lorapok Labs)
   - 'metaDescription': Compelling search snippet (140-160 characters)
   - 'keywords': Array of 5-8 SEO keywords
8. Include 'imageKeywords' (array of 2-3 specific technical keywords for the cover image) and 'imagePrompt' (a descriptive visual prompt for an editorial tech magazine cover, e.g., 'Futuristic 3D visualization of...').
9. Credit the original sources.

OUTPUT FORMAT (JSON):
{
  "title": "...",
  "excerpt": "...",
  "content": "...",
  "category": "...",
  "tags": ["LorapokLabs", "Lorapok", "..."],
  "imageKeywords": ["...", "..."],
  "imagePrompt": "Futuristic 3D render of ..., dark tech aesthetic, 8k",
  "seo": { 
    "metaTitle": "... | LoLaBo — Lorapok Labs", 
    "metaDescription": "...",
    "keywords": ["LorapokLabs", "Lorapok", "..."]
  }
}`;
    const userPrompt = `TRENDING NEWS CONTEXT:\n${newsContext}\n\nPlease write a masterpiece article for the Lorapok Labs ecosystem based on this data.`;
    // Dynamic API Calling
    let response;
    const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("⚠️ No GEMINI_API_KEY or AI_API_KEY detected. Utilizing LoLaBo Autonomous Offline Synthesis Engine...");
        return synthesizeOfflineArticle(newsItems, config);
    }
    response = await callAIProvider(config.provider, apiKey, systemPrompt, userPrompt);
    const blogData = parseLLMJson(response);
    // Enforce Lorapok Labs tags and sanitize
    const rawTags = Array.isArray(blogData.tags) ? blogData.tags : [];
    const cleanTags = rawTags
        .map((t) => String(t).trim().replace(/^#/, ''))
        .filter((t) => t.length > 0);
    const finalTags = Array.from(new Set(['LorapokLabs', 'Lorapok', ...cleanTags]));
    blogData.tags = finalTags;
    // Enforce hashtags in markdown content footer
    const hashtags = finalTags.map(t => '#' + t.replace(/[^a-zA-Z0-9]/g, '')).join(' ');
    if (!blogData.content.includes('#LorapokLabs')) {
        blogData.content = blogData.content.trim() + `\n\n---\n*Authored autonomously by LoLaBo Agent • Powered by Lorapok Labs.*\n\n${hashtags}\n`;
    }
    // Enforce SEO metadata
    if (!blogData.seo)
        blogData.seo = {};
    if (!blogData.seo.metaTitle) {
        blogData.seo.metaTitle = `${blogData.title.slice(0, 48)} | LoLaBo — Lorapok Labs`;
    }
    if (!blogData.seo.metaDescription) {
        blogData.seo.metaDescription = (blogData.excerpt || blogData.title).slice(0, 155);
    }
    blogData.seo.keywords = finalTags;
    // Attach Author
    const author = AUTHOR_PERSONAS[blogData.category] || AUTHOR_PERSONAS['General Tech'];
    return {
        ...blogData,
        author,
        source: 'ai-agent',
        status: 'published',
        publishedAt: new Date(),
        views: 0,
        readTime: Math.max(3, Math.ceil(blogData.content.split(/\s+/).length / 200))
    };
}
async function callAIProvider(provider, key, system, user) {
    // Implementation of different AI APIs
    // Defaulting to a standard POST structure used by many (like OpenAI/Groq compatible)
    console.log(`Calling ${provider} API...`);
    if (provider === 'gemini') {
        const candidateModels = [
            'gemini-3.6-flash',
            'gemini-3.5-flash',
            'gemini-3.5-flash-lite',
            'gemini-flash-latest',
            'gemini-flash-lite-latest',
            'gemini-3-flash-preview'
        ];
        let lastError = null;
        for (const model of candidateModels) {
            try {
                console.log(`Attempting Gemini generation with ${model}...`);
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
                const body = {
                    contents: [{ role: 'user', parts: [{ text: `${system}\n\n${user}` }] }],
                    generationConfig: { responseMimeType: "application/json" }
                };
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                const data = await res.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    console.log(`✅ Generation succeeded with ${model}`);
                    return text;
                }
                console.warn(`⚠️ Model ${model} unavailable (${data?.error?.code || 'status'}): ${data?.error?.message || 'Empty'}. Trying next model...`);
                lastError = new Error(data?.error?.message || 'Empty response');
                // Brief pause before fallback to avoid hitting concurrency limits
                await new Promise((resolve) => setTimeout(resolve, 1200));
            }
            catch (err) {
                lastError = err;
                console.warn(`⚠️ Exception calling ${model}:`, err);
                await new Promise((resolve) => setTimeout(resolve, 1200));
            }
        }
        throw lastError || new Error("All Gemini model candidates failed.");
    }
    let url = '';
    let body = {};
    if (provider === 'groq') {
        url = 'https://api.groq.com/openai/v1/chat/completions';
        body = {
            model: 'llama3-8b-8192',
            messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
            response_format: { type: "json_object" }
        };
    }
    else {
        // Fallback/Placeholder for others
        url = 'https://api.openai.com/v1/chat/completions';
        body = {
            model: provider === 'openai' ? 'gpt-4-turbo' : 'claude-3-opus-20240229',
            messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
            response_format: { type: "json_object" }
        };
    }
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
        console.error("AI API Error details:", JSON.stringify(data));
        throw new Error(`AI response missing content: ${data?.error?.message || JSON.stringify(data)}`);
    }
    return content;
}
function parseLLMJson(raw) {
    let cleaned = raw.trim();
    if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    }
    else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    try {
        return JSON.parse(cleaned);
    }
    catch {
        try {
            let inString = false;
            let escaped = false;
            let result = '';
            for (let i = 0; i < cleaned.length; i++) {
                const char = cleaned[i];
                if (escaped) {
                    result += char;
                    escaped = false;
                    continue;
                }
                if (char === '\\') {
                    result += char;
                    escaped = true;
                    continue;
                }
                if (char === '"') {
                    inString = !inString;
                    result += char;
                    continue;
                }
                if (inString) {
                    if (char === '\n') {
                        result += '\\n';
                    }
                    else if (char === '\r') {
                        result += '\\r';
                    }
                    else if (char === '\t') {
                        result += '\\t';
                    }
                    else if (char.charCodeAt(0) < 32) {
                        // omit invalid ASCII control characters
                    }
                    else {
                        result += char;
                    }
                }
                else {
                    result += char;
                }
            }
            return JSON.parse(result);
        }
        catch (innerErr) {
            console.error("Failed to parse LLM JSON output:", raw.slice(0, 500));
            throw innerErr;
        }
    }
}
function synthesizeOfflineArticle(newsItems, config) {
    const topNews = newsItems[0] || {
        title: 'Distributed State Synchronization and Autonomous Agent Topologies',
        content: 'Deep architectural exploration of edge consensus, decoupled microservice topologies, and fault-tolerant telemetry in multi-agent systems.',
        source: 'Lorapok Research Lab',
        url: 'https://lorapok.tech/blog'
    };
    const rawTitle = topNews.title.replace(/^\[[^\]]+\]\s*/, '').trim();
    const cleanTopic = rawTitle.replace(/[^\w\s-]/g, '').trim();
    const title = `Architectural Deep Dive: ${cleanTopic}`;
    const excerpt = `A rigorous systems architecture investigation analyzing concurrency guarantees, state isolation, and zero-downtime execution in ${cleanTopic}.`;
    const category = 'Backend & Infrastructure';
    const author = AUTHOR_PERSONAS[category] || AUTHOR_PERSONAS['General Tech'];
    const finalTags = ['LorapokLabs', 'Lorapok', 'Architecture', 'Microservices', 'DistributedSystems', 'CloudNative'];
    const content = `
## 1. Executive Architecture Summary

Modern distributed applications demand decoupled execution layers capable of scaling under dynamic load patterns without introducing single-point-of-failure bottlenecks. When examining **${cleanTopic}**, software engineering teams must balance state synchronization overhead against raw throughput and deterministic latency budgets.

At **Lorapok Labs**, our autonomous infrastructure research demonstrates that shifting from monolithic coordination to autonomous microservices with asynchronous telemetry radically reduces blast radiuses while maintaining strict operational observability.

---

## 2. Core Systems Architecture

The architectural topology separates the event ingestion pipeline, autonomous synthesis worker pools, and persistence storage into distinct failure domains:

\`\`\`arch
┌─────────────────────────────────────────────────────────────┐
│                 SYSTEM TOPOLOGY SPECIFICATION               │
└─────────────────────────────────────────────────────────────┘
                                                               
    [ External Telemetry ] ───► [ Ingestion Edge Router ]      
                                         │                     
                                         ▼                     
                       ┌───────────────────────────────────┐   
                       │   LoLaBo Microservice Runtime     │   
                       │  • Autonomous Event Scheduler     │   
                       │  • News Collector Pipeline        │   
                       │  • Neural Synthesis Engine        │   
                       └─────────────────┬─────────────────┘   
                                         │                     
              ┌──────────────────────────┼──────────────────────────┐
              ▼                          ▼                          ▼
     [ Local JSON Store ]       [ Cloud Firestore ]      [ Discord Webhook ]
    (Static Cache & Sitemaps)   (Enterprise Registry)   (Realtime Broadcast)
\`\`\`

---

## 3. Architectural Metrics & Performance Tradeoffs

Selecting the correct persistence and event dispatch pattern requires evaluating cold start characteristics, runtime overhead, and data integrity guarantees:

| Architectural Metric | Microservice Daemon | Serverless FaaS | Monolithic Worker |
| :--- | :--- | :--- | :--- |
| **Execution Latency** | < 15ms persistent loop | 150-800ms cold start | Variable batch tick |
| **Memory Isolation** | Sandboxed container runtime | Ephemeral container | Shared heap memory |
| **Telemetry Dispatch** | Continuous event-driven streaming | Log shipping post-run | Polling thread loop |
| **State Resilience** | Multi-tier (Disk + Cloud) | Stateless cloud DB | In-memory singleton |
| **Failure Blast Radius** | Isolated to service boundary | Isolated to invocation | Entire cluster impact |

---

## 4. Key Takeaways for Systems Architects

1. **Decouple Event Producers from Consumers**: Never allow downstream persistence slowdowns or remote API latency to block autonomous dispatch loops.
2. **Implement Dual-Tier Fallback Persistence**: Always maintain deterministic local file caches alongside enterprise remote databases to preserve uninterrupted availability.
3. **Automate Continuous Verification**: Pair autonomous background schedulers with end-to-end telemetry and healthcheck probes (\`/health\` & \`/metrics\`).

---
*Authored autonomously by LoLaBo Agent • Powered by Lorapok Labs.*

#LorapokLabs #Lorapok #Architecture #Microservices #DistributedSystems #CloudNative
`.trim();
    return {
        title,
        excerpt,
        content,
        category,
        tags: finalTags,
        imageKeywords: ['cloud architecture', 'distributed systems', 'datacenter'],
        imagePrompt: `High-fidelity 3D visualization of distributed systems architecture, glowing holographic nodes, cybernetic emerald matrix, 8k resolution, cinematic lighting`,
        seo: {
            metaTitle: `${title.slice(0, 48)} | LoLaBo — Lorapok Labs`,
            metaDescription: excerpt.slice(0, 155),
            keywords: finalTags
        },
        author,
        source: topNews.source || 'ai-agent',
        status: 'published',
        publishedAt: new Date(),
        views: 0,
        readTime: 5
    };
}
