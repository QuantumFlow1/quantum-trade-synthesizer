
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, StockbotStatus } from './types';
import { loadStockbotChatHistory, saveStockbotChatHistory } from './storage';

export const useStockbotState = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [status, setStatus] = useState<StockbotStatus>('idle');
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  
  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = loadStockbotChatHistory();
    if (savedMessages) {
      setMessages(savedMessages);
    }
  }, []);
  
  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveStockbotChatHistory(messages);
    }
  }, [messages]);
  
  // Add a new message to the chat
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);
  
  // Add a user message to the chat
  const addUserMessage = useCallback((content: string) => {
    const message: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      role: 'user',
      text: content,
      content: content,
      timestamp: new Date()
    };
    addMessage(message);
    return message;
  }, [addMessage]);
  
  // Add an assistant message to the chat
  const addAssistantMessage = useCallback((content: string) => {
    const message: ChatMessage = {
      id: uuidv4(),
      sender: 'assistant',
      role: 'assistant',
      text: content,
      content: content,
      timestamp: new Date()
    };
    addMessage(message);
    return message;
  }, [addMessage]);
  
  // Clear all messages
  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('stockbot-messages');
  }, []);
  
  return {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    status,
    setStatus,
    isSimulationMode,
    setIsSimulationMode,
    addMessage,
    addUserMessage,
    addAssistantMessage,
    clearChat
  };
};

export default useStockbotState;
