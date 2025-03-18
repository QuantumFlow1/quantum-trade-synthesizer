
export interface StockbotMessage {
  id: string;
  role: "user" | "assistant" | "system";
  sender: "user" | "assistant" | "system";
  content: string;
  text: string;
  timestamp: Date;
  model?: string;
}

export type ChatMessage = StockbotMessage;

export type StockbotModel = {
  id: string;
  name: string;
  providerName: string;
};

export interface CheckApiKeyFunction {
  (): Promise<boolean>;
}

export interface StockbotChatHook {
  messages: StockbotMessage[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  isLoading: boolean;
  hasApiKey: boolean;
  handleSendMessage: () => void;
  clearChat: () => void;
  showApiKeyDialog: () => void;
  isKeyDialogOpen: boolean;
  setIsKeyDialogOpen: (isOpen: boolean) => void;
  reloadApiKeys: () => Promise<void>;
  isCheckingAdminKey: boolean;
}

export interface StockbotApiResponse {
  success: boolean;
  response?: string;
  error?: string;
  tool_calls?: StockbotToolCall[];
}

export interface StockbotToolCall {
  id?: string;
  type?: string;
  function?: {
    name: string;
    arguments: string;
  };
  name?: string;
  arguments?: any;
}
