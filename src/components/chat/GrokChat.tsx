
import { Card, CardContent } from '@/components/ui/card'
import { GrokChatHeader } from './GrokChatHeader'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { useGrokChat } from './useGrokChat'
import { useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Loader2, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GrokChatSettings } from './GrokChatSettings'
import { AI_MODELS } from './types/GrokSettings'

export function GrokChat() {
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

  // Instellingen standaard zichtbaar maken
  const [showSettings, setShowSettings] = useState(true);
  const selectedModelName = AI_MODELS.find(m => m.id === grokSettings.selectedModel)?.name || 'AI';

  // Display an info message when component mounts
  useEffect(() => {
    toast({
      title: "Multi-Model AI Chat",
      description: `Chat met verschillende AI modellen. Standaard model is ${selectedModelName}.`,
      duration: 5000,
    });
  }, []);

  const handleRetryConnection = async () => {
    await retryApiConnection();
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg bg-white">
      <GrokChatHeader 
        onClearChat={clearChat} 
        onToggleSettings={toggleSettings}
        modelName={selectedModelName} 
      />
      
      <CardContent className="p-0 flex flex-col h-[600px]">
        {/* API Status Alert */}
        {apiAvailable === false && grokSettings.selectedModel === 'grok3' && (
          <Alert variant="warning" className="m-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>AI Service Status</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>De {selectedModelName} service is momenteel niet beschikbaar. Dit is een probleem aan de kant van de AI provider zelf, niet met uw systeem of verbinding. We hebben automatisch overgeschakeld naar een reserve AI-service om u zonder onderbreking te blijven helpen.</p>
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
                    Verbinding controleren...
                  </>
                ) : (
                  'Probeer opnieuw te verbinden'
                )}
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Settings Panel - altijd zichtbaar */}
        <div className="mx-4 mt-4">
          <GrokChatSettings 
            settings={grokSettings}
            onSettingsChange={setGrokSettings}
          />
        </div>
        
        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50 pt-3">
          <ChatMessages messages={messages} />
        </div>
        
        {/* Chat Input */}
        <ChatInput 
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={sendMessage}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  )
}
