
import { Card, CardContent } from '@/components/ui/card'
import { GrokChatHeader } from './GrokChatHeader'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { useGrokChat } from './useGrokChat'
import { useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'

export function GrokChat() {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    sendMessage,
    clearChat
  } = useGrokChat();

  // Display an info message when component mounts
  useEffect(() => {
    toast({
      title: "Voice Assistant Disabled",
      description: "Voice control has been temporarily disabled for troubleshooting purposes.",
      duration: 5000,
    });
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg bg-white">
      <GrokChatHeader onClearChat={clearChat} />
      
      <CardContent className="p-0 flex flex-col h-[600px]">
        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50">
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
