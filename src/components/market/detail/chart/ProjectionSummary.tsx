
import { TrendingUp, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HourlyProjection } from '../../types';

interface ProjectionSummaryProps {
  hourlyProjections: HourlyProjection[];
}

export const ProjectionSummary = ({ hourlyProjections }: ProjectionSummaryProps) => {
  if (!hourlyProjections.length) return null;
  
  return (
    <div className="mt-4 bg-secondary/20 rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-primary" />
          24-Hour Price Projection Summary
        </h3>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center text-xs text-muted-foreground">
                <Info className="h-3 w-3 mr-1" />
                About Projections
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">
                Projections are indicated with dashed lines, with confidence bands showing possible price ranges. 
                Higher confidence projections have narrower bands.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-background/80 p-2 rounded">
          <p className="text-muted-foreground">Average Trend</p>
          <p className={`font-medium ${
            hourlyProjections.filter(p => p.trend === 'up').length > hourlyProjections.filter(p => p.trend === 'down').length
            ? 'text-green-500' : 'text-red-500'
          }`}>
            {
              hourlyProjections.filter(p => p.trend === 'up').length > hourlyProjections.filter(p => p.trend === 'down').length
              ? 'Bullish' : 'Bearish'
            }
          </p>
        </div>
        
        <div className="bg-background/80 p-2 rounded">
          <p className="text-muted-foreground">Expected Volatility</p>
          <p className="font-medium">
            {
              hourlyProjections.filter(p => p.volatility === 'high').length > hourlyProjections.length / 3
              ? 'High' : hourlyProjections.filter(p => p.volatility === 'medium').length > hourlyProjections.length / 2
              ? 'Medium' : 'Low'
            }
          </p>
        </div>
        
        <div className="bg-background/80 p-2 rounded">
          <p className="text-muted-foreground">Confidence Level</p>
          <p className="font-medium">
            {(hourlyProjections.reduce((sum, proj) => sum + proj.confidence, 0) / hourlyProjections.length * 100).toFixed(0)}%
          </p>
        </div>
      </div>
      
      <div className="mt-3 flex items-center flex-wrap gap-2 text-xs">
        <div className="flex items-center">
          <span className="inline-block w-6 h-[2px] bg-primary mr-1"></span>
          <span>Actual data</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-6 h-[2px] border-t-[2px] border-dashed border-amber-500 mr-1"></span>
          <span>Projection</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-6 h-4 bg-amber-100/50 border border-amber-200/50 mr-1"></span>
          <span>Confidence band</span>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        Note: Projections are based on historical patterns and current market conditions. Actual prices may vary significantly.
      </p>
    </div>
  );
};
