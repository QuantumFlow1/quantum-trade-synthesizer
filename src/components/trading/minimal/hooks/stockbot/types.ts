
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  role: 'user' | 'assistant';
  text: string;
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export enum StockbotMessageRole {
  User = 'user',
  Bot = 'assistant'
}

export interface StockbotMessage {
  role: StockbotMessageRole;
  content: string;
}

export interface StockbotChatHook {
  messages: ChatMessage[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  isLoading: boolean;
  hasApiKey: boolean;
  isSimulationMode: boolean;
  setIsSimulationMode: (mode: boolean) => void;
  handleSendMessage: () => Promise<void>;
  clearChat: () => void;
  showApiKeyDialog: () => void;
  isKeyDialogOpen: boolean;
  setIsKeyDialogOpen: (open: boolean) => void;
  reloadApiKeys: () => void;
}

export interface StockbotApiResponse {
  success: boolean;
  response?: string;
  error?: string;
}

export type CheckApiKeyFunction = () => Promise<boolean>;
