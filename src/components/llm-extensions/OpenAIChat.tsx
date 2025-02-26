
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { ChatHeader } from './components/ChatHeader';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { useOpenAIChat } from './hooks/useOpenAIChat';

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

  return (
    <Card className="w-full h-[500px] flex flex-col shadow-lg">
      <CardHeader className="border-b py-3 px-4 flex flex-row items-center justify-between">
        <ChatHeader 
          setShowSettings={setShowSettings}
          showSettings={showSettings}
          clearChat={clearChat}
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
