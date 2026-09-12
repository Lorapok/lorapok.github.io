"use strict";
// agent/validator.ts
// Intelligent Duplicate Post & Topic Validation Engine for LoLaBo
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeText = normalizeText;
exports.extractKeywords = extractKeywords;
exports.calculateJaccardSimilarity = calculateJaccardSimilarity;
exports.calculateOverlapCoefficient = calculateOverlapCoefficient;
exports.extractTopicPrefix = extractTopicPrefix;
exports.validateDuplicatePost = validateDuplicatePost;
const STOP_WORDS = new Set([
    'the', 'and', 'for', 'with', 'from', 'this', 'that', 'into', 'over', 'back',
    'what', 'when', 'where', 'how', 'why', 'are', 'was', 'were', 'will', 'just',
    'about', 'after', 'before', 'deep', 'dive', 'architectural', 'inside', 'beyond',
    'guide', 'building', 'overview',
    // Generic systems & architectural terms that should not trigger false duplication
    'architecting', 'architecture', 'design', 'engine', 'engineering', 'systems', 'system',
    'high', 'throughput', 'zero', 'copy', 'memory', 'performance', 'distributed', 'modern',
    'pipeline', 'analysis', 'benchmarking', 'benchmarks', 'scale', 'practical', 'real', 'world',
    'towards', 'next', 'generation', 'advancements', 'implementing', 'understanding'
]);
/**
 * Normalizes text for lexical comparison:
 * Lowercases, strips punctuation and extraneous whitespace.
 */
function normalizeText(text) {
    return (text || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
/**
 * Extracts significant tokens (length > 2 and not a stop word)
 */
function extractKeywords(text) {
    return normalizeText(text)
        .split(' ')
        .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}
/**
 * Calculates token-level Jaccard similarity (intersection / union)
 */
function calculateJaccardSimilarity(str1, str2) {
    const words1 = extractKeywords(str1);
    const words2 = extractKeywords(str2);
    if (words1.length === 0 || words2.length === 0)
        return 0;
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    let intersection = 0;
    for (const word of set1) {
        if (set2.has(word))
            intersection++;
    }
    const union = new Set([...set1, ...set2]).size;
    return union === 0 ? 0 : intersection / union;
}
/**
 * Calculates overlap / containment coefficient (intersection / min(|set1|, |set2|))
 */
function calculateOverlapCoefficient(str1, str2) {
    const words1 = extractKeywords(str1);
    const words2 = extractKeywords(str2);
    if (words1.length === 0 || words2.length === 0)
        return 0;
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    let intersection = 0;
    for (const word of set1) {
        if (set2.has(word))
            intersection++;
    }
    const minSize = Math.min(set1.size, set2.size);
    return minSize === 0 ? 0 : intersection / minSize;
}
/**
 * Extracts main topic prefix before punctuation separators like ':', '—', or '-'
 */
function extractTopicPrefix(title) {
    const parts = title.split(/[:—–-]/);
    return (parts[0] || '').trim();
}
/**
 * Validates whether a candidate post or news item duplicates an existing article.
 * Checks:
 * 1. Exact slug match
 * 2. Exact normalized title match
 * 3. Topic headline prefix match (before ':', '—', or '-')
 * 4. Token Overlap / Containment >= threshold (default 0.55)
 * 5. Shared technical keywords >= 3 significant terms
 * 6. Token Jaccard similarity >= 0.40
 * 7. Substring / entity containment
 */
function validateDuplicatePost(candidate, existingPosts, similarityThreshold = 0.50) {
    if (!candidate || !candidate.title) {
        return { isDuplicate: false };
    }
    const candidateSlug = candidate.slug || candidate.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const candidateNorm = normalizeText(candidate.title);
    const candidateWords = extractKeywords(candidate.title);
    const candidatePrefix = normalizeText(extractTopicPrefix(candidate.title));
    for (const existing of existingPosts) {
        if (!existing || !existing.title)
            continue;
        // 1. Exact Slug Match
        if (existing.slug && existing.slug === candidateSlug) {
            return {
                isDuplicate: true,
                matchedPost: existing,
                reason: `Exact slug match '${existing.slug}'`,
                similarityScore: 1.0
            };
        }
        // 2. Exact Title Match
        const existingNorm = normalizeText(existing.title);
        if (existingNorm === candidateNorm) {
            return {
                isDuplicate: true,
                matchedPost: existing,
                reason: `Exact title match: "${existing.title}"`,
                similarityScore: 1.0
            };
        }
        // 3. Topic Prefix Match (e.g., "Kernel-Bypass Networking in Rust: ...")
        const existingPrefix = normalizeText(extractTopicPrefix(existing.title));
        if (candidatePrefix.length >= 12 && existingPrefix.length >= 12) {
            if (candidatePrefix === existingPrefix) {
                return {
                    isDuplicate: true,
                    matchedPost: existing,
                    reason: `Identical headline topic prefix: "${extractTopicPrefix(existing.title)}"`,
                    similarityScore: 0.95
                };
            }
            // Check prefix keyword overlap
            const pWords1 = extractKeywords(candidatePrefix);
            const pWords2 = extractKeywords(existingPrefix);
            if (pWords1.length >= 3 && pWords2.length >= 3) {
                let pOverlap = 0;
                const pSet2 = new Set(pWords2);
                for (const w of pWords1) {
                    if (pSet2.has(w))
                        pOverlap++;
                }
                if (pOverlap >= 3 && pOverlap / Math.min(pWords1.length, pWords2.length) >= 0.75) {
                    return {
                        isDuplicate: true,
                        matchedPost: existing,
                        reason: `Matching topic header: "${extractTopicPrefix(existing.title)}"`,
                        similarityScore: 0.90
                    };
                }
            }
        }
        // 4. Overlap Coefficient (Containment)
        const existingWords = extractKeywords(existing.title);
        const overlap = calculateOverlapCoefficient(candidate.title, existing.title);
        const jaccard = calculateJaccardSimilarity(candidate.title, existing.title);
        // Count shared significant keywords
        const existingSet = new Set(existingWords);
        const sharedTokens = candidateWords.filter(w => existingSet.has(w));
        if (overlap >= 0.55 && sharedTokens.length >= 3) {
            return {
                isDuplicate: true,
                matchedPost: existing,
                reason: `High topic overlap (${Math.round(overlap * 100)}% containment, shared terms: ${sharedTokens.join(', ')}) with "${existing.title}"`,
                similarityScore: overlap
            };
        }
        if (jaccard >= similarityThreshold) {
            return {
                isDuplicate: true,
                matchedPost: existing,
                reason: `High Jaccard topic similarity (${Math.round(jaccard * 100)}% with "${existing.title}")`,
                similarityScore: jaccard
            };
        }
        if (sharedTokens.length >= 4 && overlap >= 0.40) {
            return {
                isDuplicate: true,
                matchedPost: existing,
                reason: `4+ shared technical keywords (${sharedTokens.join(', ')}) with "${existing.title}"`,
                similarityScore: 0.75
            };
        }
        // 5. Entity / Topic Substring Check
        if (candidateNorm.length > 20 && existingNorm.length > 20) {
            if (candidateNorm.includes(existingNorm) || existingNorm.includes(candidateNorm)) {
                return {
                    isDuplicate: true,
                    matchedPost: existing,
                    reason: `Topic substring containment with "${existing.title}"`,
                    similarityScore: 0.9
                };
            }
        }
    }
    return { isDuplicate: false };
}
