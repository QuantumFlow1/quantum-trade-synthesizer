
export type AIModelType = 'grok3' | 'openai' | 'claude' | 'gemini' | 'deepseek';

export interface GrokSettings {
  deepSearchEnabled: boolean;
  thinkEnabled: boolean;
  selectedModel: AIModelType;
}

export const defaultGrokSettings: GrokSettings = {
  deepSearchEnabled: true,
  thinkEnabled: true,
  selectedModel: 'grok3',
};

export const AI_MODELS = [
  { id: 'grok3', name: 'Grok 3' },
  { id: 'openai', name: 'OpenAI GPT-4o' },
  { id: 'claude', name: 'Anthropic Claude' },
  { id: 'gemini', name: 'Google Gemini' },
  { id: 'deepseek', name: 'DeepSeek AI' },
];
