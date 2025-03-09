
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from './types';
import { loadStockbotChatHistory, saveStockbotChatHistory } from './storage';

export const useStockbotState = () => {
  // Load chat history from localStorage on initial render
  const [messages, setMessages] = useState<ChatMessage[]>(loadStockbotChatHistory() || []);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    saveStockbotChatHistory(messages);
  }, [messages]);

  const addUserMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      role: 'user',
      text: content,
      content: content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    return userMessage;
  };

  const addAssistantMessage = (content: string) => {
    const assistantMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'assistant',
      role: 'assistant',
      text: content,
      content: content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    return assistantMessage;
  };

  const clearChat = () => {
    setMessages([]);
  };

  return {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isLoading,
    setIsLoading,
    addUserMessage,
    addAssistantMessage,
    clearChat
  };
};
