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
exports.loadPublicPosts = loadPublicPosts;
exports.loadArchivePosts = loadArchivePosts;
exports.loadAllForDedup = loadAllForDedup;
exports.persistDraft = persistDraft;
exports.rewritePublicIndex = rewritePublicIndex;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
exports.PUBLIC_POSTS = path.resolve(__dirname, '../public/blog/posts.json');
exports.ARCHIVE_POSTS = path.resolve(__dirname, '../public/blog/archive/ai-posts.json');
function isPublicManualPost(post) {
    return Boolean(post && post.source === 'manual' && (post.status || 'published') === 'published');
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
    return readJsonArray(exports.PUBLIC_POSTS)
        .filter(isPublicManualPost)
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
function persistDraft(post) {
    const key = post.slug || post.id;
    if (!key)
        throw new Error('Draft post is missing slug/id');
    const draft = {
        ...post,
        id: post.id || key,
        source: post.source || 'ai-agent',
        status: 'draft',
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
    return key;
}
function rewritePublicIndex() {
    writeJson(exports.PUBLIC_POSTS, loadPublicPosts());
}
