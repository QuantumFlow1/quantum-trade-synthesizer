
import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useOllamaModels } from '@/hooks/useOllamaModels';
import { ollamaApi } from '@/utils/ollamaApiClient';
import { 
  Zap, 
  SendIcon, 
  Loader2, 
  Settings, 
  Trash2, 
  RefreshCw,
  Server
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

export function OllamaChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentModel, setCurrentModel] = useState<string>('llama3');
  
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    models,
    isLoading: isLoadingModels,
    isConnected,
    connectionError,
    ollamaHost,
    updateHost,
    refreshModels
  } = useOllamaModels();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !isConnected) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Format conversation for Ollama
      const formattedMessages = messages.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
      }));
      
      // Add new user message
      formattedMessages.push({
        role: 'user',
        content: userMessage.content
      });
      
      // Call Ollama API
      const responseContent = await ollamaApi.createChatCompletion(
        formattedMessages,
        currentModel,
        {
          temperature: 0.7,
          max_tokens: 2048
        }
      );
      
      // Add assistant response to chat
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error sending message to Ollama:', error);
      
      toast({
        title: "Ollama Error",
        description: error instanceof Error ? error.message : "Could not get a response from Ollama",
        variant: "destructive"
      });
      
      // Add error message to chat
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'system',
        content: `Error: ${error instanceof Error ? error.message : "Could not get a response from Ollama"}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat Cleared",
      description: "The conversation has been reset.",
      duration: 2000,
    });
  };

  const toggleSettings = () => {
    setShowSettings(prev => !prev);
  };

  return (
    <Card className="w-full h-[500px] flex flex-col shadow-lg">
      <CardHeader className="border-b py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center">
          <Zap className="h-5 w-5 mr-2 text-green-500" />
          Ollama Chat {isConnected && <span className="ml-2 text-xs text-gray-500">({models.length} models)</span>}
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
            disabled={messages.length === 0}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto p-4 flex flex-col gap-4">
        {showSettings ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ollama Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="ollama-host">Ollama Host</Label>
              <div className="flex gap-2">
                <Input
                  id="ollama-host"
                  value={ollamaHost}
                  onChange={(e) => updateHost(e.target.value)}
                  placeholder="http://localhost:11434"
                />
                <Button 
                  onClick={refreshModels}
                  disabled={isLoadingModels}
                  size="sm"
                >
                  {isLoadingModels ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">The URL where your Ollama server is running</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model-select">Model</Label>
              <Select
                value={currentModel}
                onValueChange={setCurrentModel}
                disabled={!isConnected || models.length === 0}
              >
                <SelectTrigger id="model-select">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.name} value={model.name}>
                      {model.name} ({model.details?.parameter_size || 'unknown'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {!isConnected && (
              <Alert variant="destructive">
                <AlertTitle>Connection Error</AlertTitle>
                <AlertDescription>
                  {connectionError || "Could not connect to Ollama. Make sure it's running and the host is correct."}
                </AlertDescription>
              </Alert>
            )}
            
            <Button onClick={() => setShowSettings(false)} className="w-full">
              Close Settings
            </Button>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-gray-500">
            <Server className="h-12 w-12 opacity-20" />
            <h3 className="text-lg font-medium">Local AI with Ollama</h3>
            <p className="max-w-md text-sm">
              Chat directly with your locally running Llama 3 models through Ollama. 
              No API keys or cloud services required.
            </p>
            {!isConnected && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Not Connected</AlertTitle>
                <AlertDescription>
                  {connectionError || "Could not connect to Ollama. Click the settings icon to configure."}
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : message.role === 'system'
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <div className="flex w-full gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isConnected ? "Type your message..." : "Connect to Ollama in settings first..."}
            className="flex-1 resize-none"
            disabled={isLoading || !isConnected}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!inputMessage.trim() || isLoading || !isConnected} 
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
