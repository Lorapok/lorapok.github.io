// agent/qualityGate.ts
// Publication gate for LoLaBo posts. A generated post becomes public only when
// every check passes; otherwise it stays in the private draft archive.

export const GATE = {
  minScore: 85,
  minWords: 1200,
  minCitations: 3,
  maxTitleSimilarity: 0.6,
};

export interface GateResult {
  pass: boolean;
  reasons: string[];
}

const BANNED_MARKERS = /\b(lorem ipsum|TODO|TBD|placeholder|as an ai language model)\b/i;

function tokens(title: string): Set<string> {
  return new Set(
    String(title || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 3),
  );
}

function similarity(a: string, b: string): number {
  const A = tokens(a);
  const B = tokens(b);
  if (!A.size || !B.size) return 0;
  let shared = 0;
  A.forEach((t) => B.has(t) && shared++);
  return shared / (A.size + B.size - shared);
}

function parseList(value: any): any[] {
  if (Array.isArray(value)) return value;
  return [];
}

/**
 * @param post     candidate post
 * @param published posts that are already public (used for duplicate-topic check)
 */
export function evaluateGate(post: any, published: any[] = []): GateResult {
  const reasons: string[] = [];
  const review = post?.peerReview || {};
  const content = String(post?.content || '');
  const words = content.split(/\s+/).filter(Boolean).length;

  if (review.decision !== 'APPROVED') reasons.push(`peer review is ${review.decision || 'missing'}`);
  if (!(Number(review.score) >= GATE.minScore)) reasons.push(`score ${review.score ?? 'n/a'} < ${GATE.minScore}`);
  if (words < GATE.minWords) reasons.push(`only ${words} words (< ${GATE.minWords})`);
  if (parseList(post?.citations).length < GATE.minCitations) reasons.push(`fewer than ${GATE.minCitations} citations`);
  if (!post?.title || !post?.slug || !post?.excerpt) reasons.push('missing title/slug/excerpt');
  if (!post?.coverImage) reasons.push('missing cover image');
  if (BANNED_MARKERS.test(content)) reasons.push('contains placeholder/boilerplate text');
  if ((content.match(/```/g) || []).length % 2 !== 0) reasons.push('unbalanced code fences');

  for (const other of published) {
    if ((other.slug || other.id) === (post.slug || post.id)) continue;
    if (similarity(post.title, other.title) >= GATE.maxTitleSimilarity) {
      reasons.push(`topic too similar to "${other.title}"`);
      break;
    }
  }

  return { pass: reasons.length === 0, reasons };
}
