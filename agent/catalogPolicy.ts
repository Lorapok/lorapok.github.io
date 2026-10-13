import * as fs from 'fs';
import * as path from 'path';

export const PUBLIC_POSTS = path.resolve(__dirname, '../public/blog/posts.json');
export const ARCHIVE_POSTS = path.resolve(__dirname, '../public/blog/archive/ai-posts.json');

export function isPublicManualPost(post: any): boolean {
  return Boolean(post && post.source === 'manual' && (post.status || 'published') === 'published');
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
  return readJsonArray(PUBLIC_POSTS)
    .filter(isPublicManualPost)
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
  const draft = {
    ...post,
    id: post.id || key,
    source: post.source || 'ai-agent',
    status: 'draft',
  };
  const map = new Map<string, any>();
  for (const item of loadArchivePosts()) {
    const itemKey = item.slug || item.id;
    if (itemKey) map.set(itemKey, item);
  }
  map.set(key, draft);
  writeJson(ARCHIVE_POSTS, Array.from(map.values()));
  writeJson(PUBLIC_POSTS, loadPublicPosts());
  return key;
}

export function rewritePublicIndex() {
  writeJson(PUBLIC_POSTS, loadPublicPosts());
}
