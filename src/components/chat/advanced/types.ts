
import { ModelId } from "../types/GrokSettings";

export interface HistoryItem {
  task: string;
  output: string;
}

export interface AdvancedLLMProps {
  selectedModel: ModelId;
  onModelChange: (model: string) => void;
  temperature: number;
  setTemperature: (value: number) => void;
  maxTokens: number;
  setMaxTokens: (value: number) => void;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleGenerate: () => void;
  isLoading: boolean;
  messages: Array<{role: string; content: string}>;
  task: string;
  setTask: (task: string) => void;
  history: HistoryItem[];
  onExit: () => void;
}

export interface TaskAndModelSectionProps {
  task: string;
  setTask: (task: string) => void;
  selectedModel: string;
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
}

export interface HistorySectionProps {
  history: HistoryItem[];
}

export interface AdvancedLLMHeaderProps {
  selectedModelName: string;
  onExit: () => void;
}
