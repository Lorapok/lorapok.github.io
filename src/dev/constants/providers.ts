// src/dev/constants/providers.ts
export type AIProviderId = "claude" | "openai" | "gemini" | "mistral" | "groq" | "cohere" | "deepseek" | "perplexity" | "xai" | "together" | "openrouter" | "anyscale";

export interface AIProvider {
  id: AIProviderId;
  label: string;
  color: string;
  model: string;
}

export const AI_PROVIDERS: AIProvider[] = [
  { id: "claude", label: "Claude", color: "#4ade80", model: "claude-sonnet-4-20250514" },
  { id: "openai", label: "OpenAI", color: "#60a5fa", model: "gpt-4o" },
  { id: "gemini", label: "Gemini", color: "#34d399", model: "gemini-1.5-pro" },
  { id: "mistral", label: "Mistral", color: "#f97316", model: "mistral-large" },
  { id: "groq", label: "Groq", color: "#a78bfa", model: "llama-3.1-70b" },
  { id: "cohere", label: "Cohere", color: "#fbbf24", model: "command-r-plus" },
  { id: "deepseek", label: "DeepSeek", color: "#0056FF", model: "deepseek-chat" },
  { id: "perplexity", label: "Perplexity", color: "#22d3ee", model: "sonar-reasoning-pro" },
  { id: "xai", label: "xAI Grok", color: "#000000", model: "grok-beta" },
  { id: "together", label: "Together AI", color: "#3b82f6", model: "meta-llama/Llama-3-70b-chat-hf" },
  { id: "openrouter", label: "OpenRouter", color: "#a855f7", model: "openrouter/auto" },
  { id: "anyscale", label: "Anyscale", color: "#14b8a6", model: "meta-llama/Llama-2-70b-chat-hf" },
];
