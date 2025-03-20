
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";
import { MarketData } from "./types";
import { 
  AIMessageList, 
  MarketDataSummary, 
  AIInputControls,
  useAIAnalysis 
} from "./ai-analysis";

interface AIMarketAnalysisProps {
  marketData?: MarketData;
  className?: string;
}

export function AIMarketAnalysis({ marketData, className }: AIMarketAnalysisProps) {
  const {
    messages,
    isLoading,
    aiError,
    handleSendMessage,
    resetChat
  } = useAIAnalysis(marketData);

  return (
    <Card className={`h-full bg-secondary/10 backdrop-blur-xl border border-white/10 shadow-lg ${className}`}>
      <CardHeader className="p-4">
        <CardTitle className="flex items-center text-lg font-medium">
          <BrainCircuit className="w-5 h-5 mr-2 text-primary" />
          Quantum-Enhanced Market Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex flex-col h-[calc(100%-68px)]">
        <MarketDataSummary marketData={marketData} />

        <AIMessageList 
          messages={messages} 
          isLoading={isLoading} 
          aiError={aiError} 
        />

        <AIInputControls 
          onSendMessage={handleSendMessage}
          onResetChat={resetChat}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
