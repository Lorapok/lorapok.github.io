"use strict";
// agent/reviewer.ts
// Autonomous Research Review Unit & Peer-Review Subagent for LoLaBo
// Audits technical depth, mathematical models, code soundness, and citation validity before publication
// Orchestrates the iterative critique & refinement loop if defects are detected
Object.defineProperty(exports, "__esModule", { value: true });
exports.heuristicAudit = heuristicAudit;
exports.auditArticle = auditArticle;
const keyManager_1 = require("./keyManager");
const modelValidator_1 = require("./modelValidator");
const REVIEW_SYSTEM_PROMPT = `You are the LoLaBo Principal Academic Peer-Reviewer & Systems Verification Unit.
Your mandate is to ruthlessly critique, evaluate, and ensure publication-grade excellence for technical research papers, thesis deep dives, and systems architecture dispatches.

EVALUATION RUBRIC (100-Point Academic Standard):
1. ARCHITECTURAL DEPTH & TECHNICAL RIGOR (30 points):
   - Are systems mechanics, kernel transitions, memory layouts (cache lines, alignment, zero-copy), or consensus invariants deeply analyzed?
   - Score < 22 if the analysis is surface-level, high-level summary, or marketing buzzwords.

2. STRUCTURAL COMPLETENESS (25 points):
   - Must follow the mandatory structural breakdown for its editorial format.
   - Must contain ASCII architecture topologies or data flow diagrams.
   - Must contain Markdown comparative benchmark tables with empirical metrics (e.g. P50, P99, IOPS).
   - Must contain an explicit, thoughtful ## Conclusion or ## Key Takeaways section.
   - Score < 18 if any section is stubbed, truncated, or lacks empirical tables/diagrams.

3. CODE & MATHEMATICAL SOUNDNESS (20 points):
   - Are annotated code blocks (Rust, Go, C++, Python) idiomatic, robust, and syntactically clean?
   - Are algorithmic complexities ($O(n)$, asymptotic bounds) or state invariants mathematically formal?
   - Score < 14 if code is trivial boilerplate or contains syntax errors.

4. CITATION & ACADEMIC INTEGRITY (15 points):
   - Are formal papers, RFCs, kernel documentation, or academic monographs cited inline?
   - Does it conclude with a dedicated "## References & Technical Citations" section with 3–6 real, verifiable sources?
   - Score < 10 if citations are missing, generic, or not linked.

5. TONE & ANTI-HALLUCINATION INTEGRITY (10 points):
   - Must have ZERO placeholder markers (e.g. [TODO], [TBD], [...], "insert code here").
   - Content must not terminate abruptly mid-sentence.
   - Score 0 if any placeholder text or abrupt sentence cutoff is found.

APPROVAL POLICY:
- If Total Score >= 85 and zero critical defects: "APPROVED".
- If Total Score < 85: "REVISION_REQUIRED".
- Provide explicit, actionable revision instructions directing the authoring model on exactly what kernel transitions, tables, equations, or sections to expand.

OUTPUT FORMAT (Valid JSON only):
{
  "decision": "APPROVED" | "REVISION_REQUIRED",
  "score": 88,
  "rubricBreakdown": {
    "architecturalDepth": 26,
    "structuralCompleteness": 22,
    "codeAndMathSoundness": 18,
    "citationsIntegrity": 14,
    "antiHallucinationTone": 8
  },
  "strengths": ["Clear ASCII topology diagram", "Thorough Raft leader election analysis"],
  "criticalDefects": ["Benchmark table missing P99.9 latency column", "Section 4 truncated"],
  "revisionInstructions": "Expand Section 4 with Linux kernel page cache mechanics and add P99.9 column to the benchmark table."
}`;
/**
 * Heuristic fallback evaluation when offline or during API rate limit cooldown
 */
