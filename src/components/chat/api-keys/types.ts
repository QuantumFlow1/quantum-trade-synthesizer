
import { ApiKeySettings, ModelInfo } from '../types/GrokSettings';

export type ApiKeyFormData = {
  openaiKey: string;
  claudeKey: string;
  geminiKey: string;
  deepseekKey: string;
};

export interface ApiKeyManagerProps {
  selectedModel: ModelInfo | undefined;
  apiKeys: ApiKeySettings;
  onApiKeysChange: (apiKeys: ApiKeySettings) => void;
}
