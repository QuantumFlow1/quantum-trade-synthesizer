
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Code, Sparkles, MessageSquare, Zap, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LLMTabsListProps {
  enabledLLMs: {
    deepseek: boolean;
    openai: boolean;
    grok: boolean;
    claude: boolean;
  };
  toggleLLM: (llm: 'deepseek' | 'openai' | 'grok' | 'claude') => void;
  connectionStatus?: {
    deepseek?: 'connected' | 'connecting' | 'disconnected' | 'error';
    openai?: 'connected' | 'connecting' | 'disconnected' | 'error';
    grok?: 'connected' | 'connecting' | 'disconnected' | 'error';
    claude?: 'connected' | 'connecting' | 'disconnected' | 'error';
  };
}

export const LLMTabsList: React.FC<LLMTabsListProps> = ({ 
  enabledLLMs, 
  toggleLLM,
  connectionStatus = {} 
}) => {
  const getStatusIcon = (model: 'deepseek' | 'openai' | 'grok' | 'claude') => {
    const status = connectionStatus[model];
    
    if (!status || status === 'disconnected') {
      return null;
    }
    
    if (status === 'connecting') {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse mr-1"></div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Connecting...</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    if (status === 'error') {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircle className="w-3 h-3 text-red-500 mr-1" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Connection error</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connected</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <TabsList className="grid grid-cols-4 mb-4">
      <TabsTrigger value="deepseek" className="flex items-center justify-between">
        <div className="flex items-center">
          {getStatusIcon('deepseek')}
          <Code className="w-4 h-4 mr-2" />
          DeepSeek
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-2 p-0.5"
          onClick={(e) => {
            e.stopPropagation(); // Prevent tab from being selected
            toggleLLM('deepseek');
          }}
        >
          {enabledLLMs.deepseek ? (
            <ToggleRight className="w-5 h-5 text-green-500" />
          ) : (
            <ToggleLeft className="w-5 h-5 text-gray-400" />
          )}
        </Button>
      </TabsTrigger>
      
      <TabsTrigger value="openai" className="flex items-center justify-between">
        <div className="flex items-center">
          {getStatusIcon('openai')}
          <Sparkles className="w-4 h-4 mr-2" />
          OpenAI
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-2 p-0.5"
          onClick={(e) => {
            e.stopPropagation(); // Prevent tab from being selected
            toggleLLM('openai');
          }}
        >
          {enabledLLMs.openai ? (
            <ToggleRight className="w-5 h-5 text-green-500" />
          ) : (
            <ToggleLeft className="w-5 h-5 text-gray-400" />
          )}
        </Button>
      </TabsTrigger>
      
      <TabsTrigger value="grok" className="flex items-center justify-between">
        <div className="flex items-center">
          {getStatusIcon('grok')}
          <Zap className="w-4 h-4 mr-2" />
          Grok
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-2 p-0.5"
          onClick={(e) => {
            e.stopPropagation(); // Prevent tab from being selected
            toggleLLM('grok');
          }}
        >
          {enabledLLMs.grok ? (
            <ToggleRight className="w-5 h-5 text-green-500" />
          ) : (
            <ToggleLeft className="w-5 h-5 text-gray-400" />
          )}
        </Button>
      </TabsTrigger>
      
      <TabsTrigger value="claude" className="flex items-center justify-between">
        <div className="flex items-center">
          {getStatusIcon('claude')}
          <MessageSquare className="w-4 h-4 mr-2" />
          Claude
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-2 p-0.5"
          onClick={(e) => {
            e.stopPropagation(); // Prevent tab from being selected
            toggleLLM('claude');
          }}
        >
          {enabledLLMs.claude ? (
            <ToggleRight className="w-5 h-5 text-green-500" />
          ) : (
            <ToggleLeft className="w-5 h-5 text-gray-400" />
          )}
        </Button>
      </TabsTrigger>
    </TabsList>
  );
};
