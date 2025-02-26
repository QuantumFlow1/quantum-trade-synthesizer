
export type ModelId = 'grok3' | 'openai' | 'gemini' | 'claude' | 'deepseek';

// Add this type alias for the messageService to use
export type AIModelType = ModelId;

export interface ModelInfo {
  id: ModelId;
  name: string;
  description?: string;
}

export const AI_MODELS: ModelInfo[] = [
  { id: 'grok3', name: 'Grok 3', description: 'Snelle en krachtige AI van xAI' },
  { id: 'openai', name: 'GPT-4o', description: 'Nieuwste multimodale AI van OpenAI' },
  { id: 'claude', name: 'Claude 3', description: 'Uitstekend voor nuancering en logica' },
  { id: 'gemini', name: 'Gemini Pro', description: 'Geavanceerde AI van Google' },
  { id: 'deepseek', name: 'DeepSeek Coder', description: 'Gespecialiseerd in code en technische analyses' },
];

export interface GrokSettings {
  selectedModel: ModelId;
  deepSearchEnabled: boolean;
  thinkEnabled: boolean;
  temperature?: number;
}

export const DEFAULT_SETTINGS: GrokSettings = {
  selectedModel: 'grok3',
  deepSearchEnabled: false,
  thinkEnabled: false,
  temperature: 0.7
};
