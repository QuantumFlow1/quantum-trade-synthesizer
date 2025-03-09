
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  role?: 'user' | 'assistant'; // Added for compatibility with components
  content?: string; // Added for compatibility with components
}

export type StockbotStatus = 'idle' | 'thinking' | 'checking' | 'error';

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
