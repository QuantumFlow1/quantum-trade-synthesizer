
import { Card, CardContent } from '@/components/ui/card'
import { GrokChatHeader } from './GrokChatHeader'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { useGrokChat } from './useGrokChat'
import { useEffect, useState, useRef } from 'react'
import { toast } from '@/components/ui/use-toast'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GrokChatSettings } from './GrokChatSettings'
import { AI_MODELS } from './types/GrokSettings'
import { useNavigate } from 'react-router-dom'
import AdvancedLLMInterface from './advanced/AdvancedLLMInterface'

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

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Use the advanced interface instead of the standard chat interface
  const [useAdvancedInterface, setUseAdvancedInterface] = useState(false);
  
  // Settings default visible
  const [showSettings, setShowSettings] = useState(false);
  
  // Get the full name of the selected model
  const selectedModel = AI_MODELS.find(m => m.id === grokSettings.selectedModel);
  const selectedModelName = selectedModel?.name || 'AI';

  // Display an info message when component mounts
  useEffect(() => {
    toast({
      title: "Multi-Model AI Interface",
      description: `Chat with various AI models. The default model is ${selectedModelName}.`,
      duration: 5000,
    });
    
    // Log the current state of messages for debugging
    console.log('Initial messages in GrokChat:', messages);
  }, [selectedModelName]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    console.log('Messages updated in GrokChat component, new count:', messages.length);
  }, [messages]);

  const handleRetryConnection = async () => {
    await retryApiConnection();
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
    // Navigate back to main page
    navigate('/');
    
    // Show confirmation message
    toast({
      title: "Chat exited",
      description: "You've left the chat.",
      duration: 3000,
    });
  };

  // Properly handle the send message function
  const handleSendMessage = () => {
    console.log('handleSendMessage called with message:', inputMessage);
    if (inputMessage.trim()) {
      sendMessage();
    }
  };

  // Render the advanced interface if enabled
  if (useAdvancedInterface) {
    return <AdvancedLLMInterface />;
  }

  // Otherwise render the standard chat interface
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
        {/* API Status Alert */}
        {apiAvailable === false && grokSettings.selectedModel === 'grok3' && (
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
        
        {/* Settings Panel - show only if showSettings is true */}
        {showSettings && (
          <div className="mx-4 mt-4">
            <GrokChatSettings 
              settings={grokSettings}
              onSettingsChange={setGrokSettings}
            />
          </div>
        )}
        
        {/* Debug info - display message count */}
        <div className="mx-4 mt-2 text-xs text-gray-500">
          Messages in state: {messages.length}
        </div>
        
        {/* Chat Messages */}
        <div 
          ref={messagesContainerRef} 
          className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50 pt-3"
        >
          <ChatMessages messages={messages} />
        </div>
        
        {/* Chat Input */}
        <ChatInput 
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
