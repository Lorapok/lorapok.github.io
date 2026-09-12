// agent/imageGen.ts
// Professional Image Generation & Curated Asset Selection Module for LoLaBo
// Guarantees distinct, topic-relevant, high-resolution editorial cover images for every post

export interface ImageGenOptions {
  category?: string;
  imageKeywords?: string[];
  imagePrompt?: string;
  mode?: 'gemini' | 'stock' | 'auto' | 'pollinations' | 'ai';
}

// ─── Curated, Verified 1200x630 Tech Photography Banks ───
// All photos verified active, high-resolution, dark aesthetic, optimized for editorial tech covers
const THEME_PHOTO_BANKS: Record<string, string[]> = {
  ai_neural: [
    "photo-1620712943543-bcc4688e7485", // AI neural network glowing core
    "photo-1618005182384-a83a8bd57fbe", // Blue generative abstract landscape
    "photo-1635070041078-e363dbe005cb", // Cyberpunk neural lattice
    "photo-1634017839464-5c339ebe3cb4", // Quantum qubit processor
    "photo-1507413245164-6160d8298b31", // Holographic model computation
    "photo-1485827404703-89b55fcc595e", // AI robotic vision sensor
    "photo-1535223289827-42f1e9919769", // Futuristic cybernetic interface
  ],
  backend_infra: [
    "photo-1558494949-ef010cbdcc31", // Modern datacenter server rack blue
    "photo-1544197150-b99a580bb7a8", // Datacenter server corridor
    "photo-1504384308090-c894fdcc538d", // Optical fiber network cables
    "photo-1451187580459-43490279c0fa", // Global distributed network from space
    "photo-1563986768609-322da13575f3", // High availability server cluster
    "photo-1607799279861-4dd421887fb3", // DevOps monitors and system operations
    "photo-1526374965328-7f61d4dc18c5", // Matrix binary routing streams
  ],
  security_crypto: [
    "photo-1563986768494-4dee2763ff3f", // Cryptographic security padlock
    "photo-1510511459019-5dda7724fd87", // Cyber defense firewall code
    "photo-1555949963-ff9fe0c870eb", // Cyber warfare & threat shield
    "photo-1504639725590-34d0984388bd", // Security audit terminal radar
    "photo-1614064641938-3bbee52942c7", // Biometric cybersecurity scanner
    "photo-1516321318423-f06f85e504b3", // Encrypted digital communication
  ],
  mobile_native: [
    "photo-1512941937669-90a1b58e7e9c", // Tactile smartphone UX interface
    "photo-1511707171634-5f897ff02aa9", // Disassembled smartphone silicon & glass
    "photo-1551650975-87deedd944c3", // Mobile engineering testing device
    "photo-1556656793-08538906a9f8", // Modern mobile display interface
    "photo-1585060544812-6b45742d762f", // Dual-screen hardware architecture
    "photo-1525547719571-a2d4ac8945e2", // Laptop and mobile device workspace
  ],
  frontend_ui: [
    "photo-1507238691740-187a5b1d37b8", // Modern web design workspace
    "photo-1498050108023-c5249f4df085", // Clean minimalist code layout
    "photo-1550751827-4bd374c3f58b", // Visual computing gradient canvas
    "photo-1460925895917-afdab827c52f", // Responsive analytics dashboard
    "photo-1508739773434-c26b3d09e071", // Sleek geometric typography
    "photo-1579546929518-9e396f3cc809", // Generative color palette UI
  ],
  opensource_dev: [
    "photo-1555066931-4365d14bab8c", // Neon terminal code and git commits
    "photo-1522071820081-009f0129c71c", // Global collaborative developer team
    "photo-1531482615713-2afd69097998", // Engineering conference collaboration
    "photo-1519389950473-47ba0277781c", // Connected developers working online
    "photo-1515879218367-8466d910aaa4", // Python and open source code syntax
    "photo-1581091226825-a6a2a5aee158", // Hardware innovation and IoT hacking
  ],
  general_tech: [
    "photo-1518770660439-4636190af475", // Electronic circuit microchip
    "photo-1531297484001-80022131f5a1", // High performance workstation
    "photo-1488590528505-98d2b5aba04b", // Data analytics technology screen
    "photo-1550745165-9bc0b252726f", // Retro-futuristic cyberpunk hardware
    "photo-1581092160607-ee22621dd758", // Precision robotics laboratory
  ]
};

