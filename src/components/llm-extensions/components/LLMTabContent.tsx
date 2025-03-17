
import { TabsContent } from '@/components/ui/tabs';
import { DeepSeekChat } from '../deepseek/DeepSeekChat';
import { OpenAIChat } from '../openai/OpenAIChat';
import { GrokChat } from '@/components/chat/GrokChat';
import { ClaudeChat } from '../claude/ClaudeChat';
import { OllamaChat } from '../ollama/OllamaChat';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DisabledTabContent } from './DisabledTabContent';

interface LLMTabContentProps {
  tabValue: string;
  isEnabled: boolean;
  toggleLLM: (llm: string, enabled: boolean) => void;
  connectionStatus: 'connected' | 'disconnected' | 'unavailable' | 'checking';
  onRetryConnection: () => void;
  onConfigure: () => void;
}

export function LLMTabContent({
  tabValue,
  isEnabled,
  toggleLLM,
  connectionStatus,
  onRetryConnection,
  onConfigure
}: LLMTabContentProps) {
  if (!isEnabled) {
    return (
      <TabsContent value={tabValue} className="border rounded-md p-0 h-[400px]">
        <DisabledTabContent 
          modelName={tabValue.charAt(0).toUpperCase() + tabValue.slice(1)} 
          onEnable={() => toggleLLM(tabValue, true)} 
        />
      </TabsContent>
    );
  }

  return (
    <TabsContent value={tabValue} className="border rounded-md p-0 h-[400px]">
      {connectionStatus === 'connected' ? (
        // Show the appropriate chat component
        <>
          {tabValue === 'deepseek' && <DeepSeekChat />}
          {tabValue === 'openai' && <OpenAIChat />}
          {tabValue === 'grok' && <GrokChat />}
          {tabValue === 'claude' && <ClaudeChat />}
          {tabValue === 'ollama' && <OllamaChat />}
        </>
      ) : connectionStatus === 'checking' ? (
        // Show loading state
        <div className="h-full flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Connecting to API</h3>
          <p className="text-gray-500 text-center mt-2 max-w-md px-4">
            Checking connection to {tabValue.charAt(0).toUpperCase() + tabValue.slice(1)}...
          </p>
        </div>
      ) : (
        // Show disconnected state with retry button
        <div className="h-full flex flex-col items-center justify-center p-6">
          <Alert className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Connection Required</AlertTitle>
            <AlertDescription>
              {connectionStatus === 'unavailable' ? (
                <p>Could not connect to the {tabValue.charAt(0).toUpperCase() + tabValue.slice(1)} API. This may be due to a network issue or the API service being unavailable.</p>
              ) : (
                <>
                  <p>
                    {tabValue === 'ollama' ? 
                      "Could not connect to Ollama. Make sure it's running on your local machine." :
                      `Could not connect to ${tabValue.charAt(0).toUpperCase() + tabValue.slice(1)}. You need to configure a valid API key.`}
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">To use this model you need to:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>{tabValue === 'ollama' ? 
                          "Install and run Ollama on your computer" : 
                          `Get an API key from the ${tabValue.charAt(0).toUpperCase() + tabValue.slice(1)} website`}</li>
                      <li>{tabValue === 'ollama' ? 
                          "Make sure it's running on http://localhost:11434" : 
                          "Configure the API key below"}</li>
                    </ol>
                  </div>
                </>
              )}
              <div className="mt-4 flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={onRetryConnection}
                >
                  Retry Connection
                </Button>
                {tabValue !== 'ollama' && (
                  <Button 
                    size="sm" 
                    onClick={onConfigure}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Configure API Key
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </TabsContent>
  );
}
