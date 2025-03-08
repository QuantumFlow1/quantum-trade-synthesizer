
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ConfidenceIndicatorProps {
  confidence: number;
  confidenceInterval?: [number, number];
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ 
  confidence, 
  confidenceInterval = [0, 0] 
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div 
          className={`absolute left-0 top-0 h-full rounded-full ${
            confidence > 75 ? 'bg-green-500' : 
            confidence > 50 ? 'bg-yellow-500' : 
            'bg-red-500'
          }`}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-xs font-medium flex items-center gap-1 cursor-help">
            {confidence}%
            {confidenceInterval[0] > 0 && (
              <span className="text-[10px] text-muted-foreground">
                ±{(confidenceInterval[1] - confidenceInterval[0])/2}%
              </span>
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent className="text-xs max-w-56">
          {confidenceInterval[0] > 0 ? (
            <p>Confidence interval: {confidenceInterval[0]}% - {confidenceInterval[1]}%</p>
          ) : (
            <p>Confidence score based on agent's analysis</p>
          )}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
