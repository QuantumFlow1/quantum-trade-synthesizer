
import { useGrokChatCore } from './hooks/useGrokChatCore';

export function useGrokChat(skipInitialization = false) {
  return useGrokChatCore(skipInitialization);
}

export type { ChatMessage } from './types/chat';
