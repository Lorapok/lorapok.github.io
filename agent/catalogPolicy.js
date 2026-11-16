"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARCHIVE_POSTS = exports.PUBLIC_POSTS = void 0;
exports.isPublicManualPost = isPublicManualPost;
exports.isPublicPost = isPublicPost;
exports.loadPublicPosts = loadPublicPosts;
exports.loadArchivePosts = loadArchivePosts;
exports.loadAllForDedup = loadAllForDedup;
exports.persistDraft = persistDraft;
exports.promoteApproved = promoteApproved;
exports.rewritePublicIndex = rewritePublicIndex;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const qualityGate_1 = require("./qualityGate");
exports.PUBLIC_POSTS = path.resolve(__dirname, '../public/blog/posts.json');
exports.ARCHIVE_POSTS = path.resolve(__dirname, '../public/blog/archive/ai-posts.json');
function isPublicManualPost(post) {
    return Boolean(post && post.source === 'manual' && (post.status || 'published') === 'published');
}
/** Public = hand-written notes, or generated posts that were promoted by the quality gate. */
function isPublicPost(post) {
    if (!post || (post.status || 'published') !== 'published')
        return false;
    if (post.source === 'manual')
        return true;
    return post.source === 'ai-agent' && post.gate === 'passed';
}
function readJsonArray(file) {
    if (!fs.existsSync(file))
        return [];
    try {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        return Array.isArray(data) ? data : [];
    }
    catch {
        return [];
    }
}
function writeJson(file, data) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}
function loadPublicPosts() {
    const map = new Map();
    for (const post of readJsonArray(exports.PUBLIC_POSTS).concat(readJsonArray(exports.ARCHIVE_POSTS))) {
        const key = post.slug || post.id;
        if (key && isPublicPost(post))
            map.set(key, post);
    }
    return Array.from(map.values())
        .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
}
function loadArchivePosts() {
    return readJsonArray(exports.ARCHIVE_POSTS);
}
function loadAllForDedup() {
    const map = new Map();
    for (const post of loadArchivePosts().concat(readJsonArray(exports.PUBLIC_POSTS))) {
        const key = post.slug || post.id;
        if (key)
            map.set(key, post);
    }
    return Array.from(map.values());
}
function persistDraft(post, options = {}) {
    const key = post.slug || post.id;
    if (!key)
        throw new Error('Draft post is missing slug/id');
    const verdict = post.source === 'manual' ? { pass: false, reasons: [] } : (0, qualityGate_1.evaluateGate)(post, loadPublicPosts());
    const shouldPublish = verdict.pass && options.autoPublishPassed !== false;
    const draft = {
        ...post,
        id: post.id || key,
        source: post.source || 'ai-agent',
        status: shouldPublish ? 'published' : 'draft',
        gate: shouldPublish ? 'passed' : (verdict.pass ? 'approved' : 'held'),
        gateReasons: verdict.pass && !shouldPublish ? ['quality gate passed; awaiting Office approval'] : verdict.reasons,
    };
    const map = new Map();
    for (const item of loadArchivePosts()) {
        const itemKey = item.slug || item.id;
        if (itemKey)
            map.set(itemKey, item);
    }
    map.set(key, draft);
    writeJson(exports.ARCHIVE_POSTS, Array.from(map.values()));
    writeJson(exports.PUBLIC_POSTS, loadPublicPosts());
    console.log(shouldPublish
        ? `🚀 [Quality Gate] PASSED - publishing "${post.title}"`
        : verdict.pass
            ? `✅ [Quality Gate] APPROVED - awaiting Office approval for "${post.title}"`
            : `🛑 [Quality Gate] HELD as draft: ${verdict.reasons.join('; ')}`);
    return key;
}
/** Re-run the gate over the whole archive and promote anything that qualifies. */
function promoteApproved() {
    const archive = loadArchivePosts();
    const published = loadPublicPosts();
    const promoted = [];
    const next = archive.map((post) => {
        if (post.source === 'manual' || post.gate === 'passed')
            return post;
        const verdict = (0, qualityGate_1.evaluateGate)(post, published);
        if (!verdict.pass)
            return { ...post, status: 'draft', gate: 'held', gateReasons: verdict.reasons };
        const out = { ...post, status: 'published', gate: 'passed', gateReasons: [] };
        published.push(out);
        promoted.push(post.slug || post.id);
        return out;
    });
    writeJson(exports.ARCHIVE_POSTS, next);
    writeJson(exports.PUBLIC_POSTS, loadPublicPosts());
    return { promoted, held: next.filter((p) => p.gate !== 'passed' && p.source !== 'manual').length };
}
function rewritePublicIndex() {
    writeJson(exports.PUBLIC_POSTS, loadPublicPosts());
}
