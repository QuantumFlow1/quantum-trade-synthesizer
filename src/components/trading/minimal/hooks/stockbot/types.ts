
import { ReactNode } from "react";

export interface StockbotMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string | ReactNode;
  timestamp: number;
}

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