/**
 * Deterministically generates an integer hash from any string
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Resolves the most accurate technical theme key based on title, category, and tags
 */
export function resolveTechnicalTheme(title: string, category: string = '', tags: string[] = [], keywords: string[] = []): string {
  const text = `${title} ${category} ${tags.join(' ')} ${keywords.join(' ')}`.toLowerCase();

  // 1. AI & Machine Learning
  if (
    /llm|distillation|neural|model|weights|transformer|gpt|gemini|deep learning|machine learning|artificial intelligence|prompt|inference|token/i.test(text)
  ) {
    return 'ai_neural';
  }

  // 2. Security & Cryptography
  if (
    /security|vulnerability|exploit|evasion|cryptographic|watermarking|firewall|defense|hack|zero trust|encryption|auth/i.test(text)
  ) {
    return 'security_crypto';
  }

  // 3. Mobile & Native Development
  if (
    /shopify|mobile|ios|android|swift|kotlin|react native|flutter|cross-platform|native development|phone|app store/i.test(text)
  ) {
    return 'mobile_native';
  }

  // 4. Backend & Distributed Systems
  if (
    /opentelemetry|tracing|observability|distributed|golang|go |microservices|kubernetes|docker|cloud|server|database|grpc|kafka|infra/i.test(text) ||
    category.includes('Backend') || category.includes('Infrastructure')
  ) {
    return 'backend_infra';
  }

  // 5. Frontend & UI Engineering
  if (
    /frontend|ui|ux|css|canvas|react|vue|component|design system|browser|web app|dom|tailwind/i.test(text) ||
    category.includes('Frontend')
  ) {
    return 'frontend_ui';
  }

  // 6. Open Source
  if (
    /open source|github|git|community|maintainer|foss|repository|package/i.test(text) ||
    category.includes('Open Source')
  ) {
    return 'opensource_dev';
  }

  return 'general_tech';
}

/**
 * Builds a deterministic, high-definition online AI Flux image URL for a post
 */
