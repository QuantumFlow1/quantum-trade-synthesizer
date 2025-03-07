
import PerformanceMetrics from "@/components/PerformanceMetrics";
import TransactionList from "@/components/TransactionList";
import { Card } from "@/components/ui/card";
import { PieChart, Activity, Brain, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { generateTradingData } from "@/utils/tradingData";
import { AIAnalysisPanel } from "@/components/trading/order-form/ai-analysis";
import { useApiStatus } from "@/components/trading/hooks/api-status";

export const AnalyticsPage = () => {
  const [marketData, setMarketData] = useState<any>(null);
  const { apiStatus } = useApiStatus();
  
  // Generate some market data for the insights panel
  useEffect(() => {
    try {
      const data = generateTradingData("1h");
      if (data && data.length > 0) {
        const lastPoint = data[data.length - 1];
        setMarketData({
          symbol: "BTC/USD",
          price: lastPoint.close,
          change24h: (lastPoint.close - data[0].close) / data[0].close * 100,
          volume: lastPoint.volume * lastPoint.close
        });
      }
    } catch (error) {
      console.error("Error generating trading data:", error);
    }
  }, []);

  // Create mock advanced signal for AI analysis
  const mockAdvancedSignal = {
    direction: "Buy",
    confidence: 78,
    reasoning: "Strong upward trend with increasing volume indicates bullish momentum",
    entry_price: marketData?.price || 45000,
    stop_loss: (marketData?.price || 45000) * 0.95,
    take_profit: (marketData?.price || 45000) * 1.1
  };

  // Create AI analysis data from the mock signal
  const aiAnalysis = {
    confidence: mockAdvancedSignal.confidence,
    riskLevel: mockAdvancedSignal.confidence > 70 ? "Laag" : "Gemiddeld",
    recommendation: `${mockAdvancedSignal.direction} op huidige prijs`,
    expectedProfit: `${Math.round((Math.abs(mockAdvancedSignal.take_profit - mockAdvancedSignal.entry_price) / mockAdvancedSignal.entry_price) * 1000) / 10}%`,
    stopLossRecommendation: mockAdvancedSignal.stop_loss,
    takeProfitRecommendation: mockAdvancedSignal.take_profit,
    collaboratingAgents: ["Grok3 AI", "TrendAnalyzer", "SignalGenerator"]
  };

  return (
    <div className="space-y-6">
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <h2 className="text-xl font-bold mb-4 flex items-center"><Sparkles className="w-5 h-5 mr-2" /> AI Trading Analysis</h2>
        <AIAnalysisPanel 
          aiAnalysis={aiAnalysis} 
          isOnline={apiStatus === 'available'} 
        />
      </Card>
      
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <h2 className="text-xl font-bold mb-4 flex items-center"><PieChart className="w-5 h-5 mr-2" /> Performance Analytics</h2>
        <PerformanceMetrics />
      </Card>
      
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <h2 className="text-xl font-bold mb-4 flex items-center"><Activity className="w-5 h-5 mr-2" /> Recent Transactions</h2>
        <TransactionList />
      </Card>
    </div>
  );
};
