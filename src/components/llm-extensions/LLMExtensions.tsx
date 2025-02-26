
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeepSeekChat } from './DeepSeekChat';
import { Bot, Code, Sparkles, Terminal } from 'lucide-react';

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
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="deepseek" className="flex items-center">
              <Code className="w-4 h-4 mr-2" />
              DeepSeek
            </TabsTrigger>
            <TabsTrigger value="openai" className="flex items-center" disabled>
              <Sparkles className="w-4 h-4 mr-2" />
              OpenAI (Coming Soon)
            </TabsTrigger>
            <TabsTrigger value="claude" className="flex items-center" disabled>
              <Terminal className="w-4 h-4 mr-2" />
              Claude (Coming Soon)
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="deepseek">
            <DeepSeekChat />
          </TabsContent>
          
          <TabsContent value="openai">
            <div className="h-[500px] flex items-center justify-center bg-gray-50 rounded-lg border">
              <div className="text-center p-6">
                <Sparkles className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">OpenAI Integration Coming Soon</h3>
                <p className="text-gray-500">
                  The OpenAI chat extension will be available in a future update.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="claude">
            <div className="h-[500px] flex items-center justify-center bg-gray-50 rounded-lg border">
              <div className="text-center p-6">
                <Terminal className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Claude Integration Coming Soon</h3>
                <p className="text-gray-500">
                  The Claude chat extension will be available in a future update.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
