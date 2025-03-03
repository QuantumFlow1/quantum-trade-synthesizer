
import { EdgeFunctionStatus } from '../../types/chatTypes';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UseDeepSeekChatReturn {
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  showSettings: boolean;
  edgeFunctionStatus: EdgeFunctionStatus;
  apiKey: string;
  lastChecked: Date | null;
  saveApiKey: (key: string) => void;
  setInputMessage: (message: string) => void;
  sendMessage: () => Promise<void>;
  clearChat: () => void;
  toggleSettings: () => void;
  setShowSettings: (show: boolean) => void;
  checkEdgeFunctionStatus: () => Promise<void>;
}
