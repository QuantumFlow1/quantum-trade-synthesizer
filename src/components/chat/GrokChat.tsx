
import { Card, CardContent } from '@/components/ui/card'
import { GrokChatHeader } from './GrokChatHeader'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { useGrokChat } from './useGrokChat'
import { useEffect, useState, useRef } from 'react'
import { toast } from '@/components/ui/use-toast'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Loader2, WifiOff, Server } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GrokChatSettings } from './GrokChatSettings'
import { AI_MODELS } from './types/GrokSettings'
import { useNavigate } from 'react-router-dom'
import AdvancedLLMInterface from './advanced/AdvancedLLMInterface'
import { isOfflineMode } from './services/utils/apiHelpers'
import { useOllamaDockerConnect } from '@/hooks/useOllamaDockerConnect'

export function GrokChat() {
  const navigate = useNavigate();
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    sendMessage,
    clearChat,
    apiAvailable,
    retryApiConnection,
    grokSettings,
    setGrokSettings
  } = useGrokChat();

  const { 
    connectionStatus: ollamaConnectionStatus,
    connectToDocker,
    isConnecting
  } = useOllamaDockerConnect();

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [useAdvancedInterface, setUseAdvancedInterface] = useState(false);
  
  const [showSettings, setShowSettings] = useState(false);
  
  const [isOffline, setIsOffline] = useState<boolean>(isOfflineMode());
  
  const selectedModel = AI_MODELS.find(m => m.id === grokSettings.selectedModel);
  const selectedModelName = selectedModel?.name || 'AI';
  
  const isOllamaModel = grokSettings.selectedModel.includes('ollama');

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast({
        title: "Online mode activated",
        description: "Your system is now connected to the internet.",
        duration: 3000,
      });
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: "Offline mode activated",
        description: "Your system is now in offline mode with limited functionality.",
        variant: "warning",
        duration: 4000,
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOllamaModel && (!ollamaConnectionStatus?.connected)) {
      connectToDocker('http://localhost:11434');
    }
  }, [isOllamaModel, ollamaConnectionStatus, connectToDocker]);

  useEffect(() => {
    toast({
      title: "Multi-Model AI Interface",
      description: `Chat with various AI models. The current model is ${selectedModelName}.`,
      duration: 5000,
    });
    
    console.log('Initial messages in GrokChat:', messages);
  }, [selectedModelName, messages]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    console.log('Messages updated in GrokChat component, new count:', messages.length);
  }, [messages]);

  const handleRetryConnection = async () => {
    if (isOllamaModel) {
      await connectToDocker('http://localhost:11434');
    } else {
      await retryApiConnection();
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  const toggleInterface = () => {
    setUseAdvancedInterface(!useAdvancedInterface);
    toast({
      title: `${useAdvancedInterface ? 'Standard' : 'Advanced'} interface activated`,
      description: `You are now using the ${useAdvancedInterface ? 'standard' : 'advanced'} AI interface.`,
      duration: 3000,
    });
  };
  
  const handleExit = () => {
    navigate('/');
    
    toast({
      title: "Chat exited",
      description: "You've left the chat.",
      duration: 3000,
    });
  };

  const handleSendMessage = () => {
    console.log('handleSendMessage called with message:', inputMessage);
    if (inputMessage.trim()) {
      sendMessage();
    }
  };

  const renderOllamaStatus = () => {
    if (!isOllamaModel) return null;
    
    if (isConnecting) {
      return (
        <Alert variant="default" className="m-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Connecting to Ollama</AlertTitle>
          <AlertDescription>
            Attempting to connect to your local Ollama instance...
          </AlertDescription>
        </Alert>
      );
    }
    
    if (!ollamaConnectionStatus?.connected) {
      return (
        <Alert variant="warning" className="m-4">
          <Server className="h-4 w-4" />
          <AlertTitle>Ollama Connection Required</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>Cannot connect to Ollama. Make sure Ollama is running on your machine.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="self-end hover:bg-yellow-100" 
              onClick={handleRetryConnection}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect to Ollama'
              )}
            </Button>
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };

  if (useAdvancedInterface) {
    return <AdvancedLLMInterface />;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg bg-white">
      <GrokChatHeader 
        onClearChat={clearChat} 
        onToggleSettings={toggleSettings}
        onExit={handleExit}
        modelName={selectedModelName}
        onToggleInterface={toggleInterface}
      />
      
      <CardContent className="p-0 flex flex-col h-[600px]">
        {isOffline && (
          <Alert variant="warning" className="m-4">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>Offline Mode Active</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>You are currently offline. Some features are limited, but you can still use your system with local data.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="self-end hover:bg-yellow-100" 
                onClick={() => window.location.reload()}
              >
                Try to reconnect
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {renderOllamaStatus()}
        
        {!isOllamaModel && apiAvailable === false && grokSettings.selectedModel === 'grok3' && !isOffline && (
          <Alert variant="warning" className="m-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>AI Service Status</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>The {selectedModelName} service is currently unavailable. This is a problem with the AI provider itself, not with your system or connection. We've automatically switched to a backup AI service to continue helping you without interruption.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="self-end hover:bg-yellow-100" 
                onClick={handleRetryConnection}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking connection...
                  </>
                ) : (
                  'Try to reconnect'
                )}
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {showSettings && (
          <div className="mx-4 mt-4">
            <GrokChatSettings 
              settings={grokSettings}
              onSettingsChange={setGrokSettings}
            />
          </div>
        )}
        
        <div className="mx-4 mt-2 text-xs text-gray-500">
          Messages in state: {messages.length} | {isOffline ? "Offline Mode" : "Online Mode"} | Model: {selectedModelName}
        </div>
        
        <div 
          ref={messagesContainerRef} 
          className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50 pt-3"
        >
          <ChatMessages messages={messages} />
        </div>
        
        <ChatInput 
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={handleSendMessage}
          isLoading={isLoading}
          isOffline={isOffline}
          disabled={isOllamaModel && !ollamaConnectionStatus?.connected}
        />
      </CardContent>
    </Card>
  );
}
