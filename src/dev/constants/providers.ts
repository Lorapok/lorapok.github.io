// src/dev/constants/providers.ts
export type AIProviderId = "claude" | "openai" | "gemini" | "mistral" | "groq" | "cohere" | "deepseek" | "perplexity" | "xai" | "together" | "openrouter" | "anyscale";

export interface AIProvider {
  id: AIProviderId;
  label: string;
  color: string;
  model: string;
  availableModels: string[];
}

export const AI_PROVIDERS: AIProvider[] = [
  { id: "claude", label: "Claude", color: "#4ade80", model: "claude-3-5-sonnet-20240620", availableModels: ["claude-3-5-sonnet-20240620", "claude-3-opus-20240229", "claude-3-haiku-20240307"] },
  { id: "openai", label: "OpenAI", color: "#60a5fa", model: "gpt-4o", availableModels: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo", "gpt-4o-mini"] },
  { id: "gemini", label: "Gemini", color: "#34d399", model: "gemini-1.5-pro", availableModels: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro"] },
  { id: "mistral", label: "Mistral", color: "#f97316", model: "mistral-large-latest", availableModels: ["mistral-large-latest", "open-mixtral-8x22b", "open-mistral-nemo"] },
  { id: "groq", label: "Groq", color: "#a78bfa", model: "llama-3.1-70b-versatile", availableModels: ["llama-3.1-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"] },
  { id: "cohere", label: "Cohere", color: "#fbbf24", model: "command-r-plus", availableModels: ["command-r-plus", "command-r", "command-light"] },
  { id: "deepseek", label: "DeepSeek", color: "#0056FF", model: "deepseek-chat", availableModels: ["deepseek-chat", "deepseek-coder"] },
  { id: "perplexity", label: "Perplexity", color: "#22d3ee", model: "llama-3.1-sonar-large-128k-online", availableModels: ["llama-3.1-sonar-large-128k-online", "llama-3.1-sonar-small-128k-online"] },
  { id: "xai", label: "xAI Grok", color: "#000000", model: "grok-2", availableModels: ["grok-2", "grok-2-mini"] },
  { id: "together", label: "Together AI", color: "#3b82f6", model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", availableModels: ["meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"] },
  { id: "openrouter", label: "OpenRouter", color: "#a855f7", model: "openrouter/auto", availableModels: ["openrouter/auto", "anthropic/claude-3.5-sonnet", "openai/gpt-4o"] },
  { id: "anyscale", label: "Anyscale", color: "#14b8a6", model: "meta-llama/Meta-Llama-3-70B-Instruct", availableModels: ["meta-llama/Meta-Llama-3-70B-Instruct", "meta-llama/Llama-2-70b-chat-hf"] },
];
