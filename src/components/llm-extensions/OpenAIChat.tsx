
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { ChatHeader } from './components/ChatHeader';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { useOpenAIChat } from './hooks/useOpenAIChat';
import { Button } from '@/components/ui/button';
import { Settings, Trash2, Sparkles } from 'lucide-react';

export function OpenAIChat() {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    apiKey,
    setApiKey,
    showSettings,
    setShowSettings,
    saveApiKey,
    clearChat,
    sendMessage
  } = useOpenAIChat();

  // Create header actions separately as React elements
  const headerActions = (
    <>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => setShowSettings(!showSettings)}
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
          title="OpenAI Chat"
          description="Chat with OpenAI models"
          icon={<Sparkles className="h-5 w-5 mr-2 text-orange-500" />}
          actions={headerActions}
        />
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto p-4 flex flex-col gap-4">
        <MessageList 
          messages={messages}
          showSettings={showSettings}
          apiKey={apiKey}
          setApiKey={setApiKey}
          saveApiKey={saveApiKey}
        />
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <ChatInput 
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={sendMessage}
          isLoading={isLoading}
        />
      </CardFooter>
    </Card>
  );
}
