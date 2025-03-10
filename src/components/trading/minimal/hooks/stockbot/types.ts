
import { ReactNode } from "react";

export interface StockbotMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string | ReactNode;
  timestamp: number;
}

// ChatMessage interface used across multiple files
export interface ChatMessage {
  id: string;
  sender?: 'user' | 'assistant' | 'system';
  role: 'user' | 'assistant' | 'system';
  content: string | ReactNode;
  text?: string;
  timestamp: Date | number;
}

export type StockbotMessageRole = "user" | "assistant" | "system";

export interface StockbotApiResponse {
  success: boolean;
  response?: string;
  error?: string;
}

export type CheckApiKeyFunction = () => Promise<boolean>;

export interface StockbotChatHook {
  messages: StockbotMessage[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  isLoading: boolean;
  hasApiKey: boolean;
  isSimulationMode: boolean;
  setIsSimulationMode: (mode: boolean) => void;
  handleSendMessage: () => void;
  clearChat: () => void;
  showApiKeyDialog: () => void;
  isKeyDialogOpen: boolean;
  setIsKeyDialogOpen: (isOpen: boolean) => void;
  reloadApiKeys: () => Promise<void>;
  isCheckingAdminKey?: boolean;
}
