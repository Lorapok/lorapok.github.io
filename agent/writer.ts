// agent/writer.ts
// AI Writer Module for LoLaBo
// Transforms raw news items into professional, SEO-optimized blog posts

import { NewsItem } from './collector';

export interface AuthorPersona {
  name: string;
  designation: string;
  avatar: string;
}

const AUTHOR_PERSONAS: Record<string, AuthorPersona> = {
  'AI & Machine Learning': { name: "Dr. Larva", designation: "Chief Neural Officer", avatar: "🧬" },
  'Backend & Infrastructure': { name: "Captain Deploy", designation: "Infrastructure Overlord", avatar: "🚀" },
  'Security': { name: "Agent Cocoon", designation: "Director of Digital Defense", avatar: "🛡️" },
  'Frontend Engineering': { name: "Pixel Pete", designation: "Senior Aesthetic Engineer", avatar: "🎨" },
  'Open Source': { name: "Fork Master Flash", designation: "Head of Community Chaos", avatar: "🍴" },
  'Mobile & UX': { name: "Swipe Right Sally", designation: "Mobile Experience Architect", avatar: "📱" },
  'General Tech': { name: "The Lorapok Oracle", designation: "Tech Wisdom Dispenser", avatar: "🔮" }
};

export interface Citation {
  id?: string;
  title: string;
  source: string;
  url?: string;
  author?: string;
  year?: number | string;
  relevance?: string;
}

export function extractCitationsFromMarkdown(content: string): Citation[] {
  const citations: Citation[] = [];
  const refMatch = content.split(/## (?:[0-9]+\.\s*)?(?:References|Citations|Technical Citations|Bibliography)/i);
  if (refMatch.length < 2) return citations;

  const refSection = refMatch[refMatch.length - 1];
  const lines = refSection.split('\n');
  let counter = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    if (!trimmed.startsWith('-') && !trimmed.startsWith('*') && !/^\d+\./.test(trimmed) && !/^\[\^?\d+\]/.test(trimmed)) continue;

    const urlMatch = trimmed.match(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/);
    const bareUrlMatch = trimmed.match(/(https?:\/\/[^\s\)]+)/);
    const cleanText = trimmed
      .replace(/^[-*\d\.]+\s*/, '')
      .replace(/^\[\^?\d+\]:?\s*/, '')
      .trim();

    if (urlMatch) {
      citations.push({
        id: String(counter++),
        title: urlMatch[1].replace(/[*_]/g, ''),
        source: 'Technical Specification / Research',
        url: urlMatch[2],
        year: '2024'
      });
    } else if (bareUrlMatch) {
      const titleOnly = cleanText.replace(bareUrlMatch[0], '').replace(/[()—–-]/g, ' ').trim();
      citations.push({
        id: String(counter++),
        title: titleOnly || cleanText.slice(0, 80),
        source: 'Formal Specification',
        url: bareUrlMatch[0],
        year: '2024'
      });
    } else if (cleanText.length > 12) {
      citations.push({
        id: String(counter++),
        title: cleanText,
        source: 'Peer-Reviewed Technical Reference',
        year: '2024'
      });
    }
  }

  return citations;
}

