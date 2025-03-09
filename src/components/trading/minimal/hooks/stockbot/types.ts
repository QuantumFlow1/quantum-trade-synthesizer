
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  role: 'user' | 'assistant';
  text: string;
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
  handleSendMessage: () => void;
  clearChat: () => void;
  showApiKeyDialog: () => void;
  isKeyDialogOpen: boolean;
  setIsKeyDialogOpen: (isOpen: boolean) => void;
  reloadApiKeys: () => void;
}
