
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeepSeekChat } from './DeepSeekChat';
import { Bot, Code, Sparkles, Terminal, Zap, MessageSquare } from 'lucide-react';
import { OpenAIChat } from './OpenAIChat';
import { ClaudeChat } from './ClaudeChat';
import { GrokChat } from './GrokChat';

export function LLMExtensions() {
  const [activeTab, setActiveTab] = useState('deepseek');
  
  return (
    <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-0 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Bot className="w-5 h-5 mr-2" /> AI Assistant Extensions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deepseek" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="deepseek" className="flex items-center">
              <Code className="w-4 h-4 mr-2" />
              DeepSeek
            </TabsTrigger>
            <TabsTrigger value="openai" className="flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              OpenAI
            </TabsTrigger>
            <TabsTrigger value="grok" className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Grok
            </TabsTrigger>
            <TabsTrigger value="claude" className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Claude
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="deepseek">
            <DeepSeekChat />
          </TabsContent>
          
          <TabsContent value="openai">
            <OpenAIChat />
          </TabsContent>
          
          <TabsContent value="grok">
            <GrokChat />
          </TabsContent>
          
          <TabsContent value="claude">
            <ClaudeChat />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
