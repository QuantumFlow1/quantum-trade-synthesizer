
import { Card } from "@/components/ui/card";
import { LineChart, AlertCircle, Zap } from "lucide-react";
import MarketOverview from "@/components/MarketOverview";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import { AIAdvicePanel } from "@/components/dashboard/AIAdvicePanel";
import UserSentimentAnalysis from "@/components/user/UserSentimentAnalysis";
import { useApiStatus } from "@/hooks/use-api-status";

interface OverviewPageProps {
  apiStatus: 'checking' | 'available' | 'unavailable';
}

export const OverviewPage = ({ apiStatus: initialApiStatus }: OverviewPageProps) => {
  const { apiStatus, isCheckingKeys, checkApiStatus } = useApiStatus(initialApiStatus);

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
        <AIAdvicePanel 
          apiStatus={apiStatus} 
          isCheckingKeys={isCheckingKeys}
          onManualCheck={checkApiStatus}
        />
      </div>
    </div>
  );
};
