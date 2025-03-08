
import React from 'react';
import { Percent, Target, History } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PerformanceMetricsProps {
  performanceScore: number;
  accuracyData?: {
    overall: number;
    recent: number;
    confidence: [number, number];
    predictionHistory?: Array<{correct: boolean, date: string, prediction: string}>;
  }
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ 
  performanceScore, 
  accuracyData 
}) => {
  if (!accuracyData) {
    return (
      <div className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          Success rate:
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-xs px-2 py-0.5 rounded bg-secondary flex items-center gap-1 cursor-help">
                <Percent className="h-3 w-3" />
                {performanceScore}%
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Historical success rate of this agent</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <>
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Success rate:
          </div>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-xs px-2 py-0.5 rounded bg-secondary flex items-center gap-1 cursor-help">
                  <Percent className="h-3 w-3" />
                  {performanceScore}%
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Historical success rate of this agent</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Overall accuracy:
          </div>
          <div className="text-xs px-2 py-0.5 rounded bg-secondary flex items-center gap-1">
            <Target className="h-3 w-3" />
            {accuracyData.overall}%
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Recent accuracy:
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-xs px-2 py-0.5 rounded bg-secondary flex items-center gap-1 cursor-help">
                <History className="h-3 w-3" />
                {accuracyData.recent}%
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Based on the last 10 predictions</p>
              {accuracyData.predictionHistory && (
                <div className="mt-1 pt-1 border-t border-border">
                  <p className="text-xs font-medium mb-1">Recent predictions:</p>
                  <div className="grid grid-cols-4 gap-1 max-h-24 overflow-y-auto">
                    {accuracyData.predictionHistory.slice(0, 8).map((entry, idx) => (
                      <div key={idx} className={`text-[10px] px-1 py-0.5 rounded ${entry.correct ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {entry.prediction}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        </div>
      </>
    </TooltipProvider>
  );
};
