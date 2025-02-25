
import { Card, CardContent } from '@/components/ui/card'
import { GrokChatHeader } from './GrokChatHeader'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { useGrokChat } from './useGrokChat'
import { useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function GrokChat() {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    sendMessage,
    clearChat,
    apiAvailable,
    retryApiConnection
  } = useGrokChat();

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

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg bg-white">
      <GrokChatHeader onClearChat={clearChat} />
      
      <CardContent className="p-0 flex flex-col h-[600px]">
        {/* API Status Alert */}
        {apiAvailable === false && (
          <Alert variant="destructive" className="m-4 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Status</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>De Grok API is momenteel niet beschikbaar. We gebruiken een alternatieve AI-service.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="self-end" 
                onClick={handleRetryConnection}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Controleren...
                  </>
                ) : (
                  'Verbinding opnieuw proberen'
                )}
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Chat Messages */}
        <div className={`flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50 ${apiAvailable === false ? 'pt-0' : ''}`}>
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
