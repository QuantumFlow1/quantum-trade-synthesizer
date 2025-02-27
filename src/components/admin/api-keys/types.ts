
export type ApiKey = {
  id: string;
  key_type: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
};

export type ApiKeyFormData = {
  key_type: string;
  api_key: string;
  is_active: boolean;
};

export const API_KEY_TYPES = [
  { id: 'openai', name: 'OpenAI' },
  { id: 'claude', name: 'Claude' },
  { id: 'gemini', name: 'Gemini' },
  { id: 'deepseek', name: 'DeepSeek' }
];
