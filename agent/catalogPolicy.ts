import * as fs from 'fs';
import * as path from 'path';
import { evaluateGate } from './qualityGate';

export const PUBLIC_POSTS = path.resolve(__dirname, '../public/blog/posts.json');
export const ARCHIVE_POSTS = path.resolve(__dirname, '../public/blog/archive/ai-posts.json');

export function isPublicManualPost(post: any): boolean {
  return Boolean(post && post.source === 'manual' && (post.status || 'published') === 'published');
}

/** Public = hand-written notes, or generated posts that were promoted by the quality gate. */
export function isPublicPost(post: any): boolean {
  if (!post || (post.status || 'published') !== 'published') return false;
  if (post.source === 'manual') return true;
  return post.source === 'ai-agent' && post.gate === 'passed';
}

function readJsonArray(file: string): any[] {
  if (!fs.existsSync(file)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeJson(file: string, data: any[]) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

export function loadPublicPosts(): any[] {
  const map = new Map<string, any>();
  for (const post of readJsonArray(PUBLIC_POSTS).concat(readJsonArray(ARCHIVE_POSTS))) {
    const key = post.slug || post.id;
    if (key && isPublicPost(post)) map.set(key, post);
  }
  return Array.from(map.values())
    .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
}

export function loadArchivePosts(): any[] {
  return readJsonArray(ARCHIVE_POSTS);
}

export function loadAllForDedup(): any[] {
  const map = new Map<string, any>();
  for (const post of loadArchivePosts().concat(readJsonArray(PUBLIC_POSTS))) {
    const key = post.slug || post.id;
    if (key) map.set(key, post);
  }
  return Array.from(map.values());
}

export function persistDraft(post: any): string {
  const key = post.slug || post.id;
  if (!key) throw new Error('Draft post is missing slug/id');
  const verdict = post.source === 'manual' ? { pass: false, reasons: [] } : evaluateGate(post, loadPublicPosts());
  const draft = {
    ...post,
    id: post.id || key,
    source: post.source || 'ai-agent',
    status: verdict.pass ? 'published' : 'draft',
    gate: verdict.pass ? 'passed' : 'held',
    gateReasons: verdict.reasons,
  };
  const map = new Map<string, any>();
  for (const item of loadArchivePosts()) {
    const itemKey = item.slug || item.id;
    if (itemKey) map.set(itemKey, item);
  }
  map.set(key, draft);
  writeJson(ARCHIVE_POSTS, Array.from(map.values()));
  writeJson(PUBLIC_POSTS, loadPublicPosts());
  console.log(verdict.pass
    ? `🚀 [Quality Gate] PASSED - publishing "${post.title}"`
    : `🛑 [Quality Gate] HELD as draft: ${verdict.reasons.join('; ')}`);
  return key;
}

/** Re-run the gate over the whole archive and promote anything that qualifies. */
export function promoteApproved(): { promoted: string[]; held: number } {
  const archive = loadArchivePosts();
  const published = loadPublicPosts();
  const promoted: string[] = [];
  const next = archive.map((post) => {
    if (post.source === 'manual' || post.gate === 'passed') return post;
    const verdict = evaluateGate(post, published);
    if (!verdict.pass) return { ...post, status: 'draft', gate: 'held', gateReasons: verdict.reasons };
    const out = { ...post, status: 'published', gate: 'passed', gateReasons: [] };
    published.push(out);
    promoted.push(post.slug || post.id);
    return out;
  });
  writeJson(ARCHIVE_POSTS, next);
  writeJson(PUBLIC_POSTS, loadPublicPosts());
  return { promoted, held: next.filter((p) => p.gate !== 'passed' && p.source !== 'manual').length };
}

export function rewritePublicIndex() {
  writeJson(PUBLIC_POSTS, loadPublicPosts());
}
