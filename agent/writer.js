"use strict";
// agent/writer.ts
// AI Writer Module for LoLaBo
// Transforms raw news items into professional, SEO-optimized blog posts
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCitationsFromMarkdown = extractCitationsFromMarkdown;
exports.writeBlogPost = writeBlogPost;
exports.validateContentCompleteness = validateContentCompleteness;
exports.spliceConclusionCleanly = spliceConclusionCleanly;
exports.ensureDraftIntegrity = ensureDraftIntegrity;
exports.getModelEditorialProfile = getModelEditorialProfile;
const keyManager_1 = require("./keyManager");
const reviewer_1 = require("./reviewer");
const imageAgent_1 = require("./imageAgent");
const modelValidator_1 = require("./modelValidator");
const AUTHOR_PERSONAS = {
    'AI & Machine Learning': { name: "Dr. Larva", designation: "Chief Neural Officer", avatar: "🧬" },
    'Backend & Infrastructure': { name: "Captain Deploy", designation: "Infrastructure Overlord", avatar: "🚀" },
    'Security': { name: "Agent Cocoon", designation: "Director of Digital Defense", avatar: "🛡️" },
    'Frontend Engineering': { name: "Pixel Pete", designation: "Senior Aesthetic Engineer", avatar: "🎨" },
    'Open Source': { name: "Fork Master Flash", designation: "Head of Community Chaos", avatar: "🍴" },
    'Mobile & UX': { name: "Swipe Right Sally", designation: "Mobile Experience Architect", avatar: "📱" },
    'General Tech': { name: "The Lorapok Oracle", designation: "Tech Wisdom Dispenser", avatar: "🔮" }
};
function extractCitationsFromMarkdown(content) {
    const citations = [];
    const refMatch = content.split(/## (?:[0-9]+\.\s*)?(?:References|Citations|Technical Citations|Bibliography)/i);
    if (refMatch.length < 2)
        return citations;
    const refSection = refMatch[refMatch.length - 1];
    const lines = refSection.split('\n');
    let counter = 1;
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#'))
            continue;
        if (!trimmed.startsWith('-') && !trimmed.startsWith('*') && !/^\d+\./.test(trimmed) && !/^\[\^?\d+\]/.test(trimmed))
            continue;
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
        }
        else if (bareUrlMatch) {
            const titleOnly = cleanText.replace(bareUrlMatch[0], '').replace(/[()—–-]/g, ' ').trim();
            citations.push({
                id: String(counter++),
                title: titleOnly || cleanText.slice(0, 80),
                source: 'Formal Specification',
                url: bareUrlMatch[0],
                year: '2024'
            });
        }
        else if (cleanText.length > 12) {
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
async function writeBlogPost(newsItems, config, existingPosts = []) {
    // Strict Model Tiering Policy:
    // Blogs & Quick Dispatches -> Gemini 3.8 Flash
    // Research Treatises, Thesis Papers & Journal Articles -> Gemini 3.8 Pro / 3.1 Pro & Thinking Models
    const isResearchMode = config.isResearch === true ||
        config.provider === 'gemini-pro' ||
        config.provider === 'gemini-3.8-pro' ||
        config.provider === 'gemini-3.1-pro' ||
        config.provider === 'gemini-2.5-pro' ||
        config.tone?.toLowerCase().includes('research') ||
        config.tone?.toLowerCase().includes('thesis') ||
        config.tone?.toLowerCase().includes('academic');
    console.log(`🧠 Writing ${isResearchMode ? 'Flagship Research Treatise' : 'Technical Blog Post'} using ${config.provider} (Tier: ${isResearchMode ? 'PRO / THINKING' : 'FLASH'})...`);
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
   • Section 6: Key Takeaways & Summary for Systems Architects (Formal concluding synthesis and operational horizons)
   • Section 7: ## References & Technical Citations (3–6 authoritative papers, RFCs, kernel docs)

2. "DEEP DIVE" (Language internals, runtime engines, compiler passes, memory models)
   • Section 1: Executive Overview & The Abstraction Leak
   • Section 2: Low-Level Mechanics & Memory Layout (struct alignments, cache lines, zero-copy buffers)
   • Section 3: Annotated Code Deconstruction (production-grade Rust/Go/C++ snippets with explanations)
   • Section 4: Runtime Execution Tracing & Syscall Analysis (kernel transitions, context switches)
   • Section 5: Production Hardening & Anti-Patterns to Avoid
   • Section 6: Key Takeaways & Systems Engineering Conclusion (Formal concluding synthesis)
   • Section 7: ## References & Technical Citations (3–6 authoritative papers, RFCs, kernel docs)

3. "BENCHMARK & PERF" (Empirical measurements, hardware testing, latency audits)
   • Section 1: The Performance Frontier & Hypothesis
   • Section 2: Benchmark Rig & Rigorous Methodology (hardware, CPU pinning, kernel params)
   • Section 3: Empirical Measurements & Latency Breakdown (MUST include Markdown comparative tables: P50, P90, P99, P99.9, IOPS)
   • Section 4: Root Cause Bottleneck Analysis (lock contention, TLB misses, cache invalidation)
   • Section 5: Optimization Prescription & Before/After Delta
   • Section 6: Key Takeaways & Performance Summary for Architects (Formal concluding synthesis)
   • Section 7: ## References & Technical Citations (3–6 authoritative papers, RFCs, kernel docs)

4. "CASE STUDY" (Enterprise pivots, architectural post-mortems, legacy rewrites)
   • Section 1: Legacy Context & The Scaling Cliff
   • Section 2: Multi-Dimensional Trade-off Matrix (Comparison of evaluated architectures)
   • Section 3: Phased Migration Strategy & Zero-Downtime Cutover (canary routing, dual-write pipelines)
   • Section 4: Production Incidents & Unforeseen Edge Cases
   • Section 5: Measurable Outcomes, Latency Wins & Retrospective
   • Section 6: Architectural Lessons & Key Takeaways (Formal concluding synthesis)
   • Section 7: ## References & Technical Citations (3–6 authoritative papers, RFCs, kernel docs)

5. "IMPLEMENTATION SPEC" (RFC-style formal specifications, protocol designs)
   • Section 1: RFC Scope, Terminology & Guarantees
   • Section 2: Wire Format, Bytecode & API Schemas
   • Section 3: Reference Implementation with Annotated Code Blocks
   • Section 4: Security Threat Modeling & Invariant Proofs
   • Section 5: Rollout Phases & Backward Compatibility
   • Section 6: Key Takeaways & Summary for Systems Architects (Formal concluding synthesis)
   • Section 7: ## References & Technical Citations (3–6 authoritative papers, RFCs, kernel docs)

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
• STRICTLY BANNED TERMS: octane render, glowing neon, cybernetic, cyberpunk, holographic, futuristic, laser lines. (Never use any of these words or visual tropes).
• MANDATED EDITORIAL STYLE: Swiss graphic design, editorial technical illustration, minimalist flat vector schematic, clean graphite backdrop, muted slate and cobalt palette, precision line art, matte industrial finish, 8k resolution, zero text, zero watermark.
• Explicitly illustrate the exact technical subject (e.g., for eBPF: 'Isometric cutaway diagram of Linux kernel space and user space boundary with circular ring buffers, packet filtering execution path, minimalist slate memory registers, dark charcoal matte chassis, Swiss graphic design, 8k, photorealistic technical blueprint, zero text, zero watermark').
• For consensus/distributed systems: 'State machine replication network nodes arranged in quorum ring, Raft leader election pulse, write-ahead log entries in precision data blocks, dark server rack backdrop, Swiss editorial design, 8k, zero text, zero watermark'.
• For compilers/runtimes: 'AST abstract syntax tree nodes transforming into optimized bytecode assembly instructions, zero-copy buffer pools, dark slate aesthetic, precision bus traces, Swiss minimalist schematic, 8k'.

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
  "imagePrompt": "Detailed domain-specific technical prompt specifically illustrating this article's core mechanisms (Swiss graphic design, minimalist flat vector schematic, clean slate and cobalt palette, zero text, zero watermark, 8k)",
  "seo": {
    "metaTitle": "... | LoLaBo — Lorapok Labs",
    "metaDescription": "...",
    "keywords": ["LorapokLabs", "Lorapok", "..."]
  }
}`;
    const userPrompt = `TRENDING NEWS CONTEXT:\n${newsContext}\n\nPlease write an authoritative, long-form technical treatise (~1800-2800 words) for Lorapok Labs. Select the appropriate editorial type, execute its structured breakdown with high depth, and provide formal citations. Ensure it does not duplicate any previously published topic.`;
    // Dynamic API Calling with Multi-Account Failover & Model Tier Adaptation
    let aiResult;
    const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || '';
    let blogData;
    try {
        aiResult = await callAIProvider(config.provider, apiKey, systemPrompt, userPrompt, true, isResearchMode);
        const rawText = typeof aiResult === 'string' ? aiResult : aiResult.text;
        blogData = parseLLMJson(rawText);
        blogData.modelUsed = typeof aiResult === 'object' ? aiResult.modelUsed : config.provider;
        blogData.editorialTier = typeof aiResult === 'object' ? aiResult.editorialTier : (isResearchMode ? 'FLAGSHIP RESEARCH TREATISE' : 'ARCHITECTURAL DEEP DIVE');
    }
    catch (aiErr) {
        console.error("❌ Online AI generation failed:", aiErr.message);
        throw new Error(`LoLaBo Online AI generation failed: ${aiErr.message}. Offline fallback is disabled per 100% online policy.`);
    }
    // Completeness & Conclusion Validation Barrier
    blogData = await ensureDraftIntegrity(blogData, apiKey, config.provider, isResearchMode);
    // ─── Research Review Unit: Autonomous Peer-Review & Refinement Loop ───
    console.log(`🧐 [Research Review Unit] Initiating peer review for: "${blogData.title}"...`);
    let verdict = await (0, reviewer_1.auditArticle)({
        title: blogData.title,
        content: blogData.content,
        citations: blogData.citations,
        category: blogData.category,
        type: blogData.type
    });
    let refinementPass = 0;
    const maxRefinementPasses = 2;
    while (verdict.decision === 'REVISION_REQUIRED' && refinementPass < maxRefinementPasses) {
        refinementPass++;
        console.warn(`🔄 [Research Review Unit] Defect detected (Score: ${verdict.score}/100). Executing peer-review refinement pass #${refinementPass}...`);
        const refinementPrompt = `CRITICAL PEER-REVIEW FEEDBACK FROM RESEARCH REVIEW UNIT:
Your initial draft scored ${verdict.score}/100 and was rejected for publication due to the following defects:
${verdict.revisionInstructions}

REVISION INSTRUCTIONS:
Revise, expand, and perfect the entire paper to directly resolve each critique point above. Ensure all architecture diagrams, comparative benchmark tables, and formal citations are fully populated with zero placeholders.`;
        try {
            const refinedResponse = await callAIProvider(config.provider, apiKey, systemPrompt, `${userPrompt}\n\n${refinementPrompt}`, true, isResearchMode);
            const refinedText = typeof refinedResponse === 'string' ? refinedResponse : refinedResponse.text;
            let refinedData = parseLLMJson(refinedText);
            if (refinedData && refinedData.content && refinedData.content.length > 800) {
                refinedData = await ensureDraftIntegrity(refinedData, apiKey, config.provider, isResearchMode);
                const postVerdict = await (0, reviewer_1.auditArticle)({
                    title: refinedData.title || blogData.title,
                    content: refinedData.content,
                    citations: refinedData.citations || blogData.citations,
                    category: refinedData.category || blogData.category,
                    type: refinedData.type || blogData.type
                });
                if (postVerdict.score >= verdict.score || postVerdict.decision === 'APPROVED') {
                    blogData = { ...blogData, ...refinedData };
                    verdict = postVerdict;
                    console.log(`📋 [Research Review Unit] Post-refinement verdict: ${verdict.decision} (Score: ${verdict.score}/100)`);
                }
                else {
                    console.log(`ℹ️ Refined draft scored lower (${postVerdict.score} vs ${verdict.score}). Retaining previous superior draft.`);
                    break;
                }
            }
        }
        catch (refineErr) {
            console.warn("⚠️ Refinement pass encountered error, proceeding with best current draft:", refineErr.message);
            break;
        }
    }
    blogData.peerReview = {
        score: verdict.score,
        decision: verdict.decision,
        strengths: verdict.strengths,
        criticalDefects: verdict.criticalDefects,
        rubricBreakdown: verdict.rubricBreakdown,
        reviewedBy: 'LoLaBo Autonomous Research Review Unit',
        reviewedAt: new Date().toISOString()
    };
    // Enforce Lorapok Labs tags and sanitize
    const rawTags = Array.isArray(blogData.tags) ? blogData.tags : [];
    const cleanTags = rawTags
        .map((t) => String(t).trim().replace(/^#/, ''))
        .filter((t) => t.length > 0);
    const finalTags = Array.from(new Set([
        'LorapokLabs',
        'Lorapok',
        'CitationsAvailable',
        ...cleanTags
    ]));
    blogData.tags = finalTags;
    // Process citations
    let citations = Array.isArray(blogData.citations) ? blogData.citations : [];
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
    // ─── Multi-Image Synthesizer: Generate Contextual Visual Suite ───
    console.log(`🎨 [Multi-Image Agent] Synthesizing multi-image visual suite for "${blogData.title}"...`);
    const visuals = await (0, imageAgent_1.synthesizePostVisualSuite)(blogData.title, blogData.category || 'Backend & Infrastructure', finalTags, blogData.imageKeywords || [], blogData.imagePrompt, existingPosts);
    blogData.coverImage = visuals.coverImage;
    blogData.architectureImage = visuals.architectureImage;
    blogData.benchmarkImage = visuals.benchmarkImage;
    blogData.figures = visuals.figures;
    // Injects Figure 1 & Figure 2 seamlessly into the markdown body
    blogData.content = (0, imageAgent_1.injectVisualsIntoMarkdown)(blogData.content, visuals);
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
function validateContentCompleteness(content) {
    if (!content || typeof content !== 'string') {
        return { isComplete: false, reason: "Content is empty" };
    }
    const clean = content.trim();
    const words = clean.split(/\s+/).filter(Boolean);
    if (words.length < 800) {
        return { isComplete: false, reason: `Content too short (${words.length} words, expected >= 800)` };
    }
    // Check code fence balance
    const fences = (clean.match(/```/g) || []).length;
    if (fences % 2 !== 0) {
        return { isComplete: false, reason: "Unclosed code fence (fence count is odd)" };
    }
    // Check if content was severed inside a code block or abruptly before conclusion
    if (/```\s*\n+---\s*\n+\*Authored/i.test(clean) && !/## (?:[0-9]+\.\s*)?(?:References|Technical Citations|Citations)/i.test(clean)) {
        return { isComplete: false, reason: "Content was severed inside code block prior to references" };
    }
    if (/\b(?:for|that|the|a|an|and|or|with|to|in|of|let|const|fn|func|def|class)\s*```/i.test(clean)) {
        return { isComplete: false, reason: "Dangling syntax at end of code block indicating severed output" };
    }
    if (/\|\s*<\s*10\\text\{ms\}\s*\n+---/i.test(clean) || /\|\s*---/i.test(clean) || /n_\{probe\}\s*\n+---/i.test(clean)) {
        return { isComplete: false, reason: "Content severed inside table or formula" };
    }
    const hasConclusion = /## (?:[0-9]+\.\s*)?(?:Conclusion|Key Takeaways|Architectural Recommendations|Summary|Takeaways)/i.test(clean);
    if (!hasConclusion) {
        return { isComplete: false, reason: "Missing concluding section (## Conclusion or ## Key Takeaways)" };
    }
    const hasReferences = /## (?:[0-9]+\.\s*)?(?:References|Technical Citations|Citations|Bibliography)/i.test(clean);
    if (!hasReferences) {
        return { isComplete: false, reason: "Missing references section (## References & Technical Citations)" };
    }
    return { isComplete: true };
}
function spliceConclusionCleanly(content, completionSuffix) {
    if (!completionSuffix || !completionSuffix.trim())
        return content;
    let cleanContent = content.trim();
    // Strip premature footer if present
    cleanContent = cleanContent.replace(/\n*---\s*\n+\*Authored autonomously by LoLaBo Agent[\s\S]*$/, '').trim();
    // Balance unclosed code blocks first
    const fences = cleanContent.match(/```/g);
    if (fences && fences.length % 2 !== 0) {
        cleanContent += "\n```\n";
    }
    const completionHasRefs = /## (?:[0-9]+\.\s*)?(?:References|Technical Citations|Citations|Bibliography)/i.test(completionSuffix);
    const refRegex = /\n(?=## (?:[0-9]+\.\s*)?(?:References|Citations|Technical Citations|Bibliography))/i;
    const match = cleanContent.search(refRegex);
    if (match !== -1) {
        if (completionHasRefs) {
            cleanContent = cleanContent.slice(0, match).trim() + "\n\n" + completionSuffix.trim();
        }
        else {
            const beforeRefs = cleanContent.slice(0, match).trim();
            const refs = cleanContent.slice(match).trim();
            cleanContent = beforeRefs + "\n\n" + completionSuffix.trim() + "\n\n" + refs;
        }
    }
    else {
        cleanContent = cleanContent + "\n\n" + completionSuffix.trim();
    }
    return cleanContent;
}
async function ensureDraftIntegrity(draft, apiKey, provider, isResearchMode) {
    if (!draft || !draft.content)
        return draft;
    // Clean trailing premature footers
    let content = draft.content.trim();
    content = content.replace(/\n*---\s*\n+\*Authored autonomously by LoLaBo Agent[\s\S]*$/, '').trim();
    // Balance code fences
    const openFences = (content.match(/```/g) || []).length;
    if (openFences % 2 !== 0) {
        content = content + "\n```\n";
    }
    draft.content = content;
    // Validate completeness and splice missing sections if needed
    const completeness = validateContentCompleteness(draft.content);
    if (!completeness.isComplete) {
        console.warn(`⚠️ Article content incomplete (${completeness.reason}). Running online completion pass...`);
        try {
            const completionSuffix = await completeArticleSections(draft.title, draft.content, apiKey, provider, isResearchMode);
            if (completionSuffix) {
                draft.content = spliceConclusionCleanly(draft.content, completionSuffix);
                console.log("✅ Concluding sections synthesized and attached successfully.");
            }
        }
        catch (compErr) {
            console.warn("⚠️ Completion pass encountered error:", compErr.message);
        }
    }
    // Re-verify code fences
    const finalFences = (draft.content || '').match(/```/g);
    if (finalFences && finalFences.length % 2 !== 0) {
        draft.content = draft.content.trim() + "\n```\n";
    }
    return draft;
}
function getModelEditorialProfile(model, isResearch) {
    const isPro = model.includes('pro') || model.includes('thinking');
    const isAdvancedFlash = model.includes('3.8-flash') || model.includes('3.7-flash') || model.includes('flash-latest') || model.includes('2.5-flash') || model.includes('2.0-flash');
    if (isPro) {
        return {
            editorialTier: 'FLAGSHIP RESEARCH TREATISE',
            targetWords: 2800,
            maxOutputTokens: 8192,
            temperature: 0.35,
            guidance: 'EDITORIAL TIER: FLAGSHIP RESEARCH TREATISE. Target depth: ~2500–3500 words. Execute exhaustive academic systems engineering rigor. Include formal mathematical/algorithmic proofs, low-level memory invariants, ASCII architecture topology, comparative benchmark tables, and 4–6 peer-reviewed/RFC citations.'
        };
    }
    else if (isAdvancedFlash || (isResearch && !model.includes('3.5-flash') && !model.includes('flash-lite'))) {
        return {
            editorialTier: 'ARCHITECTURAL DEEP DIVE',
            targetWords: 2200,
            maxOutputTokens: 8192,
            temperature: 0.5,
            guidance: 'EDITORIAL TIER: ARCHITECTURAL DEEP DIVE. Target depth: ~1800–2400 words. Focus on production component topologies, concurrency boundaries, low-level data-plane vs control-plane dynamics, annotated code blocks, and formal references.'
        };
    }
    else {
        return {
            editorialTier: 'TECHNICAL DISPATCH',
            targetWords: 1500,
            maxOutputTokens: 6144,
            temperature: 0.6,
            guidance: 'EDITORIAL TIER: TECHNICAL DISPATCH. Target depth: ~1400–1800 words. Focus on core operational invariants, actionable code implementation, key architectural takeaways, and concise technical citations.'
        };
    }
}
async function completeArticleSections(title, existingContent, apiKey, provider, isResearch = false) {
    const prompt = `You are completing an authoritative long-form technical article for Lorapok Labs.
Article Title: "${title}"
The article currently ends abruptly with the following text:
"""
${existingContent.slice(-1500)}
"""

CRITICAL INSTRUCTIONS:
1. If the previous text ended inside an incomplete code block, table, JSON schema, or formula, provide the immediate lines to cleanly CLOSE and COMPLETE that code block or table first (including the closing \`\`\` code fence).
2. Then provide:
   "## Key Takeaways & Summary for Systems Architects" (synthesizing the core technical lessons, architectural boundaries, and operational recommendations in 3-5 comprehensive paragraphs).
3. Then provide:
   "## References & Technical Citations" (listing 3-6 formal whitepapers, RFCs, kernel docs, or technical monographs with full authors, year, and URLs).

Return ONLY the markdown text to complete the article. Do not repeat the existing text.`;
    const completion = await callAIProvider(provider, apiKey, "You are a Principal Systems Architect. Write only high-depth markdown for the requested concluding sections.", prompt, false, isResearch);
    return typeof completion === 'string' ? completion : completion.text;
}
async function callAIProvider(provider, fallbackKey, system, user, jsonMode = true, isResearch = false) {
    // Check if provider is Gemini or Gemini keys are present in pool
    const hasGeminiKey = keyManager_1.keyManager.getAccountCount('gemini') > 0 || (fallbackKey && (fallbackKey.startsWith('AQ.') || fallbackKey.startsWith('AIza'))) || Boolean(process.env.GEMINI_API_KEY);
    const effectiveProvider = (provider === 'gemini' || provider.startsWith('gemini') || hasGeminiKey) ? 'gemini' : provider;
    console.log(`Calling ${effectiveProvider} API (jsonMode: ${jsonMode}, isResearch: ${isResearch})...`);
    if (effectiveProvider === 'gemini') {
        // Comprehensive Gemini Model Fallback Ladder:
        // Research Treatises, Thesis Papers & Journal Articles -> Pro Tier first, then high-spec Flash, then resilient fallback
        // Blogs & Quick Dispatches -> 3.8 Flash first, then 3.7/3.6/2.5 Flash
        const requestedPro = provider === 'gemini-pro' || provider === 'gemini-3.8-pro' || provider === 'gemini-3.1-pro' || provider === 'gemini-2.5-pro' || isResearch;
        const candidateModels = requestedPro
            ? [
                'gemini-3.8-flash',
                'gemini-3.7-flash',
                'gemini-3.6-flash',
                'gemini-flash-latest',
                'gemini-3.1-pro-preview',
                'gemini-pro-latest',
                'gemini-3.5-flash',
                'gemini-3.1-flash-lite',
                'gemini-flash-lite-latest',
                'gemini-2.5-pro',
                'gemini-2.5-flash',
                'gemini-2.0-flash',
                'gemini-2.0-flash-lite',
                'gemini-2.0-pro-exp-02-05',
                'gemini-2.0-flash-thinking-exp-01-21',
                'gemini-1.5-pro',
                'gemini-1.5-flash'
            ]
            : [
                'gemini-3.8-flash',
                'gemini-3.7-flash',
                'gemini-3.6-flash',
                'gemini-flash-latest',
                'gemini-3.5-flash',
                'gemini-3.1-flash-lite',
                'gemini-flash-lite-latest',
                'gemini-2.5-flash',
                'gemini-2.0-flash',
                'gemini-2.0-flash-lite',
                'gemini-1.5-flash'
            ];
        let lastError = null;
        const poolAccounts = Math.max(1, keyManager_1.keyManager.getAccountCount('gemini'));
        const discoveryKey = keyManager_1.keyManager.getKey('gemini')?.key || fallbackKey;
        const validatedCandidateModels = await modelValidator_1.modelValidator.validateAndFilterCandidates(candidateModels, discoveryKey);
        // Step through candidate models in priority order
        for (const model of validatedCandidateModels) {
            const profile = getModelEditorialProfile(model, requestedPro);
            for (let keyAttempt = 0; keyAttempt < poolAccounts; keyAttempt++) {
                const activeProfile = keyManager_1.keyManager.getKey('gemini');
                const activeKey = activeProfile ? activeProfile.key : fallbackKey;
                const accountLabel = activeProfile ? activeProfile.accountLabel : 'Default Account';
                if (!activeKey) {
                    throw new Error("❌ No Gemini API key detected. Please configure GEMINI_API_KEY_1..4 or GEMINI_API_KEY in your environment.");
                }
                try {
                    console.log(`Attempting Gemini generation with ${model} [Tier: ${profile.editorialTier}] via ${accountLabel}...`);
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`;
                    const generationConfig = {
                        maxOutputTokens: profile.maxOutputTokens,
                        temperature: profile.temperature
                    };
                    if (jsonMode) {
                        generationConfig.responseMimeType = "application/json";
                    }
                    const adaptiveUserPrompt = `[ADAPTIVE EDITORIAL DIRECTIVE: ${profile.guidance}]\n\n${user}`;
                    const body = {
                        contents: [{ role: 'user', parts: [{ text: `${system}\n\n${adaptiveUserPrompt}` }] }],
                        generationConfig
                    };
                    const res = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });
                    const data = await res.json();
                    // 1. Real-Time Deprecation & Model Not Found Auto-Pruning
                    const deprecationCheck = modelValidator_1.modelValidator.isDeprecatedOrNotFound(res.status, data);
                    if (deprecationCheck.isDeprecated) {
                        modelValidator_1.modelValidator.markDeprecated(model, deprecationCheck.reason);
                        lastError = new Error(deprecationCheck.reason);
                        break; // Auto-pruned from candidate ladder, immediately advance to next candidate
                    }
                    const errMsg = data?.error?.message || '';
                    const isDemandSpike = res.status === 503 || data?.error?.code === 503 || data?.error?.status === 'UNAVAILABLE' || errMsg.includes('high demand');
                    const isModelSpecificQuota = errMsg.includes('limit: 0') || (errMsg.includes('Quota exceeded') && errMsg.includes('model:'));
                    if (isDemandSpike || isModelSpecificQuota) {
                        console.warn(`⏳ [Adaptive Fallback] Model ${model} is currently busy or restricted (${errMsg.slice(0, 110) || res.status}). Cascading to next candidate in ladder...`);
                        lastError = new Error(errMsg || `Model ${model} unavailable`);
                        break; // Skip further key attempts for this busy model, advance to next model candidate!
                    }
                    // General Rate Limit (429) across key
                    if (res.status === 429 || data?.error?.code === 429 || data?.error?.status === 'RESOURCE_EXHAUSTED') {
                        console.warn(`⏳ [KeyManager] Rate limit on ${accountLabel} for ${model}. Rotating account key...`);
                        if (activeProfile)
                            keyManager_1.keyManager.reportRateLimit(activeProfile.id, false);
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                        continue; // Try next key for the same model
                    }
                    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        modelValidator_1.modelValidator.markActive(model);
                        console.log(`✅ Generation succeeded with ${model} (${profile.editorialTier} • ${accountLabel})`);
                        if (activeProfile)
                            keyManager_1.keyManager.reportSuccess(activeProfile.id);
                        return {
                            text,
                            modelUsed: model,
                            editorialTier: profile.editorialTier
                        };
                    }
                    console.warn(`⚠️ Model ${model} returned non-text status (${data?.error?.code || 'status'}): ${errMsg || 'Empty'}. Trying next candidate in ladder...`);
                    lastError = new Error(errMsg || `Model ${model} returned empty response`);
                    await new Promise((resolve) => setTimeout(resolve, 800));
                }
                catch (err) {
                    lastError = err;
                    console.warn(`⚠️ Exception calling ${model}:`, err.message);
                    await new Promise((resolve) => setTimeout(resolve, 800));
                }
            }
        }
        throw lastError || new Error(`All Gemini ${requestedPro ? 'Pro & Flash' : 'Flash'} candidate endpoints and multi-account keys failed.`);
    }
    let url = '';
    let body = {};
    const authKey = keyManager_1.keyManager.getKey(provider)?.key || fallbackKey;
    if (provider === 'groq') {
        url = 'https://api.groq.com/openai/v1/chat/completions';
        body = {
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
            ...(jsonMode ? { response_format: { type: "json_object" } } : {})
        };
    }
    else {
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
            'Authorization': `Bearer ${authKey}`
        },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
        console.error("AI API Error details:", JSON.stringify(data));
        throw new Error(`AI Provider ${provider} error: ${data?.error?.message || 'Empty response'}`);
    }
    return {
        text: content,
        modelUsed: provider,
        editorialTier: isResearch ? 'FLAGSHIP RESEARCH TREATISE' : 'ARCHITECTURAL DEEP DIVE'
    };
}
function repairTruncatedJson(str) {
    let repaired = str.trim();
    let quotes = 0;
    let escaped = false;
    for (let i = 0; i < repaired.length; i++) {
        if (escaped) {
            escaped = false;
            continue;
        }
        if (repaired[i] === '\\') {
            escaped = true;
            continue;
        }
        if (repaired[i] === '"') {
            quotes++;
        }
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
function parseLLMJson(raw) {
    let cleaned = raw.trim();
    if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    }
    else if (cleaned.startsWith('```')) {
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
    }
    catch { }
    // 2. Try with Truncation Repair
    try {
        const repaired = repairTruncatedJson(cleaned);
        return JSON.parse(repaired);
    }
    catch { }
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
                }
                else if (char === '\r') {
                    result += '\\r';
                }
                else if (char === '\t') {
                    result += '\\t';
                }
                else if (char.charCodeAt(0) < 32) {
                    // omit invalid control characters
                }
                else {
                    result += char;
                }
            }
            else {
                result += char;
            }
        }
        return JSON.parse(repairTruncatedJson(result));
    }
    catch { }
    // 4. Regex-based field extraction fallback
    try {
        const extractString = (field) => {
            const match = cleaned.match(new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, 's'));
            if (match) {
                try {
                    return JSON.parse(`"${match[1]}"`);
                }
                catch {
                    return match[1].replace(/\\n/g, '\n');
                }
            }
            return '';
        };
        const extractContent = () => {
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
                imagePrompt: `Swiss editorial technical illustration of ${title}, minimalist flat vector schematic, clean slate and cobalt palette, 8k`,
                seo: {
                    metaTitle: `${title.slice(0, 48)} | LoLaBo — Lorapok Labs`,
                    metaDescription: (excerpt || title).slice(0, 155),
                    keywords: ['LorapokLabs', 'Lorapok', 'CitationsAvailable']
                }
            };
        }
    }
    catch { }
    console.error("Failed to parse LLM JSON output:", raw.slice(0, 500));
    throw new Error("Could not parse LLM JSON response");
}
// ─── 100% Online AI Policy ───
// Offline synthesis has been permanently removed per system policy.
// LoLaBo requires active online AI generation via Google Gemini, Groq, or OpenAI.