function heuristicAudit(title, content, citations = []) {
    const words = (content || '').split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const lower = (content || '').toLowerCase();
    let architecturalDepth = 24;
    let structuralCompleteness = 20;
    let codeAndMathSoundness = 16;
    let citationsIntegrity = 12;
    let antiHallucinationTone = 8;
    const defects = [];
    const strengths = [];
    // Word count check
    if (wordCount < 1200) {
        architecturalDepth -= 8;
        defects.push(`Insufficient length (${wordCount} words; expected >= 1,400 words for rigorous research).`);
    }
    else {
        strengths.push(`Substantive length (${wordCount} words).`);
    }
    // Diagram check
    if (content.includes('```') && (content.includes('+--') || content.includes('|') || content.includes('-->') || content.includes('┌─'))) {
        structuralCompleteness += 3;
        strengths.push("Includes architectural topology diagram.");
    }
    else {
        structuralCompleteness -= 5;
        defects.push("Missing ASCII architecture/data-flow diagram.");
    }
    // Comparative table check
    if (content.includes('|---') || content.includes('|:--') || content.includes('| ---')) {
        structuralCompleteness += 2;
        strengths.push("Includes empirical comparative metrics table.");
    }
    else {
        structuralCompleteness -= 5;
        defects.push("Missing markdown benchmark or comparative trade-off table.");
    }
    // Code block check
    const codeBlocks = content.match(/```[a-z0-9]+\n[\s\S]*?```/gi);
    if (codeBlocks && codeBlocks.length >= 2) {
        codeAndMathSoundness += 3;
        strengths.push(`Contains ${codeBlocks.length} production-grade annotated code blocks.`);
    }
    else {
        codeAndMathSoundness -= 4;
        defects.push("Insufficient code deconstruction (expected at least 2 annotated code blocks).");
    }
    // Citations check
    const hasReferencesHeader = lower.includes('## references') || lower.includes('## technical citations') || lower.includes('## citations');
    const citationCount = Array.isArray(citations) ? citations.length : 0;
    if (hasReferencesHeader && citationCount >= 3) {
        citationsIntegrity = 15;
        strengths.push(`Contains ${citationCount} formal academic/technical citations.`);
    }
    else {
        citationsIntegrity -= 6;
        defects.push("Missing or deficient formal references (expected >= 3 citations with links).");
    }
    // Conclusion check
    const hasConclusion = lower.includes('## conclusion') || lower.includes('## key takeaways') || lower.includes('## architectural recommendations');
    if (!hasConclusion) {
        structuralCompleteness -= 6;
        defects.push("Missing explicit concluding section (## Conclusion or ## Key Takeaways).");
    }
    // Abrupt ending check
    const clean = content.trim();
    const validPunctuation = new Set(['.', '!', '?', ')', ']', '`', '*', '_', '\n', '>']);
    if (!validPunctuation.has(clean[clean.length - 1]) && !clean.endsWith('---')) {
        antiHallucinationTone = 0;
        defects.push("Content ends abruptly mid-sentence (truncated output).");
    }
    // Placeholder check
    if (/\[TODO\]|\[TBD\]|INSERT CODE|YOUR_CODE_HERE/i.test(content)) {
        antiHallucinationTone = 0;
        defects.push("Contains unfinished template placeholders.");
    }
    const score = Math.max(0, Math.min(100, architecturalDepth +
        structuralCompleteness +
        codeAndMathSoundness +
        citationsIntegrity +
        antiHallucinationTone));
    const decision = (score >= 85 && defects.length === 0) ? 'APPROVED' : 'REVISION_REQUIRED';
    let revisionInstructions = "";
    if (defects.length > 0) {
        revisionInstructions = `The Research Review Unit identified the following defects:\n` +
            defects.map((d, i) => `${i + 1}. ${d}`).join('\n') +
            `\nPlease revise the paper to resolve these defects, deepen architectural analysis, and ensure all tables and code blocks are fully realized.`;
    }
    return {
        decision,
        score,
        category: 'Architecture & Systems',
        editorialType: 'RESEARCH TREATISE',
        rubricBreakdown: {
            architecturalDepth,
            structuralCompleteness,
            codeAndMathSoundness,
            citationsIntegrity,
            antiHallucinationTone
        },
        strengths,
        criticalDefects: defects,
        revisionInstructions
    };
}
/**
 * Executes a full AI Peer-Review on an article draft
 */
