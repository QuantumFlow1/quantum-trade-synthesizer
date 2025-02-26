
import { ModelId } from "../types/GrokSettings";

export interface HistoryItem {
  task: string;
  output: string;
}

export interface TaskAndModelSectionProps {
  task: string;
  setTask: (task: string) => void;
  selectedModel: ModelId;
  onModelChange: (model: string) => void;
}

export interface ParametersSectionProps {
  temperature: number;
  setTemperature: (temperature: number) => void;
  maxTokens: number;
  setMaxTokens: (maxTokens: number) => void;
  handleGenerate: () => void;
  isLoading: boolean;
}

export interface ContentGenerationSectionProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  messages: Array<{ role: string; content: string }>;
  selectedModelName: string;
  onSendMessage: () => void;
  isGenerating?: boolean;
}

export interface HistorySectionProps {
  history: HistoryItem[];
}
