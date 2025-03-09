export type ModelId = 
  | 'grok3' 
  | 'gpt-4' 
  | 'gpt-3.5-turbo' 
  | 'claude-3-haiku' 
  | 'claude-3-sonnet' 
  | 'claude-3-opus' 
  | 'gemini-pro' 
  | 'deepseek-chat'
  | 'openai'
  | 'gemini'
  | 'claude'
  | 'deepseek';

// Add this type alias for the messageService to use
export type AIModelType = ModelId;

export interface ModelInfo {
  id: ModelId;
  name: string;
  description?: string;
  needsApiKey?: boolean;
}

export const AI_MODELS: ModelInfo[] = [
  { id: 'grok3', name: 'Grok 3', description: 'Snelle en krachtige AI van xAI' },
  { id: 'openai', name: 'GPT-4o', description: 'Nieuwste multimodale AI van OpenAI', needsApiKey: true },
  { id: 'claude', name: 'Claude 3', description: 'Uitstekend voor nuancering en logica', needsApiKey: true },
  { id: 'gemini', name: 'Gemini Pro', description: 'Geavanceerde AI van Google', needsApiKey: true },
  { id: 'deepseek', name: 'DeepSeek Coder', description: 'Gespecialiseerd in code en technische analyses', needsApiKey: true },
];

export interface ApiKeySettings {
  openaiApiKey?: string;
  claudeApiKey?: string;
  geminiApiKey?: string;
  deepseekApiKey?: string;
  groqApiKey?: string;
}

export interface GrokSettings {
  selectedModel: ModelId;
  deepSearchEnabled: boolean;
  thinkEnabled: boolean;
  temperature?: number;
  maxTokens?: number;
  apiKeys: ApiKeySettings;
}

export const DEFAULT_SETTINGS: GrokSettings = {
  selectedModel: 'grok3',
  deepSearchEnabled: false,
  thinkEnabled: false,
  temperature: 0.7,
  maxTokens: 1024,
  apiKeys: {}
};
