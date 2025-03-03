
import { useState, useEffect } from 'react';
import { Message } from '../types/deepseekChatTypes';
import { 
  loadMessagesFromStorage,
  saveMessagesToStorage,
  loadApiKeyFromStorage,
  saveApiKeyToStorage
} from '../utils/deepseekChatUtils';

export function useDeepSeekState() {
  const [messages, setMessages] = useState<Message[]>(() => loadMessagesFromStorage());
  const [inputMessage, setInputMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => loadApiKeyFromStorage());

  // Save messages to localStorage whenever they change
  useEffect(() => {
    saveMessagesToStorage(messages);
  }, [messages]);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    saveApiKeyToStorage(key);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('deepseekChatMessages');
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    showSettings,
    setShowSettings,
    apiKey,
    saveApiKey,
    clearChat,
    toggleSettings,
  };
}
