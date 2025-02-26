
import { useState, useEffect } from "react";
import TradingChart from "@/components/TradingChart";
import { Card } from "@/components/ui/card";
import { LineChart, Sparkles } from "lucide-react";
import { AIInsights } from "@/components/financial-advice/AIInsights";
import { supabase } from "@/lib/supabase";

export const TradingPage = () => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [aiAdvice, setAiAdvice] = useState<string>("");

  // Check API status when component mounts
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
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

      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <h2 className="text-xl font-bold mb-4 flex items-center"><Sparkles className="w-5 h-5 mr-2" /> AI Trading Inzichten</h2>
        <AIInsights isOnline={apiStatus === 'available'} aiAdvice={aiAdvice} />
      </Card>
    </div>
  );
};
