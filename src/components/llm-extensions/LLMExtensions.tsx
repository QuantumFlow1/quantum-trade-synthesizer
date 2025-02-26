
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeepSeekChat } from './DeepSeekChat';
import { Bot, Code, Sparkles, Terminal, Zap, MessageSquare, AlertCircle } from 'lucide-react';
import { OpenAIChat } from './OpenAIChat';
import { ClaudeChat } from './ClaudeChat';
import { GrokChat } from './GrokChat';
import { setActiveLLM, getActiveLLM } from './utils/llmManager';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function LLMExtensions() {
  // Initialize with the stored active LLM or default to 'deepseek'
  const storedLLM = getActiveLLM();
  const [activeTab, setActiveTab] = useState(storedLLM || 'deepseek');
  const [showAlert, setShowAlert] = useState(false);
  const [prevActiveLLM, setPrevActiveLLM] = useState<string | null>(null);
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    console.log(`Tab changed to: ${value}`);
    
    // Store previous LLM for alert
    setPrevActiveLLM(getActiveLLM());
    
    // Set the new active LLM
    setActiveLLM(value as 'claude' | 'openai' | 'grok' | 'deepseek');
    
    // Update active tab state
    setActiveTab(value);
    
    // Show alert about switching LLMs
    setShowAlert(true);
    
    // Hide alert after 5 seconds
    setTimeout(() => setShowAlert(false), 5000);
  };
  
  // Set the active LLM on initial load
  useEffect(() => {
    // Only set if not already set
    if (!getActiveLLM()) {
      setActiveLLM(activeTab as 'claude' | 'openai' | 'grok' | 'deepseek');
    }
  }, []);
  
  return (
    <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-0 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Bot className="w-5 h-5 mr-2" /> AI Assistant Extensions
        </CardTitle>
        <CardDescription>
          Select one AI assistant at a time to prevent conflicts between different models
        </CardDescription>
        
        {showAlert && (
          <Alert variant="info" className="mt-2 bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertTitle>LLM Switch</AlertTitle>
            <AlertDescription>
              {prevActiveLLM ? 
                `Switched from ${prevActiveLLM} to ${activeTab}. Previous conversations are preserved but only one AI assistant is active at a time.` : 
                `${activeTab} is now the active AI assistant.`}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        <Tabs 
          value={activeTab} 
          className="w-full" 
          onValueChange={handleTabChange}
        >
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
