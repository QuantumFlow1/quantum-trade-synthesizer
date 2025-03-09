
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DeepSeekChat } from '../DeepSeekChat';
import { OpenAIChat } from '../OpenAIChat';
import { GrokChat } from '../GrokChat';
import { ClaudeChat } from '../ClaudeChat';
import { ChatEmpty } from './ChatEmpty';
import { Cpu, Sparkles, Brain, MessageSquare, Settings } from 'lucide-react';
import { ConnectionStatus } from './ConnectionStatus';

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
          {getLLMIcon(tabValue, "w-12 h-12 text-gray-400 mb-4")}
          <p className="text-gray-500 mb-4 text-center max-w-md">
            This LLM extension is currently disabled.
            Enable it to use {getLLMName(tabValue)} capabilities.
          </p>
          <Button onClick={() => toggleLLM(tabValue, true)} className="flex items-center">
            {getLLMIcon(tabValue, "w-4 h-4 mr-2")}
            Enable {getLLMName(tabValue)}
          </Button>
        </div>
      );
    }

    if (connectionStatus === 'disconnected') {
      return (
        <div className="h-full flex flex-col items-center justify-center p-6">
          {getLLMIcon(tabValue, "w-12 h-12 text-amber-400 mb-4")}
          <p className="text-gray-500 mb-4 text-center max-w-md">
            {getLLMName(tabValue)} is not connected. Please set up your API key.
          </p>
          <Button onClick={() => window.location.href = '/dashboard/settings'} className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Configure API Keys
          </Button>
        </div>
      );
    }

    if (connectionStatus === 'unavailable') {
      return (
        <div className="h-full flex flex-col items-center justify-center p-6">
          {getLLMIcon(tabValue, "w-12 h-12 text-red-400 mb-4")}
          <p className="text-gray-500 mb-4 text-center max-w-md">
            {getLLMName(tabValue)} service is currently unavailable. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()} className="flex items-center">
            Retry Connection
          </Button>
        </div>
      );
    }

    if (connectionStatus === 'checking') {
      return (
        <div className="h-full flex flex-col items-center justify-center p-6">
          {getLLMIcon(tabValue, "w-12 h-12 text-blue-400 mb-4 animate-pulse")}
          <p className="text-gray-500 mb-4 text-center max-w-md">
            Checking connection to {getLLMName(tabValue)}...
          </p>
          <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
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

  // Get the icon for the LLM
  const getLLMIcon = (value: string, className: string = "w-5 h-5") => {
    switch (value) {
      case 'deepseek':
        return <Cpu className={className} />;
      case 'openai':
        return <Sparkles className={className} />;
      case 'grok':
        return <Brain className={className} />;
      case 'claude':
        return <MessageSquare className={className} />;
      default:
        return null;
    }
  };

  return (
    <TabsContent value={tabValue} className="mt-0 h-[500px] border-none p-0">
      <div className="w-full h-full flex flex-col">
        <ConnectionStatus status={connectionStatus} llm={tabValue} />
        {renderChatComponent()}
      </div>
    </TabsContent>
  );
}
