
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

type TabType = 'openai' | 'claude' | 'gemini' | 'deepseek' | 'groq';

interface ApiKeyTabsListProps {
  activeTab: TabType;
  onTabChange: (value: string) => void;
}

export const ApiKeyTabsList = ({ activeTab, onTabChange }: ApiKeyTabsListProps) => {
  return (
    <TabsList className="grid grid-cols-5 mb-4">
      <TabsTrigger value="openai" onClick={() => onTabChange('openai')}>OpenAI</TabsTrigger>
      <TabsTrigger value="claude" onClick={() => onTabChange('claude')}>Claude</TabsTrigger>
      <TabsTrigger value="gemini" onClick={() => onTabChange('gemini')}>Gemini</TabsTrigger>
      <TabsTrigger value="deepseek" onClick={() => onTabChange('deepseek')}>DeepSeek</TabsTrigger>
      <TabsTrigger value="groq" onClick={() => onTabChange('groq')}>Groq</TabsTrigger>
    </TabsList>
  );
};
