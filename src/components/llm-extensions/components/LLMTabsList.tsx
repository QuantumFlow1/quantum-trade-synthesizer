
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Code, Sparkles, MessageSquare, Zap, ToggleLeft, ToggleRight } from 'lucide-react';

interface LLMTabsListProps {
  enabledLLMs: {
    deepseek: boolean;
    openai: boolean;
    grok: boolean;
    claude: boolean;
  };
  toggleLLM: (llm: 'deepseek' | 'openai' | 'grok' | 'claude') => void;
}

export const LLMTabsList: React.FC<LLMTabsListProps> = ({ enabledLLMs, toggleLLM }) => {
  return (
    <TabsList className="grid grid-cols-4 mb-4">
      <TabsTrigger value="deepseek" className="flex items-center justify-between">
        <div className="flex items-center">
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
