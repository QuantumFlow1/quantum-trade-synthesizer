
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface StockbotChatHook {
  messages: ChatMessage[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  isLoading: boolean;
  hasApiKey: boolean;
  isSimulationMode: boolean;
  setIsSimulationMode: (isSimulationMode: boolean) => void;
  handleSendMessage: () => Promise<void>;
  clearChat: () => void;
  showApiKeyDialog: () => void;
  isKeyDialogOpen: boolean;
  setIsKeyDialogOpen: (isOpen: boolean) => void;
}

export interface StockbotApiHook {
  handleSendMessage: (inputMessage: string, isSimulationMode: boolean) => Promise<void>;
}
