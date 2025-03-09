
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Brain, Zap } from "lucide-react";
import { StockbotChat } from "../StockbotChat";

export const TradingAgents = () => {
  const [activeAgent, setActiveAgent] = useState<string>("stockbot");

  return (
    <Card className="w-full h-full shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Trading Agents</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <Tabs value={activeAgent} onValueChange={setActiveAgent} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="stockbot" className="flex items-center">
              <Bot className="w-4 h-4 mr-2" />
              <span>Stockbot</span>
            </TabsTrigger>
            <TabsTrigger value="technicalAgent" className="flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              <span>Technical</span>
            </TabsTrigger>
            <TabsTrigger value="sentimentAgent" className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              <span>Sentiment</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stockbot" className="m-0">
            <StockbotChat />
          </TabsContent>
          
          <TabsContent value="technicalAgent" className="m-0">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <Brain className="w-10 h-10 mx-auto text-blue-500 mb-2" />
              <h3 className="text-lg font-medium mb-2">Technical Analysis Agent</h3>
              <p className="text-gray-600 mb-4">
                This agent specializes in technical analysis, chart patterns, and indicators.
              </p>
              <p className="text-sm text-blue-600">Coming soon in the next update</p>
            </div>
          </TabsContent>
          
          <TabsContent value="sentimentAgent" className="m-0">
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <Zap className="w-10 h-10 mx-auto text-purple-500 mb-2" />
              <h3 className="text-lg font-medium mb-2">Sentiment Analysis Agent</h3>
              <p className="text-gray-600 mb-4">
                This agent analyzes market sentiment, news impact, and social trends.
              </p>
              <p className="text-sm text-purple-600">Coming soon in the next update</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
