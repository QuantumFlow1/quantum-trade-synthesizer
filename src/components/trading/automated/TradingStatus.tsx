
import { Label } from "@/components/ui/label";
import { TrendingUp } from 'lucide-react';

interface TradingStatusProps {
  isActive: boolean;
  totalProfit: number;
}

export const TradingStatus = ({ isActive, totalProfit }: TradingStatusProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Status</Label>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
          <span>{isActive ? 'Active' : 'Inactive'}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Performance</Label>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span>Total Profit: ${totalProfit.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
