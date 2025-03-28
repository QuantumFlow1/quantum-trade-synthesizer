
import { useState, useEffect } from "react";
import TradingChart from "@/components/TradingChart";
import { Card } from "@/components/ui/card";
import { LineChart, Sparkles } from "lucide-react";
import { AIInsights } from "@/components/financial-advice/AIInsights";
import { supabase } from "@/lib/supabase";
import { TradeOrderForm } from "@/components/trading/TradeOrderForm";
import PositionsList from "@/components/trading/PositionsList";
import SimulatedPositionsList from "@/components/trading/SimulatedPositionsList";
import { usePositions } from "@/hooks/use-positions";
import { useSimulatedPositions } from "@/hooks/use-simulated-positions";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

export const TradingPage = () => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const { positions, isLoading: positionsLoading } = usePositions();
  const { positions: simulatedPositions, isLoading: simulatedPositionsLoading, closePosition } = useSimulatedPositions();
  const [positionsTab, setPositionsTab] = useState("real");

  // Check API status when component mounts
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      setApiStatus('checking');
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: { message: "ping", context: [] }
      });
      
      if (error) throw error;
      setApiStatus('available');

      // Pre-fetch some trading advice
      fetchTradingAdvice();
    } catch (error) {
      console.error("Failed to verify API status:", error);
      setApiStatus('unavailable');
    }
  };

  const fetchTradingAdvice = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-trading-advice', {
        body: { market: "crypto", timeframe: "short" }
      });
      
      if (error) throw error;
      
      if (data && data.advice) {
        setAiAdvice(data.advice);
      }
    } catch (error) {
      console.error("Error fetching trading advice:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <h2 className="text-xl font-bold mb-4 flex items-center"><LineChart className="w-5 h-5 mr-2" /> Trading</h2>
        <TradingChart />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TradeOrderForm apiStatus={apiStatus} />
        </div>
        
        <div className="space-y-6">
          <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-bold mb-4 flex items-center"><Sparkles className="w-5 h-5 mr-2" /> AI Trading Inzichten</h2>
            <AIInsights isOnline={apiStatus === 'available'} aiAdvice={aiAdvice} />
          </Card>
          
          <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
            <h2 className="text-lg font-bold mb-4">Positions</h2>
            <Tabs value={positionsTab} onValueChange={setPositionsTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="real">Real</TabsTrigger>
                <TabsTrigger value="simulated">Simulated</TabsTrigger>
              </TabsList>
              
              <TabsContent value="real" className="mt-4">
                <PositionsList positions={positions} isLoading={positionsLoading} />
              </TabsContent>
              
              <TabsContent value="simulated" className="mt-4">
                <SimulatedPositionsList 
                  positions={simulatedPositions} 
                  isLoading={simulatedPositionsLoading}
                  onClosePosition={closePosition}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
