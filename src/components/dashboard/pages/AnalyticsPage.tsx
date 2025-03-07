
import PerformanceMetrics from "@/components/PerformanceMetrics";
import TransactionList from "@/components/TransactionList";
import { Card } from "@/components/ui/card";
import { PieChart, Activity, Brain } from "lucide-react";
import { CollaborativeInsightsPanel } from "@/components/trading/CollaborativeInsightsPanel";
import { useState, useEffect } from "react";
import { generateTradingData } from "@/utils/tradingData";

export const AnalyticsPage = () => {
  const [marketData, setMarketData] = useState<any>(null);
  
  // Generate some market data for the insights panel
  useEffect(() => {
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
  }, []);

  return (
    <div className="space-y-6">
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <h2 className="text-xl font-bold mb-4 flex items-center"><Brain className="w-5 h-5 mr-2" /> Portfolio Analysis</h2>
        <CollaborativeInsightsPanel 
          currentData={marketData}
          isSimulationMode={true} 
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
