// src/lib/blogService.ts
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  setDoc
} from "firebase/firestore";
import { db } from "./firebase";
import type { BlogPost } from "../blog/BlogApp";

const POSTS_COLLECTION = "blog_posts";
const CONFIG_COLLECTION = "agent_config";
const CONFIG_DOC_ID = "lolabo_settings";

export interface AgentConfig {
  isEnabled: boolean;
  intervalHours: number;
  lastRunAt: Timestamp | null;
  writingProvider: string; // 'gemini' | 'openai' | 'claude' | 'groq'
  imageGenMode: 'gemini' | 'stock' | 'auto'; // auto means gemini with stock fallback
  enabledSocials: string[]; // ['discord', 'twitter', 'linkedin', 'reddit']
  targetAudience: string;
  tone: string;
  triggerRequested?: boolean;
  lastTriggerAt?: Timestamp | null;
}

export const DEFAULT_AGENT_CONFIG: AgentConfig = {
  isEnabled: false,
  intervalHours: 24,
  lastRunAt: null,
  writingProvider: 'gemini',
  imageGenMode: 'auto',
  enabledSocials: ['discord'],
  targetAudience: 'Developers',
  tone: 'Technical & precise'
};

export const blogService = {
  // ─── Posts ───
  async getPublishedPosts(limitCount = 20) {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where("status", "==", "published"),
      orderBy("publishedAt", "desc"),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
  },

  async getPostBySlug(slug: string) {
    const q = query(collection(db, POSTS_COLLECTION), where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as BlogPost;
  },

  async createPost(post: Omit<BlogPost, 'id'>) {
    return await addDoc(collection(db, POSTS_COLLECTION), post);
  },

  async updatePost(id: string, updates: Partial<BlogPost>) {
    const postRef = doc(db, POSTS_COLLECTION, id);
    return await updateDoc(postRef, updates);
  },

  // ─── Config ───
  async getAgentConfig(): Promise<AgentConfig> {
    const configRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
    const snap = await getDoc(configRef);
    if (!snap.exists()) {
      await setDoc(configRef, DEFAULT_AGENT_CONFIG);
      return DEFAULT_AGENT_CONFIG;
    }
    return snap.data() as AgentConfig;
  },

  async updateAgentConfig(updates: Partial<AgentConfig>) {
    const configRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
    return await updateDoc(configRef, updates);
  },

  async triggerAgentRun() {
    const configRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
    return await updateDoc(configRef, {
      triggerRequested: true,
      lastTriggerAt: Timestamp.now()
    });
  },

  // ─── Analytics ───
  async getBlogStats() {
    const snap = await getDocs(collection(db, POSTS_COLLECTION));
    const posts = snap.docs.map(d => d.data() as BlogPost);
    
    return {
      totalPosts: posts.length,
      totalViews: posts.reduce((acc, p) => acc + (p.views || 0), 0),
      totalShares: posts.reduce((acc, p) => acc + (p.socialShares?.length || 0), 0),
      totalLikes: posts.reduce((acc, p) => acc + (p.likes || 0), 0),
      totalComments: posts.reduce((acc, p) => acc + (p.commentsCount || 0), 0),
      aiGeneratedRatio: posts.filter(p => p.source === 'ai-agent').length / (posts.length || 1),
      categoryDistribution: posts.reduce((acc: Record<string, number>, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {})
    };
  }
};
