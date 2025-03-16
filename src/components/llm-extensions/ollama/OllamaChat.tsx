
import React, { useEffect, useState, useRef } from 'react';
import { MessageSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OllamaSettings } from './components/OllamaSettings';
import { OllamaMessageDisplay } from './components/OllamaMessageDisplay';
import { OllamaChatInput } from './components/OllamaChatInput';
import { OllamaEmptyState } from './components/OllamaEmptyState';
import { OllamaNoModelsAlert } from './components/OllamaNoModelsAlert';
import { OllamaConnectionInfo } from './components/OllamaConnectionInfo';
import { useOllamaModels } from '@/hooks/useOllamaModels';

export interface OllamaMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

export function OllamaChat() {
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
  } = useOllamaModels(ollamaHost);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

  const renderConnectionInfo = () => (
    <OllamaConnectionInfo 
      isConnected={isConnected}
      host={ollamaHost}
      selectedModel={selectedModel}
      modelsAvailable={models.length}
    />
  );

  const renderNoModelsAlert = () => {
    if (isConnected && models.length === 0) {
      return <OllamaNoModelsAlert refreshModels={() => refreshModels()} />;
    }
    return null;
  };

  // Render empty state if not connected or no models
  if (!isConnected || (isConnected && models.length === 0 && !showSettings)) {
    return (
      <div className="h-[500px] overflow-hidden">
        <OllamaEmptyState 
          isConnected={isConnected}
          connectionError={connectionError}
          models={models}
          isLoadingModels={isLoadingModels}
          toggleSettings={toggleSettings}
          toggleConnectionInfo={toggleConnectionInfo}
        />
      </div>
    );
  }

  return (
    <div className="h-[500px] flex flex-col">
      <div className="flex justify-between items-center p-3 border-b">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-gray-600" />
          <h3 className="font-medium">
            {selectedModel ? `Model: ${selectedModel}` : 'Ollama Chat'}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSettings}
          className="h-8 w-8 p-0"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-grow overflow-auto p-4">
        {showSettings ? (
          <OllamaSettings
            ollamaHost={ollamaHost}
            updateHost={updateHost}
            refreshModels={() => refreshModels()}
            isLoadingModels={isLoadingModels}
            isConnected={isConnected}
            connectionError={connectionError}
            models={models}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            renderNoModelsAlert={renderNoModelsAlert}
            renderConnectionInfo={renderConnectionInfo}
            showConnectionInfo={showConnectionInfo}
          />
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <OllamaMessageDisplay key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Start chatting with {selectedModel}</p>
              <Button variant="outline" size="sm" onClick={toggleSettings}>
                Change Settings
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t mt-auto">
        <OllamaChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={sendMessage}
          isLoading={isLoading}
          isConnected={isConnected}
          showSettings={showSettings}
          models={models}
        />
      </div>
    </div>
  );
}
