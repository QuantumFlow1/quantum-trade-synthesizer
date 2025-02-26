
import { useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Zap, SendIcon, Loader2, Settings, Trash2 } from 'lucide-react';
import { useGrokChat } from './grok/useGrokChat';
import { GrokMessage } from './grok/GrokMessage';
import { GrokSettings } from './grok/GrokSettings';
import { GrokEmptyState } from './grok/GrokEmptyState';

export function GrokChat() {
  const {
    messages,
    inputMessage,
    isLoading,
    showSettings,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings
  } = useGrokChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Card className="w-full h-[500px] flex flex-col shadow-lg">
      <CardHeader className="border-b py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center">
          <Zap className="h-5 w-5 mr-2 text-purple-500" />
          Grok Chat
        </CardTitle>
        <div className="flex gap-2">
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
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto p-4 flex flex-col gap-4">
        {showSettings ? (
          <GrokSettings onClose={() => setShowSettings(false)} />
        ) : messages.length === 0 ? (
          <GrokEmptyState />
        ) : (
          messages.map((message) => (
            <GrokMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <div className="flex w-full gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 resize-none"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!inputMessage.trim() || isLoading} 
            className="h-full bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
