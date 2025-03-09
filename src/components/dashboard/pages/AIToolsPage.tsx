
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Bot, MessageSquare, Zap } from "lucide-react";
import { GrokChat } from "@/components/llm-extensions/GrokChat";
import { DeepSeekChat } from "@/components/llm-extensions/DeepSeekChat";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockbotAccess } from "@/components/trading/minimal/StockbotAccess";

export function AIToolsPage() {
  const [activeTab, setActiveTab] = useState("stockbot");

  useEffect(() => {
    // Check if we have a tab preference in localStorage
    const savedTab = localStorage.getItem("aiToolsActiveTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem("aiToolsActiveTab", value);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Tools</h1>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="stockbot" className="flex items-center">
            <Bot className="w-4 h-4 mr-2" />
            <span>Stockbot</span>
          </TabsTrigger>
          <TabsTrigger value="deepseek" className="flex items-center">
            <BrainCircuit className="w-4 h-4 mr-2" />
            <span>DeepSeek</span>
          </TabsTrigger>
          <TabsTrigger value="grok" className="flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            <span>Grok</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stockbot" className="space-y-4">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2 text-blue-500" />
                Stockbot Trading Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Stockbot is your AI-powered trading assistant that provides market analysis and 
                personalized trading recommendations based on real-time market data, technical indicators,
                and sentiment analysis.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StockbotAccess />
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Stockbot Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Multiple AI agents with different specializations</li>
                      <li>Groq LLM-powered market analysis</li>
                      <li>Collaborative trading recommendations</li>
                      <li>Risk assessment and portfolio management</li>
                      <li>Simulated or real market data analysis</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deepseek">
          <DeepSeekChat />
        </TabsContent>

        <TabsContent value="grok">
          <GrokChat />
        </TabsContent>
      </Tabs>
    </div>
  );
}
