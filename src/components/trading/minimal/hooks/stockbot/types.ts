
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  role: 'user' | 'assistant' | 'system';
  content: string;
  text: string;
  timestamp: Date;
}

export interface StockbotMessage extends ChatMessage {
  // Additional properties specific to Stockbot messages can be added here
}

export interface StockbotToolCall {
  name: string;
  arguments: any;
}

export type CheckApiKeyFunction = () => Promise<boolean>;

export interface StockbotChatHook {
  messages: StockbotMessage[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  isLoading: boolean;
  hasApiKey: boolean;
  handleSendMessage: () => Promise<void>;
  clearChat: () => void;
  showApiKeyDialog: () => void;
  isKeyDialogOpen: boolean;
  setIsKeyDialogOpen: (open: boolean) => void;
  reloadApiKeys: () => Promise<void>;
  isCheckingAdminKey: boolean;
}
