// agent/imageGen.ts
// Image Generation Module for LoLaBo
// Supports Gemini ImageGen with Stock Photo fallback (Unsplash)

export async function generateCoverImage(title: string, tags: string[], mode: 'gemini' | 'stock' | 'auto') {
  console.log(`🎨 Generating cover image (Mode: ${mode})...`);

  if (mode === 'gemini' || mode === 'auto') {
    try {
      const imageUrl = await callGeminiImageGen(title);
      if (imageUrl) return imageUrl;
    } catch (e) {
      console.warn("⚠️ Gemini ImageGen failed, falling back to stock...", e);
    }
  }

  // Fallback to Unsplash
  return await getStockPhoto(tags[0] || 'technology');
}

async function callGeminiImageGen(prompt: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  console.log("Calling Gemini ImageGen...");
  // Gemini Image Gen usually requires specific model names (e.g., imagen-3)
  // For this draft, we'll use a placeholder URL structure as Gemini's ImageGen API 
  // is often restricted or uses a different endpoint structure.
  // In a real production agent, we would use the vertex AI or specific Gemini Imagen endpoints.
  
  return null; // Fallback for now until specific endpoint is confirmed
}

async function getStockPhoto(keyword: string) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    // Return a nice stylized placeholder from Unsplash Source (Legacy but often works)
    return `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200&h=630`;
  }

  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&orientation=landscape&per_page=1`, {
      headers: { 'Authorization': `Client-ID ${key}` }
    });
    const data = await res.json();
    return data.results[0]?.urls?.regular || null;
  } catch (e) {
    console.error("Stock photo fetch failed:", e);
    return null;
  }
}
