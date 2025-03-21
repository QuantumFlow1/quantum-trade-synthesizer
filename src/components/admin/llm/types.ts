
export type LLMProviderType = "openai" | "groq" | "anthropic" | "ollama" | "deepseek";

export interface LLMModel {
  id: string;
  name: string;
  provider: LLMProviderType;
  contextLength?: number;
  description?: string;
}

export interface LLMChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  provider: LLMProviderType;
  model: string;
  timestamp?: Date;
  isStreaming?: boolean;
  isError?: boolean;
}

export interface LLMProvider {
  id: LLMProviderType;
  name: string;
  description: string;
  apiKeyConfigured: boolean;
  models: LLMModel[];
  isActive?: boolean;
}
