
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bot, Cpu, Braces } from "lucide-react";
import { StockbotChat } from "../StockbotChat";

export const TradingAgents = () => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <Bot className="w-5 h-5 mr-2 text-primary" />
          Trading AI Assistants
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="stockbot" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-2 px-4">
            <TabsTrigger value="stockbot" className="flex items-center gap-1">
              <Bot className="h-4 w-4" />
              Stockbot
            </TabsTrigger>
            <TabsTrigger value="algorithm" className="flex items-center gap-1">
              <Cpu className="h-4 w-4" />
              Algorithm
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-1">
              <Braces className="h-4 w-4" />
              Custom
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stockbot" className="mt-0">
            <StockbotChat />
          </TabsContent>
          
          <TabsContent value="algorithm" className="mt-0 p-6">
            <div className="flex flex-col items-center justify-center h-[500px] text-center">
              <Cpu className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Algorithmic Trading Assistant</h3>
              <p className="text-gray-500 max-w-md">
                The algorithmic trading assistant is currently in development.
                Check back soon for automated trading strategies and signals.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="mt-0 p-6">
            <div className="flex flex-col items-center justify-center h-[500px] text-center">
              <Braces className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Custom Trading Agent</h3>
              <p className="text-gray-500 max-w-md">
                Build and deploy your own custom trading agents with our no-code builder.
                This feature is coming soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
