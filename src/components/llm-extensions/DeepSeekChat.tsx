
import { useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, SendIcon, Loader2, Settings, Trash2, AlertTriangle, RefreshCw, Key, Check, XCircle } from 'lucide-react';
import { DeepSeekMessage } from './deepseek/DeepSeekMessage';
import { DeepSeekSettings } from './deepseek/DeepSeekSettings';
import { DeepSeekEmptyState } from './deepseek/DeepSeekEmptyState';
import { useDeepSeekChat } from './deepseek/hooks/useDeepSeekChat';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

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
    checkEdgeFunctionStatus,
    lastChecked
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
  
  // Format last checked time
  const formattedLastChecked = lastChecked ? 
    new Intl.DateTimeFormat('default', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    }).format(lastChecked) : null;

  return (
    <Card className="w-full h-[500px] flex flex-col shadow-lg">
      <CardHeader className="border-b py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center">
          <Bot className="h-5 w-5 mr-2 text-blue-500" />
          DeepSeek Chat
          {hasApiKey && (
            <Badge variant={edgeFunctionStatus === 'available' ? 'default' : 'outline'} className="ml-2">
              {edgeFunctionStatus === 'available' ? (
                <Check className="h-3 w-3 mr-1 text-green-500" />
              ) : edgeFunctionStatus === 'checking' ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <XCircle className="h-3 w-3 mr-1 text-red-500" />
              )}
              {edgeFunctionStatus === 'available' ? 'Connected' : 
                edgeFunctionStatus === 'checking' ? 'Checking...' : 'Disconnected'}
            </Badge>
          )}
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={checkEdgeFunctionStatus}
            title="Check connection"
            className={edgeFunctionStatus === 'available' ? 'text-green-600' : 'text-yellow-600'}
          >
            {edgeFunctionStatus === 'checking' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
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
        
        {edgeFunctionStatus === 'unavailable' && hasApiKey && (
          <Alert variant="destructive" className="mb-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Failed</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                Unable to connect to the DeepSeek API. Please check your API key and try again.
                {formattedLastChecked && <span className="block text-xs opacity-70">Last checked: {formattedLastChecked}</span>}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkEdgeFunctionStatus}
                className="mt-2"
              >
                Retry Connection
              </Button>
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
