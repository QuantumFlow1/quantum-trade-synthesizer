
import PerformanceMetrics from "@/components/PerformanceMetrics";
import TransactionList from "@/components/TransactionList";
import { Card } from "@/components/ui/card";
import { PieChart, Activity } from "lucide-react";

export const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
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
