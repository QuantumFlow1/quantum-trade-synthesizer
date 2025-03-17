
import { TabsContent } from '@/components/ui/tabs';
import { DeepSeekChat } from '../deepseek/DeepSeekChat';
import { OpenAIChat } from '../openai/OpenAIChat';
import { GrokChat } from '@/components/llm-extensions/grok/GrokChat';
import { ClaudeChat } from '../claude/ClaudeChat';
import { OllamaChat } from '../ollama/OllamaChat';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DisabledTabContent } from './DisabledTabContent';
import { ConnectionStatus } from './ConnectionStatus';

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

  // Display user-friendly model name
  const getModelDisplayName = () => {
    switch(tabValue) {
      case 'deepseek': return 'DeepSeek';
      case 'openai': return 'OpenAI';
      case 'grok': return 'Groq (Llama)';
      case 'claude': return 'Claude';
      case 'ollama': return 'Ollama';
      default: return tabValue.charAt(0).toUpperCase() + tabValue.slice(1);
    }
  };

  // Get setup instructions based on model type
  const getSetupInstructions = () => {
    if (tabValue === 'ollama') {
      return (
        <>
          <p>To use Ollama, you need to:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm mt-2">
            <li>Install and run Ollama on your local machine</li>
            <li>Ensure it's running on http://localhost:11434</li>
            <li>Pull a model using the Ollama CLI (e.g., 'ollama pull llama3')</li>
          </ol>
        </>
      );
    }
    
    return (
      <>
        <p>To use {getModelDisplayName()}, you need to:</p>
        <ol className="list-decimal list-inside space-y-1 text-sm mt-2">
          <li>Get an API key from the {getModelDisplayName()} website</li>
          <li>Configure it using the button below</li>
        </ol>
      </>
    );
  };

  return (
    <TabsContent value={tabValue} className="border rounded-md p-0 h-[400px]">
      {/* Show connection status banner */}
      <ConnectionStatus 
        status={connectionStatus} 
        llm={tabValue} 
        onRetryConnection={onRetryConnection} 
        onConfigure={onConfigure} 
      />
      
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
            Checking connection to {getModelDisplayName()}...
          </p>
        </div>
      ) : (
        // Show disconnected state with retry button
        <div className="h-full flex flex-col items-center justify-center p-6">
          <Alert className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Connection Required</AlertTitle>
            <AlertDescription className="space-y-4">
              {connectionStatus === 'unavailable' ? (
                <p>Could not connect to the {getModelDisplayName()} API. This may be due to a network issue or the API service being unavailable.</p>
              ) : (
                <div className="space-y-2">
                  {getSetupInstructions()}
                </div>
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