export async function writeBlogPost(
  newsItems: NewsItem[], 
  config: { provider: string, targetAudience: string, tone: string },
  existingPosts: any[] = []
) {
  console.log(`🧠 Writing blog post using ${config.provider}...`);

  // 1. Selection Strategy: AI picks the most relevant/trending news item to expand
  const newsContext = newsItems.map(n => `[${n.source || 'Tech News'}] ${n.title || ''}\n${(n.content || n.title || '').slice(0, 250)}...`).join('\n\n');

  const existingTitlesList = (existingPosts || []).slice(0, 15).map(p => `• ${p.title}`).join('\n');
  const antiDupSection = existingTitlesList
    ? `\nPREVIOUSLY PUBLISHED TOPICS (STRICT ANTI-DUPLICATION RULE — DO NOT RE-COVER OR DUPLICATE THESE SUBJECTS):\n${existingTitlesList}\n`
    : '';

  const systemPrompt = `You are the LoLaBo (Lorapok Labs Blog) Principal Autonomous Systems Architect & Technical Author.
Your mission is to produce authoritative, publication-grade, long-form technical treatises (~1800–2800+ words) with exhaustive technical breakdowns tailored to the chosen editorial format, accompanied by formal citations.

TARGET AUDIENCE: ${config.targetAudience}
TONE: ${config.tone} — authoritative, rigorous, deep-dive systems engineering precision.
${antiDupSection}
EDITORIAL TYPE TAXONOMY (You MUST choose one value for 'type' and follow its detailed structural breakdown):

1. "ARCHITECTURE BLUEPRINT" (Distributed topologies, cloud runtimes, consensus, network mesh)
   • Section 1: Architectural Motivation & Scalability Cliff
   • Section 2: Component Topology & Invariants (MUST include ASCII architecture diagram)
   • Section 3: Data Plane vs. Control Plane Protocol Dynamics (wire formats, serialization, RPC sync)
   • Section 4: Concurrency, Sharding & High-Availability Boundaries
   • Section 5: Failure Modes & Chaos Engineering (split-brain mitigation, backpressure, degrade-gracefully paths)

2. "DEEP DIVE" (Language internals, runtime engines, compiler passes, memory models)
   • Section 1: Executive Overview & The Abstraction Leak
   • Section 2: Low-Level Mechanics & Memory Layout (struct alignments, cache lines, zero-copy buffers)
   • Section 3: Annotated Code Deconstruction (production-grade Rust/Go/C++ snippets with explanations)
   • Section 4: Runtime Execution Tracing & Syscall Analysis (kernel transitions, context switches)
   • Section 5: Production Hardening & Anti-Patterns to Avoid

3. "BENCHMARK & PERF" (Empirical measurements, hardware testing, latency audits)
   • Section 1: The Performance Frontier & Hypothesis
   • Section 2: Benchmark Rig & Rigorous Methodology (hardware, CPU pinning, kernel params)
   • Section 3: Empirical Measurements & Latency Breakdown (MUST include Markdown comparative tables: P50, P90, P99, P99.9, IOPS)
   • Section 4: Root Cause Bottleneck Analysis (lock contention, TLB misses, cache invalidation)
   • Section 5: Optimization Prescription & Before/After Delta

4. "CASE STUDY" (Enterprise pivots, architectural post-mortems, legacy rewrites)
   • Section 1: Legacy Context & The Scaling Cliff
   • Section 2: Multi-Dimensional Trade-off Matrix (Comparison of evaluated architectures)
   • Section 3: Phased Migration Strategy & Zero-Downtime Cutover (canary routing, dual-write pipelines)
   • Section 4: Production Incidents & Unforeseen Edge Cases
   • Section 5: Measurable Outcomes, Latency Wins & Retrospective

5. "IMPLEMENTATION SPEC" (RFC-style formal specifications, protocol designs)
   • Section 1: RFC Scope, Terminology & Guarantees
   • Section 2: Wire Format, Bytecode & API Schemas
   • Section 3: Reference Implementation with Annotated Code Blocks
   • Section 4: Security Threat Modeling & Invariant Proofs
   • Section 5: Rollout Phases & Backward Compatibility

MANDATORY CITATIONS REQUIREMENT:
Every article MUST incorporate formal technical citations and academic references:
1. Inline citations in the body text (e.g., [1], [2], [RFC 9000], [Axboe 2019]).
2. A dedicated markdown section at the very end of the article titled:
   "## References & Technical Citations"
   Listing 3 to 6 authoritative papers, RFCs, kernel docs, or technical monographs with full title, author, publication year, and source link.
3. A structured 'citations' array in the JSON response containing the citation objects.
4. Include 'CitationsAvailable' in the 'tags' array.

RESEARCH-MATCHED TECHNICAL COVER IMAGE SPECIFICATION:
The 'imagePrompt' MUST be an ultra-detailed, domain-specific visual blueprint prompt directly illustrating the core engineering mechanism, data structures, or hardware components analyzed in this research article:
• Never produce generic sci-fi, abstract humans, or generic cityscapes.
• Explicitly illustrate the exact technical subject (e.g., for eBPF: 'Isometric cutaway diagram of Linux kernel space and user space boundary with circular ring buffers, packet filtering execution path, glowing neon cyan memory registers, dark charcoal matte chassis, octane render, 8k, photorealistic technical blueprint, zero text, zero watermark').
• For consensus/distributed systems: 'State machine replication network nodes arranged in quorum ring, Raft leader election pulse, write-ahead log entries in emerald holographic shards, dark server rack backdrop, volumetric depth of field, 8k, zero text, zero watermark'.
• For compilers/runtimes: 'AST abstract syntax tree nodes transforming into optimized bytecode assembly instructions, zero-copy buffer pools, dark glass aesthetic, glowing fiber optic traces, octane render 8k'.

OUTPUT FORMAT (JSON):
{
  "title": "Comprehensive, technical, click-worthy title",
  "excerpt": "2-sentence compelling architectural summary",
  "type": "ARCHITECTURE BLUEPRINT | DEEP DIVE | BENCHMARK & PERF | CASE STUDY | IMPLEMENTATION SPEC",
  "category": "Backend & Infrastructure | AI & Machine Learning | Security | Frontend Engineering | Open Source | Mobile & UX | General Tech",
  "content": "# Full markdown text (~1800-2800 words with sections, diagrams, tables, code, and ## References & Technical Citations) ...",
  "tags": ["LorapokLabs", "Lorapok", "CitationsAvailable", "Rust", "Architecture", "DistributedSystems"],
  "citations": [
    {
      "id": "1",
      "title": "io_uring: Asynchronous I/O Framework for Linux",
      "author": "Jens Axboe",
      "source": "Kernel.org Documentation / Linux Git",
      "url": "https://kernel.dk/io_uring.pdf",
      "year": "2019",
      "relevance": "Defines the submission queue (SQ) and completion queue (CQ) ring-buffer semantics."
    }
  ],
  "imageKeywords": ["cloud architecture", "distributed systems", "datacenter"],
  "imagePrompt": "Detailed domain-specific technical prompt specifically illustrating this article's core mechanisms (no text, no watermark, 8k, octane render)",
  "seo": {
    "metaTitle": "... | LoLaBo — Lorapok Labs",
    "metaDescription": "...",
    "keywords": ["LorapokLabs", "Lorapok", "..."]
  }
}`;

  const userPrompt = `TRENDING NEWS CONTEXT:\n${newsContext}\n\nPlease write an authoritative, long-form technical treatise (~1800-2800 words) for Lorapok Labs. Select the appropriate editorial type, execute its structured breakdown with high depth, and provide formal citations. Ensure it does not duplicate any previously published topic.`;

  // Dynamic API Calling
  let response;
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("❌ No GEMINI_API_KEY or AI_API_KEY detected. LoLaBo operates in 100% online AI mode. Please configure GEMINI_API_KEY in your environment or GitHub Secrets.");
  }

  let blogData: any;
  try {
    response = await callAIProvider(config.provider, apiKey, systemPrompt, userPrompt);
    blogData = parseLLMJson(response);
  } catch (aiErr: any) {
    console.error("❌ Online AI generation failed:", aiErr.message);
    throw new Error(`LoLaBo Online AI generation failed: ${aiErr.message}. Offline fallback is disabled per 100% online policy.`);
  }

  // Completeness & Conclusion Validation Barrier
  const completeness = validateContentCompleteness(blogData.content);
  if (!completeness.isComplete) {
    console.warn(`⚠️ Article content incomplete (${completeness.reason}). Running online completion pass...`);
    try {
      const completionSuffix = await completeArticleSections(blogData.title, blogData.content, apiKey, config.provider);
      if (completionSuffix) {
        blogData.content = blogData.content.trim() + "\n\n" + completionSuffix.trim();
        console.log("✅ Concluding sections synthesized and attached successfully.");
      }
    } catch (compErr: any) {
      console.warn("⚠️ Completion pass encountered error:", compErr.message);
    }
  }

  // Enforce Lorapok Labs tags and sanitize
  const rawTags: string[] = Array.isArray(blogData.tags) ? blogData.tags : [];
  const cleanTags = rawTags
    .map((t: string) => String(t).trim().replace(/^#/, ''))
    .filter((t: string) => t.length > 0);
  
  const finalTags = Array.from(new Set([
    'LorapokLabs',
    'Lorapok',
    'CitationsAvailable',
    ...cleanTags
  ]));
  blogData.tags = finalTags;

  // Process citations
  let citations: Citation[] = Array.isArray(blogData.citations) ? blogData.citations : [];
  if (citations.length === 0) {
    citations = extractCitationsFromMarkdown(blogData.content);
  }
  blogData.citations = citations;

  // Enforce hashtags in markdown content footer
  const hashtags = finalTags.map(t => '#' + t.replace(/[^a-zA-Z0-9]/g, '')).join(' ');
  if (!blogData.content.includes('#LorapokLabs')) {
    blogData.content = blogData.content.trim() + `\n\n---\n*Authored autonomously by LoLaBo Agent • Powered by Lorapok Labs.*\n\n${hashtags}\n`;
  }

  // Enforce SEO metadata
  if (!blogData.seo) blogData.seo = {};
  if (!blogData.seo.metaTitle) {
    blogData.seo.metaTitle = `${blogData.title.slice(0, 48)} | LoLaBo — Lorapok Labs`;
  }
  if (!blogData.seo.metaDescription) {
    blogData.seo.metaDescription = (blogData.excerpt || blogData.title).slice(0, 155);
  }
  blogData.seo.keywords = finalTags;
  
  // Attach Author
  const author = AUTHOR_PERSONAS[blogData.category] || AUTHOR_PERSONAS['General Tech'];
  
  // Calculate dynamic read time based on actual word count (~220 wpm)
  const wordCount = (blogData.content || '').split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(5, Math.ceil(wordCount / 220));

  return {
    ...blogData,
    type: blogData.type || 'DEEP DIVE',
    author,
    source: 'ai-agent',
    status: 'published',
    publishedAt: new Date(),
    views: 0,
    readTime
  };
}

export function validateContentCompleteness(content: string): { isComplete: boolean; reason?: string } {
  if (!content || typeof content !== 'string') {
    return { isComplete: false, reason: "Content is empty" };
  }
  const clean = content.trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length < 800) {
    return { isComplete: false, reason: `Content too short (${words.length} words, expected >= 800)` };
  }

  const lastChar = clean[clean.length - 1];
  const validPunctuation = new Set(['.', '!', '?', ')', ']', '`', '*', '_', '\n', '>']);
  if (!validPunctuation.has(lastChar) && !clean.endsWith('---')) {
    return { isComplete: false, reason: `Content ends abruptly mid-sentence (ends with: '${clean.slice(-25)}')` };
  }

  const lower = clean.toLowerCase();
  const hasConclusion = lower.includes('## conclusion') || 
                        lower.includes('## key takeaways') || 
                        lower.includes('## architectural recommendations') || 
                        lower.includes('## summary') ||
                        lower.includes('## takeaways') ||
                        lower.includes('## architectural takeaways');
  if (!hasConclusion) {
    return { isComplete: false, reason: "Missing concluding section (## Conclusion or ## Key Takeaways)" };
  }

  const hasReferences = lower.includes('## references') || lower.includes('## technical citations') || lower.includes('## citations');
  if (!hasReferences) {
    return { isComplete: false, reason: "Missing references section (## References & Technical Citations)" };
  }

  return { isComplete: true };
}

