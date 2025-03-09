
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface StockbotChatState {
  messages: ChatMessage[];
  inputMessage: string;
  isLoading: boolean;
  hasApiKey: boolean;
  isSimulationMode: boolean;
  isKeyDialogOpen: boolean;
}

export interface StockbotChatActions {
  setInputMessage: (message: string) => void;
  setIsSimulationMode: (isSimulation: boolean) => void;
  handleSendMessage: () => Promise<void>;
  clearChat: () => void;
  showApiKeyDialog: () => void;
  setIsKeyDialogOpen: (isOpen: boolean) => void;
}

export type StockbotChatHook = StockbotChatState & StockbotChatActions;
