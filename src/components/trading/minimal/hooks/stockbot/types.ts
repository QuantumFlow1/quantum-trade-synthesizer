
// Common types for the Stockbot module

export type StockbotMessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'system' | 'assistant';
  role: StockbotMessageRole;
  content: string;
  text: string;
  timestamp: Date;
}

export type StockbotMessage = ChatMessage;

// Type definition for the API key check function
export type CheckApiKeyFunction = () => Promise<boolean>;

// API response type that was missing
export interface StockbotApiResponse {
  success: boolean;
  response?: string;
  error?: string;
}

// Function calling types
export interface StockbotFunction {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface StockbotFunctionCall {
  name: string;
  arguments: string;
}

export interface StockbotFunctionResponse {
  role: 'function';
  name: string;
  content: string;
}

export interface StockbotToolCall {
  id: string;
  type: 'function';
  function: StockbotFunctionCall;
}

export interface ToolCallResponse {
  toolCalls?: StockbotToolCall[];
  content?: string;
}

// Type for the main Stockbot Chat hook
export interface StockbotChatHook {
  messages: StockbotMessage[];
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
  reloadApiKeys: () => Promise<void>;
  isCheckingAdminKey?: boolean;
}

// Type definition that extends the CheckApiKeyFunction
export type CheckGroqApiKeyFunction = CheckApiKeyFunction;