async function completeArticleSections(title: string, existingContent: string, apiKey: string, provider: string): Promise<string> {
  const prompt = `You are completing an authoritative long-form technical article for Lorapok Labs.
Article Title: "${title}"
The article currently ends abruptly with the following text:
"""
${existingContent.slice(-1200)}
"""

Please write the missing concluding sections to complete the article rigorously:
1. "## Key Takeaways & Summary for Systems Architects" (synthesizing the technical lessons, performance boundaries, and implementation recommendations).
2. "## References & Technical Citations" (listing 3-5 formal whitepapers, RFCs, kernel docs, or technical monographs with full authors, year, and URLs).

Return ONLY the markdown text for these sections. Do not repeat the existing text.`;

  const completion = await callAIProvider(provider, apiKey, "You are a Principal Systems Architect. Write only high-depth markdown for the requested concluding sections.", prompt, false);
  return completion;
}

async function callAIProvider(provider: string, key: string, system: string, user: string, jsonMode = true) {
  // If key is a Gemini API key or provider is gemini, prioritize Gemini
  const isGeminiKey = key.startsWith('AQ.') || key.startsWith('AIza') || Boolean(process.env.GEMINI_API_KEY);
  const effectiveProvider = (provider === 'gemini' || isGeminiKey) ? 'gemini' : provider;
  console.log(`Calling ${effectiveProvider} API (jsonMode: ${jsonMode})...`);
  
  if (effectiveProvider === 'gemini') {
    const requestedPro = provider === 'gemini-pro' || provider === 'gemini-2.5-pro';
    const candidateModels = requestedPro 
      ? [
          'gemini-2.5-pro',
          'gemini-2.5-flash',
          'gemini-2.0-flash',
          'gemini-1.5-pro',
          'gemini-1.5-flash'
        ]
      : [
          'gemini-2.5-flash',
          'gemini-2.5-pro',
          'gemini-2.0-flash',
          'gemini-1.5-flash',
          'gemini-1.5-pro'
        ];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        console.log(`Attempting Gemini generation with ${model}...`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const generationConfig: any = {
          maxOutputTokens: 8192,
          temperature: 0.7
        };
        if (jsonMode) {
          generationConfig.responseMimeType = "application/json";
        }

        const body = {
          contents: [{ role: 'user', parts: [{ text: `${system}\n\n${user}` }] }],
          generationConfig
        };
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data: any = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          console.log(`✅ Generation succeeded with ${model}`);
          return text;
        }
        console.warn(`⚠️ Model ${model} unavailable (${data?.error?.code || 'status'}): ${data?.error?.message || 'Empty'}. Trying next candidate...`);
        lastError = new Error(data?.error?.message || `Model ${model} returned empty response`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err) {
        lastError = err;
        console.warn(`⚠️ Exception calling ${model}:`, err);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    throw lastError || new Error("All Gemini model candidates failed.");
  }

  let url = '';
  let body: any = {};

  if (provider === 'groq') {
    url = 'https://api.groq.com/openai/v1/chat/completions';
    body = {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      ...(jsonMode ? { response_format: { type: "json_object" } } : {})
    };
  } else {
    url = 'https://api.openai.com/v1/chat/completions';
    body = {
      model: provider === 'openai' ? 'gpt-4o' : 'claude-3-5-sonnet-20241022',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      ...(jsonMode ? { response_format: { type: "json_object" } } : {})
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

  const data: any = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    console.error("AI API Error details:", JSON.stringify(data));
    throw new Error(`AI response missing content: ${data?.error?.message || JSON.stringify(data)}`);
  }
  return content;
}

function repairTruncatedJson(str: string): string {
  let repaired = str.trim();
  let quotes = 0;
  let escaped = false;
  for (let i = 0; i < repaired.length; i++) {
    if (escaped) { escaped = false; continue; }
    if (repaired[i] === '\\') { escaped = true; continue; }
    if (repaired[i] === '"') { quotes++; }
  }
  if (quotes % 2 !== 0) {
    repaired += '"';
  }
  const openBraces = (repaired.match(/\{/g) || []).length;
  const closeBraces = (repaired.match(/\}/g) || []).length;
  for (let i = 0; i < (openBraces - closeBraces); i++) {
    repaired += '}';
  }
  const openBrackets = (repaired.match(/\[/g) || []).length;
  const closeBrackets = (repaired.match(/\]/g) || []).length;
  for (let i = 0; i < (openBrackets - closeBrackets); i++) {
    repaired += ']';
  }
  return repaired;
}

function parseLLMJson(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  // 1. Direct JSON.parse
  try {
    return JSON.parse(cleaned);
  } catch {}

  // 2. Try with Truncation Repair
  try {
    const repaired = repairTruncatedJson(cleaned);
    return JSON.parse(repaired);
  } catch {}

  // 3. String literal escape normalization
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
        } else if (char === '\r') {
          result += '\\r';
        } else if (char === '\t') {
          result += '\\t';
        } else if (char.charCodeAt(0) < 32) {
          // omit invalid control characters
        } else {
          result += char;
        }
      } else {
        result += char;
      }
    }
    return JSON.parse(repairTruncatedJson(result));
  } catch {}

  // 4. Regex-based field extraction fallback
  try {
    const extractString = (field: string): string => {
      const match = cleaned.match(new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, 's'));
      if (match) {
        try { return JSON.parse(`"${match[1]}"`); } catch { return match[1].replace(/\\n/g, '\n'); }
      }
      return '';
    };

    const extractContent = (): string => {
      const match = cleaned.match(/"content"\s*:\s*"([\s\S]*?)(?:",\s*"(?:category|tags|imageKeywords|imagePrompt|seo)"|\s*"\s*\}|$)/);
      if (match && match[1]) {
        return match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
      }
      return '';
    };

    const title = extractString('title');
    const excerpt = extractString('excerpt');
    const type = extractString('type') || 'DEEP DIVE';
    const content = extractContent() || excerpt;
    const category = extractString('category') || 'Backend & Infrastructure';

    if (title && (content || excerpt)) {
      console.log(`ℹ️ Recovered article fields via regex fallback: "${title}" [${type}]`);
      const extractedCitations = extractCitationsFromMarkdown(content);
      return {
        title,
        excerpt: excerpt || title,
        type,
        content: content || excerpt,
        category,
        tags: ['LorapokLabs', 'Lorapok', 'CitationsAvailable', 'Architecture', 'Cloud'],
        citations: extractedCitations,
        imageKeywords: ['technology', 'architecture', 'distributed systems'],
        imagePrompt: `Futuristic 3D visualization of ${title}, dark tech aesthetic, 8k`,
        seo: {
          metaTitle: `${title.slice(0, 48)} | LoLaBo — Lorapok Labs`,
          metaDescription: (excerpt || title).slice(0, 155),
          keywords: ['LorapokLabs', 'Lorapok', 'CitationsAvailable']
        }
      };
    }
  } catch {}

  console.error("Failed to parse LLM JSON output:", raw.slice(0, 500));
  throw new Error("Could not parse LLM JSON response");
}


// ─── 100% Online AI Policy ───
// Offline synthesis has been permanently removed per system policy.
// LoLaBo requires active online AI generation via Google Gemini, Groq, or OpenAI.

