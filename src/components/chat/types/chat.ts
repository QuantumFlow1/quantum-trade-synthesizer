
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  inputMessage: string;
  isLoading: boolean;
  apiAvailable: boolean | null;
}
