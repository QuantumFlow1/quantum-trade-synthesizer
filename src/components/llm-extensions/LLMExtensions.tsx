
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { Bot } from 'lucide-react';
import { LLMTabsList } from './components/LLMTabsList';
import { LLMTabContent } from './components/LLMTabContent';
import { useLLMExtensions } from './hooks/useLLMExtensions';

export function LLMExtensions() {
  const { activeTab, setActiveTab, enabledLLMs, toggleLLM } = useLLMExtensions();
  
  return (
    <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-0 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Bot className="w-5 h-5 mr-2" /> AI Assistant Extensions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deepseek" className="w-full" onValueChange={setActiveTab}>
          <LLMTabsList 
            enabledLLMs={enabledLLMs} 
            toggleLLM={toggleLLM} 
          />
          
          <LLMTabContent 
            tabValue="deepseek" 
            isEnabled={enabledLLMs.deepseek} 
            toggleLLM={toggleLLM} 
          />
          
          <LLMTabContent 
            tabValue="openai" 
            isEnabled={enabledLLMs.openai} 
            toggleLLM={toggleLLM} 
          />
          
          <LLMTabContent 
            tabValue="grok" 
            isEnabled={enabledLLMs.grok} 
            toggleLLM={toggleLLM} 
          />
          
          <LLMTabContent 
            tabValue="claude" 
            isEnabled={enabledLLMs.claude} 
            toggleLLM={toggleLLM} 
          />
        </Tabs>
      </CardContent>
    </Card>
  );
}
