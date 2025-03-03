
import { EdgeFunctionStatus } from '../../types/chatTypes';

export interface DeepSeekChatState {
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  showSettings: boolean;
  apiKey: string;
  edgeFunctionStatus: EdgeFunctionStatus;
}

export interface DeepSeekChatActions {
  saveApiKey: (key: string) => void;
  setInputMessage: (message: string) => void;
  sendMessage: () => Promise<void>;
  clearChat: () => void;
  toggleSettings: () => void;
  setShowSettings: (show: boolean) => void;
  checkEdgeFunctionStatus: () => Promise<void>;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UseDeepSeekChatReturn extends DeepSeekChatState, DeepSeekChatActions {}
