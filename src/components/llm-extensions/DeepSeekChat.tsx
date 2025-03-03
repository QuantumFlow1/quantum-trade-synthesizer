
import { useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, SendIcon, Loader2, Settings, Trash2, AlertTriangle, RefreshCw, Key } from 'lucide-react';
import { DeepSeekMessage } from './deepseek/DeepSeekMessage';
import { DeepSeekSettings } from './deepseek/DeepSeekSettings';
import { DeepSeekEmptyState } from './deepseek/DeepSeekEmptyState';
import { useDeepSeekChat } from './deepseek/hooks/useDeepSeekChat';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function DeepSeekChat() {
  const {
    messages,
    inputMessage,
    isLoading,
    showSettings,
    edgeFunctionStatus,
    apiKey,
    saveApiKey,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings,
    checkEdgeFunctionStatus
  } = useDeepSeekChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Check if we have an API key
  const hasApiKey = !!apiKey;

  return (
    <Card className="w-full h-[500px] flex flex-col shadow-lg">
      <CardHeader className="border-b py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center">
          <Bot className="h-5 w-5 mr-2 text-blue-500" />
          DeepSeek Chat
          {hasApiKey && (
            <div className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
              <Key className="h-3 w-3 mr-1" />
              API Key Set
            </div>
          )}
        </CardTitle>
        <div className="flex gap-2">
          {edgeFunctionStatus === 'unavailable' && (
            <Button
              variant="outline"
              size="sm"
              onClick={checkEdgeFunctionStatus}
              title="Retry connection"
              className="text-yellow-600"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
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
        {!hasApiKey && edgeFunctionStatus !== 'unavailable' && (
          <Alert className="mb-2">
            <Key className="h-4 w-4" />
            <AlertTitle>API Key Required</AlertTitle>
            <AlertDescription>
              You need to set a DeepSeek API key to use this chat. Click the settings icon to add your API key.
            </AlertDescription>
          </Alert>
        )}
        
        {edgeFunctionStatus === 'unavailable' && (
          <Alert variant="destructive" className="mb-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Service Unavailable</AlertTitle>
            <AlertDescription>
              The DeepSeek API service is currently unavailable. This might be due to a temporary issue or a deployment error. 
              Please try again later or use a different AI model.
            </AlertDescription>
          </Alert>
        )}
        
        {showSettings ? (
          <DeepSeekSettings 
            apiKey={apiKey} 
            setApiKey={saveApiKey}
            onClose={() => setShowSettings(false)} 
          />
        ) : messages.length === 0 ? (
          <DeepSeekEmptyState edgeFunctionStatus={edgeFunctionStatus} />
        ) : (
          messages.map((message) => (
            <DeepSeekMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <div className="flex w-full gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={!hasApiKey ? "Please set API key in settings" : 
                        edgeFunctionStatus === 'unavailable' ? "DeepSeek service unavailable" : 
                        "Type your message..."}
            className="flex-1 resize-none"
            disabled={isLoading || edgeFunctionStatus === 'unavailable' || !hasApiKey}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!inputMessage.trim() || isLoading || edgeFunctionStatus === 'unavailable' || !hasApiKey} 
            className="h-full"
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
