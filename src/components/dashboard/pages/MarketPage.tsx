
import MarketOverview from "@/components/MarketOverview";
import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";
import UserSentimentAnalysis from "@/components/user/UserSentimentAnalysis";

export const MarketPage = () => {
  return (
    <div className="space-y-6">
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <h2 className="text-xl font-bold mb-4 flex items-center"><Activity className="w-5 h-5 mr-2" /> Market Overview</h2>
        <MarketOverview />
      </Card>

      <div className="w-full">
        <UserSentimentAnalysis />
      </div>
    </div>
  );
};
