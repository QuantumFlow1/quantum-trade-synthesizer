
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DeepSeekChat } from '../DeepSeekChat';
import { OpenAIChat } from '../OpenAIChat';
import { GrokChat } from '../GrokChat';
import { ClaudeChat } from '../ClaudeChat';
import { ChatEmpty } from './ChatEmpty';

interface LLMTabContentProps {
  tabValue: string;
  isEnabled: boolean;
  toggleLLM: (llm: string, enabled: boolean) => void;
  connectionStatus: 'connected' | 'disconnected' | 'unavailable' | 'checking';
}

export function LLMTabContent({ 
  tabValue, 
  isEnabled, 
  toggleLLM,
  connectionStatus 
}: LLMTabContentProps) {
  // Render appropriate chat component based on tab value
  const renderChatComponent = () => {
    if (!isEnabled) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-6">
          <p className="text-gray-500 mb-4 text-center max-w-md">
            This LLM extension is currently disabled.
            Enable it to use {getLLMName(tabValue)} capabilities.
          </p>
          <Button onClick={() => toggleLLM(tabValue, true)}>
            Enable {getLLMName(tabValue)}
          </Button>
        </div>
      );
    }

    switch (tabValue) {
      case 'deepseek':
        return <DeepSeekChat />;
      case 'openai':
        return <OpenAIChat />;
      case 'grok':
        return <GrokChat />;
      case 'claude':
        return <ClaudeChat />;
      default:
        return <ChatEmpty />;
    }
  };

  // Get user-friendly LLM name
  const getLLMName = (value: string) => {
    switch (value) {
      case 'deepseek':
        return 'DeepSeek';
      case 'openai':
        return 'OpenAI';
      case 'grok':
        return 'Grok';
      case 'claude':
        return 'Claude';
      default:
        return value;
    }
  };

  return (
    <TabsContent value={tabValue} className="mt-0 h-[500px] border-none p-0">
      {renderChatComponent()}
    </TabsContent>
  );
}
