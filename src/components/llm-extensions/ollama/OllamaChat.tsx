import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Terminal, Settings, Trash2, Info } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ChatHeader } from '../components/ChatHeader';
import { useOllamaModels } from '@/hooks/useOllamaModels';
import { OllamaEmptyState } from './components/OllamaEmptyState';
import { OllamaSettings } from './components/OllamaSettings';
import { OllamaConnectionInfo } from './components/OllamaConnectionInfo';
import { OllamaNoModelsAlert } from './components/OllamaNoModelsAlert';
import { OllamaMessageDisplay } from './components/OllamaMessageDisplay';
import { OllamaChatInput } from './components/OllamaChatInput';

type OllamaMessage = {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export function OllamaChat() {
  const [messages, setMessages] = useState<OllamaMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showConnectionInfo, setShowConnectionInfo] = useState(false);

  const { 
    models, 
    isLoading: isLoadingModels, 
    isConnected, 
    connectionError,
    ollamaHost, 
    updateHost, 
    refreshModels 
  } = useOllamaModels();

  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    const savedMessages = localStorage.getItem('ollamaChatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ollamaChatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0].name);
    }
  }, [models, selectedModel]);

  const clearChat = () => {
    setMessages([]);
    toast({
      title: 'Chat Cleared',
      description: 'All messages have been removed.',
    });
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const toggleConnectionInfo = () => {
    setShowConnectionInfo(!showConnectionInfo);
  };

  const tryAlternativePort = (port: string) => {
    const baseUrl = ollamaHost.split(':').slice(0, -1).join(':');
    const newHost = `${baseUrl}:${port}`;
    updateHost(newHost);
    
    toast({
      title: 'Trying alternative port',
      description: `Attempting to connect to Ollama at ${newHost}`,
    });
    
    setTimeout(refreshModels, 500);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!isConnected) {
      toast({
        title: 'Ollama Not Connected',
        description: 'Please ensure Ollama is running and check your connection settings.',
        variant: 'destructive',
      });
      setShowSettings(true);
      return;
    }

    if (!selectedModel) {
      toast({
        title: 'No Model Selected',
        description: 'Please select an Ollama model first.',
        variant: 'destructive',
      });
      setShowSettings(true);
      return;
    }

    const userMessage: OllamaMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
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
          messages: messages.concat(userMessage).map(m => ({
            role: m.role,
            content: m.content
          })),
          stream: false,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error from Ollama API: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const assistantMessage: OllamaMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message?.content || 'No response from Ollama',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message to Ollama:', error);
      
      const assistantMessage: OllamaMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error connecting to Ollama: ${error.message}\n\nMake sure Ollama is running on your computer and properly configured.`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: 'Error',
        description: 'Failed to get a response from Ollama.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (models.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <OllamaEmptyState 
          isConnected={isConnected} 
          connectionError={connectionError}
          onSettingsClick={() => setShowSettings(true)} 
        />
        {showSettings && (
          <OllamaSettings 
            ollamaHost={ollamaHost}
            updateHost={updateHost}
            refreshModels={refreshModels}
            isLoadingModels={isLoadingModels}
            isConnected={isConnected}
            connectionError={connectionError}
            models={models}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            renderNoModelsAlert={() => (
              <OllamaNoModelsAlert 
                refreshModels={refreshModels}
              />
            )}
            renderConnectionInfo={() => (
              <OllamaConnectionInfo 
                ollamaHost={ollamaHost}
                tryAlternativePort={tryAlternativePort}
                isConnected={isConnected}
              />
            )}
            showConnectionInfo={showConnectionInfo}
          />
        )}
        {showConnectionInfo && (
          <OllamaConnectionInfo 
            ollamaHost={ollamaHost}
            tryAlternativePort={tryAlternativePort}
            isConnected={isConnected}
          />
        )}
      </div>
    );
  }

  const headerActions = (
    <>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={toggleConnectionInfo}
        title="Connection Info"
      >
        <Info className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={toggleSettings}
        title="Settings"
      >
        <Settings className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={clearChat}
        title="Clear chat"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );

  return (
    <Card className="w-full h-[500px] flex flex-col shadow-lg">
      <CardHeader className="border-b py-3 px-4 flex flex-row items-center justify-between">
        <ChatHeader 
          title="Ollama Chat"
          description="Chat with your local Ollama models"
          icon={<Terminal className="h-5 w-5 mr-2 text-teal-500" />}
          actions={headerActions}
        />
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto p-4 flex flex-col gap-4">
        {showSettings ? (
          <OllamaSettings 
            ollamaHost={ollamaHost}
            updateHost={updateHost}
            refreshModels={refreshModels}
            isLoadingModels={isLoadingModels}
            isConnected={isConnected}
            connectionError={connectionError}
            models={models}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            renderNoModelsAlert={() => (
              <OllamaNoModelsAlert 
                refreshModels={refreshModels}
              />
            )}
            renderConnectionInfo={() => (
              <OllamaConnectionInfo 
                ollamaHost={ollamaHost}
                tryAlternativePort={tryAlternativePort}
                isConnected={isConnected}
              />
            )}
            showConnectionInfo={showConnectionInfo}
          />
        ) : messages.length === 0 ? (
          <OllamaEmptyState 
            isConnected={isConnected}
            models={models}
            isLoadingModels={isLoadingModels}
            toggleSettings={toggleSettings}
            toggleConnectionInfo={toggleConnectionInfo}
          />
        ) : (
          <OllamaMessageDisplay 
            messages={messages}
            selectedModel={selectedModel}
          />
        )}
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <OllamaChatInput 
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={sendMessage}
          isLoading={isLoading}
          isConnected={isConnected}
          showSettings={showSettings}
          models={models}
        />
      </CardFooter>
    </Card>
  );
}
