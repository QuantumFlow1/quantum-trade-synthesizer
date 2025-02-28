
import { Card } from "@/components/ui/card";
import { LineChart, AlertCircle, Zap } from "lucide-react";
import MarketOverview from "@/components/MarketOverview";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import { AIAdvicePanel } from "@/components/dashboard/AIAdvicePanel";
import UserSentimentAnalysis from "@/components/user/UserSentimentAnalysis";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/contexts/DashboardContext";

interface OverviewPageProps {
  apiStatus: 'checking' | 'available' | 'unavailable';
}

export const OverviewPage = ({ apiStatus }: OverviewPageProps) => {
  const [localApiStatus, setLocalApiStatus] = useState<'checking' | 'available' | 'unavailable'>(apiStatus);
  const { setApiStatus } = useDashboard();

  // Effect to check API availability when component mounts
  useEffect(() => {
    if (apiStatus === 'checking') {
      checkApiStatus();
    } else {
      setLocalApiStatus(apiStatus);
    }
  }, [apiStatus]);

  const checkApiStatus = async () => {
    try {
      setLocalApiStatus('checking');
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: { message: "ping", context: [] }
      });
      
      if (error) throw error;
      const newStatus = 'available';
      setLocalApiStatus(newStatus);
      setApiStatus(newStatus); // Update global context state
      console.log("API is available");
    } catch (error) {
      console.error("Failed to verify API status:", error);
      const newStatus = 'unavailable';
      setLocalApiStatus(newStatus);
      setApiStatus(newStatus); // Update global context state
      console.log("API is unavailable");
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Overview Section */}
      <div className="w-full mb-6">
        <MarketOverview />
      </div>

      {/* Social Sentiment Analysis */}
      <div className="w-full mb-6">
        <UserSentimentAnalysis />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Performance Metrics */}
        <Card className="md:col-span-2 backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold mb-4 flex items-center"><Zap className="w-5 h-5 mr-2" /> Performance</h2>
          <PerformanceMetrics />
        </Card>

        {/* Financial Advice */}
        <AIAdvicePanel apiStatus={localApiStatus} />
      </div>
    </div>
  );
};