export function buildFluxImageUrl(
  title: string,
  category: string = 'General Tech',
  tags: string[] = [],
  imageKeywords: string[] = [],
  imagePrompt?: string,
  seed?: number
): string {
  const theme = resolveTechnicalTheme(title, category, tags, imageKeywords);
  const subjectTerms = (imageKeywords.length > 0 ? imageKeywords : tags.slice(0, 3)).join(', ');
  const cleanTitle = title.replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim();

  let visualPrompt = '';
  if (imagePrompt && imagePrompt.trim().length > 15) {
    visualPrompt = imagePrompt.trim()
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/[^\w\s,.:;()/-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!visualPrompt.toLowerCase().includes('octane') && !visualPrompt.toLowerCase().includes('8k')) {
      visualPrompt += ', dark minimalist tech aesthetic, octane render, 8k resolution, cinematic lighting, zero text, zero watermark';
    }
  } else {
    visualPrompt = `${cleanTitle}, ${category}, ${subjectTerms}, physical hardware and systems architecture diagram, isometric cutaway blueprint, glowing telemetry data paths, dark graphite chassis, volumetric lighting, photorealistic, octane render 8k, zero text, zero watermark`;
  }

  const cleanPrompt = visualPrompt.slice(0, 600).trim();
  const calculatedSeed = seed !== undefined ? seed : (hashString(cleanTitle + theme) % 10000000);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1200&height=630&nologo=true&seed=${calculatedSeed}&model=flux`;
}

/**
 * Normalizes an entire catalog of posts to guarantee 100% unique, online AI Flux cover images.
 * Replaces any stock photography (Unsplash) and eliminates all duplicate image URLs.
 */
export function normalizePostImages(posts: any[]): { posts: any[]; updatedCount: number } {
  if (!Array.isArray(posts)) return { posts: [], updatedCount: 0 };

  const seenUrls = new Set<string>();
  let updatedCount = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (!post) continue;

    let currentUrl = (post.coverImage || '').trim();
    const isUnsplash = currentUrl.includes('unsplash.com') || currentUrl.includes('photo-');
    const isDuplicate = seenUrls.has(currentUrl);
    const isMissing = !currentUrl;

    if (isUnsplash || isDuplicate || isMissing) {
      // Generate a distinct, guaranteed unique Pollinations AI Flux URL
      let primeOffset = 0;
      let candidateUrl = '';
      const baseSeed = Math.abs(hashString((post.slug || post.id || post.title || '') + i) % 10000000);

      while (primeOffset < 50) {
        const candidateSeed = (baseSeed + primeOffset * 104729 + (i + 1) * 7919) % 10000000;
        candidateUrl = buildFluxImageUrl(
          post.title || `Technical Research Paper ${i + 1}`,
          post.category || 'Backend & Infrastructure',
          post.tags || [],
          post.imageKeywords || [],
          post.imagePrompt,
          candidateSeed
        );

        if (!seenUrls.has(candidateUrl)) {
          break;
        }
        primeOffset++;
      }

      console.log(`🔄 [LoLaBo Image Normalizer] Replaced ${isUnsplash ? 'Unsplash' : isDuplicate ? 'duplicate' : 'missing'} visual on "${post.slug || post.title}" with unique AI Flux image.`);
      post.coverImage = candidateUrl;
      updatedCount++;
    }

    seenUrls.add(post.coverImage);
  }

  return { posts, updatedCount };
}

/**
 * Generates or selects a distinct, professionally matched cover image for a blog post.
 * Enforces 100% online AI generation (Flux) and strict catalog deduplication (zero image reuse).
 */
export async function generateCoverImage(
  title: string,
  tags: string[] = [],
  mode: 'gemini' | 'stock' | 'auto' | 'pollinations' | 'ai' = 'auto',
  category: string = 'General Tech',
  imageKeywords: string[] = [],
  imagePrompt?: string,
  existingPosts: any[] = []
): Promise<string> {
  console.log(`🎨 Generating distinct online AI cover image for: "${title}" (Mode: ${mode})...`);

  // Build a set of all previously used image URLs to guarantee zero duplication
  const usedImages = new Set<string>();
  for (const p of existingPosts) {
    if (p && p.coverImage && typeof p.coverImage === 'string') {
      usedImages.add(p.coverImage.trim());
    }
  }

  // 100% Online AI Generation (Pollinations AI - Flux Architecture)
  // Generates unique, cinematic, topic-tailored technical visuals with custom seeds
  const theme = resolveTechnicalTheme(title, category, tags, imageKeywords);
  const baseSeed = hashString(title + theme);

  for (let attempt = 0; attempt < 50; attempt++) {
    const candidateSeed = (baseSeed + attempt * 104729 + Date.now() % 10000) % 100000000;
    const candidateUrl = buildFluxImageUrl(
      title,
      category,
      tags,
      imageKeywords,
      imagePrompt,
      candidateSeed
    );

    if (!usedImages.has(candidateUrl)) {
      console.log(`✅ Generated 100% unique online AI Flux cover image (Seed verified against ${usedImages.size} existing catalog images)`);
      return candidateUrl;
    }
  }

  // Guaranteed fallback: timestamp-salted AI Flux URL
  const emergencySeed = (baseSeed + Date.now()) % 100000000;
  return buildFluxImageUrl(title, category, tags, imageKeywords, imagePrompt, emergencySeed);
}
