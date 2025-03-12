
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PerformanceMetricsProps {
  performanceScore: number;
  accuracyData?: {
    overall: number;
    recent: number;
    confidence: [number, number];
    predictionHistory?: Array<{correct: boolean, date: string, prediction: string}>;
  };
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ 
  performanceScore,
  accuracyData
}) => {
  const score = Math.round(performanceScore * 100);
  const color = score > 80 ? 'text-green-500' : 
                score > 65 ? 'text-blue-500' : 
                score > 50 ? 'text-yellow-500' : 'text-red-500';
  
  return (
    <div className="flex justify-between items-center">
      <div className="text-xs text-muted-foreground">
        Success rate:
      </div>
      <Tooltip>
        <TooltipTrigger className="flex items-center">
          <span className={`text-xs font-medium ${color}`}>{score}%</span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1 text-xs">
            <p>Overall accuracy: {(accuracyData?.overall || 0).toFixed(0)}%</p>
            <p>Recent performance: {(accuracyData?.recent || 0).toFixed(0)}%</p>
            {accuracyData?.predictionHistory && (
              <p>Past predictions: {accuracyData.predictionHistory.length}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
