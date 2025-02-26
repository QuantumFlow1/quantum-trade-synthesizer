
import { ModelId } from "../types/GrokSettings";

export interface AdvancedLLMHeaderProps {
  selectedModelName: string;
  onExit: () => void;
}

export interface TaskAndModelSectionProps {
  task: string;
  setTask: (task: string) => void;
  selectedModel: ModelId;
  onModelChange: (model: string) => void;
}

export interface ParametersSectionProps {
  temperature: number;
  setTemperature: (value: number) => void;
  maxTokens: number;
  setMaxTokens: (value: number) => void;
  handleGenerate: () => void;
  isLoading: boolean;
}

export interface ContentGenerationSectionProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  messages: Array<{role: string; content: string}>;
  selectedModelName: string;
  onSendMessage: () => void;
}

export interface HistorySectionProps {
  history: HistoryItem[];
}

export interface HistoryItem {
  task: string;
  output: string;
}
