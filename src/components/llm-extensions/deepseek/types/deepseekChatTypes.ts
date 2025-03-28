
import { EdgeFunctionStatus, Message } from '../../types/chatTypes';

export interface UseDeepSeekChatReturn {
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  showSettings: boolean;
  edgeFunctionStatus: EdgeFunctionStatus;
  apiKey: string;
  lastChecked: Date | null;
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error';
  saveApiKey: (key: string) => void;
  setInputMessage: (message: string) => void;
  sendMessage: () => Promise<void>;
  clearChat: () => void;
  toggleSettings: () => void;
  setShowSettings: (show: boolean) => void;
  checkEdgeFunctionStatus: () => Promise<void>;
  retryConnection: () => Promise<void>;
}
