
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { DisabledTabContent } from './DisabledTabContent';
import { DeepSeekChat } from '../DeepSeekChat';
import { OpenAIChat } from '../OpenAIChat';
import { GrokChat } from '../GrokChat';
import { ClaudeChat } from '../ClaudeChat';

interface LLMTabContentProps {
  tabValue: 'deepseek' | 'openai' | 'grok' | 'claude';
  isEnabled: boolean;
  toggleLLM: (llm: 'deepseek' | 'openai' | 'grok' | 'claude') => void;
}

export const LLMTabContent: React.FC<LLMTabContentProps> = ({ tabValue, isEnabled, toggleLLM }) => {
  const renderContent = () => {
    if (!isEnabled) {
      return (
        <DisabledTabContent 
          modelName={tabValue.charAt(0).toUpperCase() + tabValue.slice(1)} 
          onEnable={() => toggleLLM(tabValue)} 
        />
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
        return null;
    }
  };

  return (
    <TabsContent value={tabValue}>
      {renderContent()}
    </TabsContent>
  );
};
