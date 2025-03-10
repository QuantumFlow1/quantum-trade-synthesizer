
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CryptoMessage } from '../../types';
import { toast } from '@/components/ui/use-toast';

export function useMessagesState() {
  const [messages, setMessages] = useState<CryptoMessage[]>([
    {
      id: uuidv4(),
      role: 'assistant',
      content: 'Hello! I can help you analyze cryptocurrency markets, provide price information, and suggest trading strategies. What would you like to know about crypto today?',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  
  const addMessage = (message: CryptoMessage) => {
    setMessages(prev => [...prev, message]);
  };
  
  const resetChat = () => {
    setMessages([
      {
        id: uuidv4(),
        role: 'assistant',
        content: 'Hello! I can help you analyze cryptocurrency markets, provide price information, and suggest trading strategies. What would you like to know about crypto today?',
        timestamp: new Date()
      }
    ]);
    
    toast({
      title: 'Chat Reset',
      description: 'Chat history has been cleared.',
      duration: 2000,
    });
  };
  
  return {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    addMessage,
    resetChat
  };
}