async function auditArticle(article) {
    console.log(`🧐 [Research Review Unit] Auditing draft: "${article.title}"...`);
    // 1. Run local heuristic barrier first
    const localVerdict = heuristicAudit(article.title, article.content, article.citations);
    if (localVerdict.decision === 'REVISION_REQUIRED' && localVerdict.criticalDefects.some(d => d.includes('mid-sentence') || d.includes('placeholders'))) {
        console.warn(`🛑 [Research Review Unit] Draft failed immediate syntax barrier: ${localVerdict.criticalDefects.join('; ')}`);
        return localVerdict;
    }
    // 2. Online AI Peer-Review using active key pool
    const keyProfile = keyManager_1.keyManager.getKey('gemini');
    if (!keyProfile) {
        console.log("ℹ️ No online key available for review pass; applying heuristic academic audit.");
        return localVerdict;
    }
    try {
        const userPrompt = `ARTICLE TITLE: "${article.title}"
CATEGORY: "${article.category || 'Systems'}"
EDITORIAL TYPE: "${article.type || 'DEEP DIVE'}"
TOTAL CITATIONS COUNT: ${(article.citations || []).length}

DRAFT CONTENT TO AUDIT:
"""
${article.content.slice(0, 10000)}
"""

Please peer-review this technical draft against the 100-point academic standard and output valid JSON.`;
        const candidateReviewModels = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash'];
        const activeReviewModels = await modelValidator_1.modelValidator.validateAndFilterCandidates(candidateReviewModels, keyProfile.key);
        for (const reviewModel of activeReviewModels) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${reviewModel}:generateContent?key=${keyProfile.key}`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: `${REVIEW_SYSTEM_PROMPT}\n\n${userPrompt}` }] }],
                        generationConfig: {
                            maxOutputTokens: 2048,
                            temperature: 0.2,
                            responseMimeType: "application/json"
                        }
                    })
                });
                const data = await res.json();
                const deprecation = modelValidator_1.modelValidator.isDeprecatedOrNotFound(res.status, data);
                if (deprecation.isDeprecated) {
                    modelValidator_1.modelValidator.markDeprecated(reviewModel, deprecation.reason);
                    continue;
                }
                if (res.ok) {
                    const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (rawJson) {
                        modelValidator_1.modelValidator.markActive(reviewModel);
                        const parsed = JSON.parse(rawJson);
                        keyManager_1.keyManager.reportSuccess(keyProfile.id);
                        const finalScore = typeof parsed.score === 'number' ? parsed.score : localVerdict.score;
                        const finalDecision = (finalScore >= 85 && (!parsed.criticalDefects || parsed.criticalDefects.length === 0)) ? 'APPROVED' : 'REVISION_REQUIRED';
                        console.log(`📋 [Research Review Unit via ${reviewModel}] Verdict: ${finalDecision} (Score: ${finalScore}/100)`);
                        return {
                            decision: finalDecision,
                            score: finalScore,
                            category: article.category || 'General Tech',
                            editorialType: article.type || 'DEEP DIVE',
                            rubricBreakdown: parsed.rubricBreakdown || localVerdict.rubricBreakdown,
                            strengths: parsed.strengths || localVerdict.strengths,
                            criticalDefects: parsed.criticalDefects || localVerdict.criticalDefects,
                            revisionInstructions: parsed.revisionInstructions || localVerdict.revisionInstructions
                        };
                    }
                }
                else if (res.status === 429) {
                    keyManager_1.keyManager.reportRateLimit(keyProfile.id);
                }
                else if (res.status === 503 || res.status === 404) {
                    console.warn(`⏳ [Research Review Unit] Review model ${reviewModel} unavailable (${res.status}), trying next candidate in ladder...`);
                    continue;
                }
            }
            catch (subErr) {
                console.warn(`⚠️ [Research Review Unit] Review model ${reviewModel} failed:`, subErr.message);
            }
        }
    }
    catch (err) {
        console.warn("⚠️ AI Peer-Review request encountered error; falling back to heuristic audit:", err.message);
    }
    return localVerdict;
}
