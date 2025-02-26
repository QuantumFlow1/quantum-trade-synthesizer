
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
import { GrokSettings, defaultGrokSettings } from './types/GrokSettings'

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

  const [showSettings, setShowSettings] = useState(false);

  // Display an info message when component mounts
  useEffect(() => {
    toast({
      title: "Voice Assistant Disabled",
      description: "Voice control has been temporarily disabled for troubleshooting purposes.",
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
      <GrokChatHeader onClearChat={clearChat} onToggleSettings={toggleSettings} />
      
      <CardContent className="p-0 flex flex-col h-[600px]">
        {/* API Status Alert */}
        {apiAvailable === false && (
          <Alert variant="warning" className="m-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>AI Service Status</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>De Grok AI-service is momenteel niet beschikbaar. Dit is een probleem aan de kant van Grok zelf, niet met uw systeem of verbinding. We hebben automatisch overgeschakeld naar onze reserve AI-service om u zonder onderbreking te blijven helpen.</p>
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
        
        {/* Settings Panel */}
        {showSettings && (
          <div className="m-4 mb-0">
            <GrokChatSettings 
              settings={grokSettings}
              onSettingsChange={setGrokSettings}
            />
          </div>
        )}
        
        {/* Chat Messages */}
        <div className={`flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50 ${apiAvailable === false || showSettings ? 'pt-0' : ''}`}>
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
