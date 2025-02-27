
import { Progress } from "@/components/ui/progress";

interface WalletPerformanceProps {
  performanceToday: number;
  performanceWeek: number;
  performanceMonth: number;
}

export const WalletPerformance = ({
  performanceToday,
  performanceWeek,
  performanceMonth
}: WalletPerformanceProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Performance</h3>
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Today</span>
            <span className={performanceToday >= 0 ? 'text-green-500' : 'text-red-500'}>
              {performanceToday > 0 ? '+' : ''}{performanceToday.toFixed(2)}%
            </span>
          </div>
          <Progress 
            value={50 + (performanceToday * 5)} 
            className="h-2" 
          />
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>This Week</span>
            <span className={performanceWeek >= 0 ? 'text-green-500' : 'text-red-500'}>
              {performanceWeek > 0 ? '+' : ''}{performanceWeek.toFixed(2)}%
            </span>
          </div>
          <Progress 
            value={50 + (performanceWeek * 5)} 
            className="h-2" 
          />
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>This Month</span>
            <span className={performanceMonth >= 0 ? 'text-green-500' : 'text-red-500'}>
              {performanceMonth > 0 ? '+' : ''}{performanceMonth.toFixed(2)}%
            </span>
          </div>
          <Progress 
            value={50 + (performanceMonth * 2)} 
            className="h-2" 
          />
        </div>
      </div>
    </div>
  );
};
