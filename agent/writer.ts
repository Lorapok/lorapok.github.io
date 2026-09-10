// agent/writer.ts
// AI Writer Module for LoLaBo
// Transforms raw news items into professional, SEO-optimized blog posts

import { NewsItem } from './collector';

export interface AuthorPersona {
  name: string;
  designation: string;
  avatar: string;
}

const AUTHOR_PERSONAS: Record<string, AuthorPersona> = {
  'AI & Machine Learning': { name: "Dr. Larva", designation: "Chief Neural Officer", avatar: "🧬" },
  'Backend & Infrastructure': { name: "Captain Deploy", designation: "Infrastructure Overlord", avatar: "🚀" },
  'Security': { name: "Agent Cocoon", designation: "Director of Digital Defense", avatar: "🛡️" },
  'Frontend Engineering': { name: "Pixel Pete", designation: "Senior Aesthetic Engineer", avatar: "🎨" },
  'Open Source': { name: "Fork Master Flash", designation: "Head of Community Chaos", avatar: "🍴" },
  'Mobile & UX': { name: "Swipe Right Sally", designation: "Mobile Experience Architect", avatar: "📱" },
  'General Tech': { name: "The Lorapok Oracle", designation: "Tech Wisdom Dispenser", avatar: "🔮" }
};

export async function writeBlogPost(
  newsItems: NewsItem[], 
  config: { provider: string, targetAudience: string, tone: string }
) {
  console.log(`🧠 Writing blog post using ${config.provider}...`);

  // 1. Selection Strategy: AI picks the most relevant/trending news item to expand
  // For now, we take the top few items and ask the AI to synthesize or pick the best one.
  const newsContext = newsItems.map(n => `[${n.source}] ${n.title}\n${n.content.slice(0, 200)}...`).join('\n\n');

  const systemPrompt = `You are the LoLaBo (Lorapok Labs Blog) Autonomous Writer Agent.
Your goal is to write a high-fidelity, professional tech blog post based on trending news.

TARGET AUDIENCE: ${config.targetAudience}
TONE: ${config.tone}

INSTRUCTIONS:
1. Review the provided news context and pick the MOST IMPACTFUL story or synthesize a trend.
2. Write a comprehensive, Medium-quality article (~800-1200 words).
3. Use Markdown formatting (H1, H2, H3, bold, lists).
4. Include an 'Excerpt' (2 sentences) and a 'Title'.
5. Include 'Tags' (comma separated) and a 'Category' from: AI & Machine Learning, Backend & Infrastructure, Security, Frontend Engineering, Open Source, Mobile & UX, General Tech.
6. Create an SEO meta title and description.
7. Credit the original sources.

OUTPUT FORMAT (JSON):
{
  "title": "...",
  "excerpt": "...",
  "content": "...",
  "category": "...",
  "tags": ["...", "..."],
  "seo": { "metaTitle": "...", "metaDescription": "..." }
}`;

  const userPrompt = `TRENDING NEWS CONTEXT:\n${newsContext}\n\nPlease write a masterpiece article for the Lorapok Labs ecosystem based on this data.`;

  // Dynamic API Calling (Simplified for the script)
  let response;
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) throw new Error("Neither AI_API_KEY nor GEMINI_API_KEY found in environment.");

  // Logic for different providers (Gemini, OpenAI, Claude, Groq)
  // We'll implement a generic fetch for simplicity in this draft
  // Actual implementation would use specific SDKs or REST APIs
  
  // For the purpose of this script, we'll assume a helper handles the multi-provider routing
  response = await callAIProvider(config.provider, apiKey, systemPrompt, userPrompt);

  const blogData = parseLLMJson(response);
  
  // Attach Author
  const author = AUTHOR_PERSONAS[blogData.category] || AUTHOR_PERSONAS['General Tech'];
  
  return {
    ...blogData,
    author,
    source: 'ai-agent',
    status: 'published',
    publishedAt: new Date(),
    views: 0,
    readTime: Math.ceil(blogData.content.split(' ').length / 200)
  };
}

async function callAIProvider(provider: string, key: string, system: string, user: string) {
  // Implementation of different AI APIs
  // Defaulting to a standard POST structure used by many (like OpenAI/Groq compatible)
  console.log(`Calling ${provider} API...`);
  
  let url = '';
  let body = {};
  
  if (provider === 'gemini') {
    url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`;
    body = {
      contents: [{ role: 'user', parts: [{ text: `${system}\n\n${user}` }] }],
      generationConfig: { responseMimeType: "application/json" }
    };
  } else if (provider === 'groq') {
    url = 'https://api.groq.com/openai/v1/chat/completions';
    body = {
      model: 'llama3-8b-8192',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      response_format: { type: "json_object" }
    };
  } else {
    // Fallback/Placeholder for others
    url = 'https://api.openai.com/v1/chat/completions';
    body = {
      model: provider === 'openai' ? 'gpt-4-turbo' : 'claude-3-opus-20240229',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      response_format: { type: "json_object" }
    };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(provider !== 'gemini' && { 'Authorization': `Bearer ${key}` })
    },
    body: JSON.stringify(body)
  });

  const data: any = await res.json();
  
  if (provider === 'gemini') {
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error("Gemini API Error details:", JSON.stringify(data));
      throw new Error(`Gemini response missing content: ${data?.error?.message || JSON.stringify(data)}`);
    }
    return text;
  }
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    console.error("AI API Error details:", JSON.stringify(data));
    throw new Error(`AI response missing content: ${data?.error?.message || JSON.stringify(data)}`);
  }
  return content;
}

function parseLLMJson(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    try {
      let inString = false;
      let escaped = false;
      let result = '';

      for (let i = 0; i < cleaned.length; i++) {
        const char = cleaned[i];
        if (escaped) {
          result += char;
          escaped = false;
          continue;
        }
        if (char === '\\') {
          result += char;
          escaped = true;
          continue;
        }
        if (char === '"') {
          inString = !inString;
          result += char;
          continue;
        }
        if (inString) {
          if (char === '\n') {
            result += '\\n';
          } else if (char === '\r') {
            result += '\\r';
          } else if (char === '\t') {
            result += '\\t';
          } else if (char.charCodeAt(0) < 32) {
            // omit invalid ASCII control characters
          } else {
            result += char;
          }
        } else {
          result += char;
        }
      }
      return JSON.parse(result);
    } catch (innerErr) {
      console.error("Failed to parse LLM JSON output:", raw.slice(0, 500));
      throw innerErr;
    }
  }
}
