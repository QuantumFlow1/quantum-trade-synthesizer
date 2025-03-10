
import { TabsContent } from '@/components/ui/tabs';
import { DeepSeekChat } from '../deepseek/DeepSeekChat';
import { OpenAIChat } from '../openai/OpenAIChat';
import { GrokChat } from '../grok/GrokChat';
import { ClaudeChat } from '../claude/ClaudeChat';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  return (
    <TabsContent value={tabValue} className="border rounded-md p-0 h-[400px]">
      {isEnabled ? (
        connectionStatus === 'connected' ? (
          // Show the appropriate chat component
          <>
            {tabValue === 'deepseek' && <DeepSeekChat />}
            {tabValue === 'openai' && <OpenAIChat />}
            {tabValue === 'grok' && <GrokChat />}
            {tabValue === 'claude' && <ClaudeChat />}
          </>
        ) : connectionStatus === 'checking' ? (
          // Show loading state
          <div className="h-full flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-gray-700">Connecting to API</h3>
            <p className="text-gray-500 text-center mt-2 max-w-md px-4">
              Checking administrator-configured API keys...
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
                  <p>Administrator has not yet configured the {tabValue.charAt(0).toUpperCase() + tabValue.slice(1)} API key. This feature is currently unavailable.</p>
                )}
                <div className="mt-4 flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={onRetryConnection}
                  >
                    Retry Connection
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )
      ) : (
        // Show disabled state
        <div className="h-full flex flex-col items-center justify-center p-6">
          <h3 className="text-lg font-medium text-gray-500">
            {tabValue.charAt(0).toUpperCase() + tabValue.slice(1)} is currently disabled
          </h3>
          <p className="text-gray-400 text-center mt-2">
            Enable this extension using the toggle above to use it.
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-4"
            onClick={() => toggleLLM(tabValue, true)}
          >
            Enable {tabValue.charAt(0).toUpperCase() + tabValue.slice(1)}
          </Button>
        </div>
      )}
    </TabsContent>
  );
}
