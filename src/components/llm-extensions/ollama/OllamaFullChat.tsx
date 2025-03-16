
import React, { useState, useEffect, useRef } from 'react';
import { OllamaMessageList } from './components/OllamaMessageList';
import { OllamaChatInput } from './components/OllamaChatInput';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Settings, 
  RefreshCw, 
  Trash2, 
  Bot, 
  Loader2,
  Server
} from 'lucide-react';
import { useOllamaChat } from './hooks/useOllamaChat';
import { OllamaConnectionForm } from '@/components/admin/models/ollama/OllamaConnectionForm';
import { OllamaConnectionStatus } from '@/components/admin/models/ollama/OllamaConnectionStatus';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { ollamaApi } from '@/utils/ollamaApiClient';

export function OllamaFullChat() {
  const {
    ollamaHost,
    selectedModel,
    inputMessage,
    messages,
    isLoading,
    showSettings,
    models,
    isLoadingModels,
    isConnected,
    connectionError,
    updateHost,
    setSelectedModel,
    setInputMessage,
    clearChat,
    toggleSettings,
    sendMessage,
    refreshModels
  } = useOllamaChat();
  
  const [activeTab, setActiveTab] = useState<string>("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [dockerAddress, setDockerAddress] = useState('http://localhost:11434');
  const [customAddress, setCustomAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [useServerSideProxy, setUseServerSideProxy] = useState(false);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);
  const [currentOrigin, setCurrentOrigin] = useState('');
  const [isLocalhost, setIsLocalhost] = useState(false);
  
  // Check if running on localhost
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentOrigin(window.location.origin);
      setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const connectToDocker = async (address: string) => {
    setIsConnecting(true);
    try {
      updateHost(address);
      await refreshModels();
      setActiveTab("chat");
      toast({
        title: "Connection successful",
        description: `Connected to Ollama at ${address}`,
      });
    } catch (error) {
      console.error('Error connecting to Ollama:', error);
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect to Ollama",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="h-[600px] flex flex-col">
      <div className="flex p-3 border-b bg-muted/30">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="chat" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              {isConnected && models.length > 0 && (
                <>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="w-[180px] h-8">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.name} value={model.name}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearChat}
                    className="h-8"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </>
              )}
              
              {isConnected && (
                <Badge 
                  variant="success" 
                  className="flex items-center gap-1"
                >
                  <Server className="h-3 w-3" />
                  Connected
                </Badge>
              )}
            </div>
          </div>
        </Tabs>
      </div>

      <div className="flex-grow overflow-auto">
        <TabsContent value="chat" className="p-4 m-0 h-full overflow-auto">
          {isConnected && models.length > 0 ? (
            <OllamaMessageList 
              messages={messages} 
              selectedModel={selectedModel} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="h-12 w-12 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Connect to Ollama</h3>
              <p className="text-muted-foreground max-w-md mb-4">
                {isConnected ? 
                  "No models found. Install models in Ollama to start chatting." :
                  "Connect to your local Ollama instance to start chatting."}
              </p>
              <Button
                onClick={() => setActiveTab("settings")}
                variant="outline"
              >
                <Settings className="h-4 w-4 mr-2" />
                Go to Settings
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="m-0 p-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Connection Settings</h3>
              <OllamaConnectionForm
                dockerAddress={dockerAddress}
                setDockerAddress={setDockerAddress}
                customAddress={customAddress}
                setCustomAddress={setCustomAddress}
                isConnecting={isConnecting}
                connectToDocker={connectToDocker}
                currentOrigin={currentOrigin}
                useServerSideProxy={useServerSideProxy}
                setUseServerSideProxy={setUseServerSideProxy}
                autoRetryEnabled={autoRetryEnabled}
                toggleAutoRetry={() => setAutoRetryEnabled(!autoRetryEnabled)}
                isLocalhost={isLocalhost}
              />
            </div>
            
            {connectionError && (
              <OllamaConnectionStatus connectionStatus={{ connected: false, error: connectionError }} />
            )}
            
            {isConnected && (
              <div className="space-y-4">
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Available Models</h3>
                  {isLoadingModels ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading models...</span>
                    </div>
                  ) : models.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {models.map((model) => (
                        <div 
                          key={model.name} 
                          className="border rounded p-3 flex items-center justify-between hover:bg-muted/50 cursor-pointer"
                          onClick={() => {
                            setSelectedModel(model.name);
                            setActiveTab("chat");
                          }}
                        >
                          <div>
                            <div className="font-medium">{model.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {(model.size / 1e9).toFixed(1)} GB
                            </div>
                          </div>
                          {selectedModel === model.name && (
                            <Badge variant="outline" className="bg-primary/10">Selected</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      <p>No models found. You need to install models in Ollama.</p>
                      <p className="mt-2">Run <code className="bg-muted p-1 rounded">ollama pull llama3</code> to install Llama 3.</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={refreshModels}
                    variant="outline"
                    size="sm"
                    disabled={isLoadingModels}
                  >
                    {isLoadingModels ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Refresh Models
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </div>

      <div className="p-3 border-t mt-auto">
        <OllamaChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={sendMessage}
          isLoading={isLoading}
          isConnected={isConnected}
          showSettings={activeTab === "settings"}
          models={models}
        />
      </div>
    </div>
  );
}
