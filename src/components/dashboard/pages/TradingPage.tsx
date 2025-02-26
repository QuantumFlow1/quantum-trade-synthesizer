
import TradingChart from "@/components/TradingChart";
import { Card } from "@/components/ui/card";
import { LineChart } from "lucide-react";

export const TradingPage = () => {
  return (
    <div className="space-y-6">
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <h2 className="text-xl font-bold mb-4 flex items-center"><LineChart className="w-5 h-5 mr-2" /> Trading</h2>
        <TradingChart />
      </Card>
    </div>
  );
};
