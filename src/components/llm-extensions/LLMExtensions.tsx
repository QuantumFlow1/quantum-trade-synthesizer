
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeepSeekChat } from './DeepSeekChat';
import { Bot, Code, Sparkles, Terminal, Zap, MessageSquare, ToggleLeft, ToggleRight } from 'lucide-react';
import { OpenAIChat } from './OpenAIChat';
import { ClaudeChat } from './ClaudeChat';
import { GrokChat } from './GrokChat';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export function LLMExtensions() {
  const [activeTab, setActiveTab] = useState('deepseek');
  const [enabledLLMs, setEnabledLLMs] = useState({
    deepseek: true,
    openai: true,
    grok: true,
    claude: true
  });
  
  // Load enabled states from localStorage on mount
  useEffect(() => {
    const savedStates = localStorage.getItem('enabledLLMs');
    if (savedStates) {
      try {
        setEnabledLLMs(JSON.parse(savedStates));
      } catch (e) {
        console.error('Error parsing saved LLM states:', e);
      }
    }
  }, []);
  
  // Save enabled states to localStorage when they change
  useEffect(() => {
    localStorage.setItem('enabledLLMs', JSON.stringify(enabledLLMs));
  }, [enabledLLMs]);
  
  const toggleLLM = (llm: 'deepseek' | 'openai' | 'grok' | 'claude') => {
    setEnabledLLMs(prev => {
      const newState = { ...prev, [llm]: !prev[llm] };
      
      // Show toast notification
      toast({
        title: `${llm.charAt(0).toUpperCase() + llm.slice(1)} ${newState[llm] ? 'Enabled' : 'Disabled'}`,
        description: newState[llm] 
          ? `${llm.charAt(0).toUpperCase() + llm.slice(1)} is now ready to use.` 
          : `${llm.charAt(0).toUpperCase() + llm.slice(1)} has been turned off.`,
        duration: 3000
      });
      
      return newState;
    });
  };
  
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
          
          <TabsContent value="deepseek">
            {enabledLLMs.deepseek ? <DeepSeekChat /> : (
              <div className="flex flex-col items-center justify-center h-[500px] text-center py-10 text-gray-500">
                <ToggleLeft className="h-12 w-12 mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">DeepSeek is currently disabled</h3>
                <p className="max-w-md mb-4">Click the toggle switch in the tab above to enable this LLM.</p>
                <Button 
                  variant="outline" 
                  onClick={() => toggleLLM('deepseek')}
                >
                  Enable DeepSeek
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="openai">
            {enabledLLMs.openai ? <OpenAIChat /> : (
              <div className="flex flex-col items-center justify-center h-[500px] text-center py-10 text-gray-500">
                <ToggleLeft className="h-12 w-12 mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">OpenAI is currently disabled</h3>
                <p className="max-w-md mb-4">Click the toggle switch in the tab above to enable this LLM.</p>
                <Button 
                  variant="outline" 
                  onClick={() => toggleLLM('openai')}
                >
                  Enable OpenAI
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="grok">
            {enabledLLMs.grok ? <GrokChat /> : (
              <div className="flex flex-col items-center justify-center h-[500px] text-center py-10 text-gray-500">
                <ToggleLeft className="h-12 w-12 mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Grok is currently disabled</h3>
                <p className="max-w-md mb-4">Click the toggle switch in the tab above to enable this LLM.</p>
                <Button 
                  variant="outline" 
                  onClick={() => toggleLLM('grok')}
                >
                  Enable Grok
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="claude">
            {enabledLLMs.claude ? <ClaudeChat /> : (
              <div className="flex flex-col items-center justify-center h-[500px] text-center py-10 text-gray-500">
                <ToggleLeft className="h-12 w-12 mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Claude is currently disabled</h3>
                <p className="max-w-md mb-4">Click the toggle switch in the tab above to enable this LLM.</p>
                <Button 
                  variant="outline" 
                  onClick={() => toggleLLM('claude')}
                >
                  Enable Claude
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
