
import { useState, useEffect } from 'react';
import { OllamaMessage, OllamaModel } from '../types/ollamaTypes';
import { useOllamaModels } from '@/hooks/useOllamaModels';

export function useOllamaChat() {
  // Model and connection state
  const [ollamaHost, setOllamaHost] = useState<string>('http://localhost:11434');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<OllamaMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showConnectionInfo, setShowConnectionInfo] = useState<boolean>(false);
  
  // Get models from hook
  const { 
    models, 
    isLoading: isLoadingModels, 
    isConnected, 
    connectionError, 
    refreshModels
  } = useOllamaModels();
  
  // Set default model when models are loaded
  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0].name);
    }
  }, [models, selectedModel]);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('ollamaMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Error parsing saved messages:', e);
      }
    }
    
    const savedHost = localStorage.getItem('ollamaHost');
    if (savedHost) {
      setOllamaHost(savedHost);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ollamaMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const updateHost = (host: string) => {
    setOllamaHost(host);
    localStorage.setItem('ollamaHost', host);
  };
  
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('ollamaMessages');
  };
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  const toggleConnectionInfo = () => {
    setShowConnectionInfo(!showConnectionInfo);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedModel || !isConnected) return;

    const userMessage: OllamaMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${ollamaHost}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
            { role: 'user', content: inputMessage },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: OllamaMessage = {
        id: (Date.now() + 1).toString(),
        content: data.message.content,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message to Ollama:', error);
      
      const errorMessage: OllamaMessage = {
        id: (Date.now() + 1).toString(),
        content: `Error: Could not get a response from Ollama. Make sure the server is running and the model is available.\n\nDetails: ${error instanceof Error ? error.message : String(error)}`,
        role: 'system',
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ollamaHost,
    selectedModel,
    inputMessage,
    messages,
    isLoading,
    showSettings,
    showConnectionInfo,
    models,
    isLoadingModels,
    isConnected,
    connectionError,
    updateHost,
    setSelectedModel,
    setInputMessage,
    clearChat,
    toggleSettings,
    toggleConnectionInfo,
    sendMessage,
    refreshModels
  };
}
