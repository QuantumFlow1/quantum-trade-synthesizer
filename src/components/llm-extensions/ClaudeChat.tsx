
import { useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, SendIcon, Loader2, Settings, Trash2, AlertCircle } from 'lucide-react';
import { useClaudeChat } from './claude/useClaudeChat';
import { ClaudeMessage } from './claude/ClaudeMessage';
import { ClaudeSettings } from './claude/ClaudeSettings';
import { ClaudeEmptyState } from './claude/ClaudeEmptyState';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ClaudeChat() {
  const {
    messages,
    inputMessage,
    isLoading,
    showSettings,
    apiKey,
    isActive,
    saveApiKey,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings
  } = useClaudeChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug logging for messages
  useEffect(() => {
    console.log('Claude chat current messages:', messages);
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="w-full h-[500px] flex flex-col shadow-lg">
      <CardHeader className="border-b py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center">
          <MessageSquare className={`h-5 w-5 mr-2 ${isActive ? 'text-green-500' : 'text-gray-400'}`} />
          Claude Chat {!isActive && <span className="ml-2 text-xs text-gray-400">(inactive)</span>}
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
      
      <CardContent className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 relative">
        {!isActive && (
          <Alert variant="warning" className="mb-2 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription>
              Claude is currently inactive. Select the Claude tab in the AI extensions to activate it.
            </AlertDescription>
          </Alert>
        )}
      
        {showSettings ? (
          <ClaudeSettings 
            apiKey={apiKey} 
            setApiKey={saveApiKey}
            onClose={() => setShowSettings(false)} 
          />
        ) : messages.length === 0 ? (
          <ClaudeEmptyState />
        ) : (
          <>
            {messages.map((message) => (
              <ClaudeMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center items-center py-2">
                <Loader2 className="h-6 w-6 animate-spin text-green-500" />
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <div className="flex w-full gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isActive ? "Type your message..." : "Activate Claude to send messages"}
            className="flex-1 resize-none"
            disabled={isLoading || !isActive}
            onKeyDown={handleKeyDown}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!inputMessage.trim() || isLoading || !isActive} 
            className="h-full bg-green-600 hover:bg-green-700"
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
