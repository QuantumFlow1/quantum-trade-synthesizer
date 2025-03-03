
import { useState } from 'react';
import { Message } from '../../types/chatTypes';

// Add loading property to Message type for temporary messages
export interface LoadingMessage extends Message {
  isLoading?: boolean;
}

export function useDeepSeekState() {
  const [messages, setMessages] = useState<LoadingMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [edgeFunctionStatus, setEdgeFunctionStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  
  return {
    messages,
    setMessages,
    isProcessing,
    setIsProcessing,
    edgeFunctionStatus,
    setEdgeFunctionStatus,
    lastChecked,
    setLastChecked
  };
}
