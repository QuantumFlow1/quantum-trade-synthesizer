
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ConfidenceIndicatorProps {
  confidence: number;
  confidenceInterval?: [number, number];
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ 
  confidence,
  confidenceInterval
}) => {
  // Ensure confidence is between 0 and 100
  const safeConfidence = Math.max(0, Math.min(100, confidence));
  
  const color = safeConfidence > 80 ? 'bg-green-500' : 
                safeConfidence > 65 ? 'bg-blue-500' : 
                safeConfidence > 50 ? 'bg-yellow-500' : 'bg-red-500';
  
  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center">
        <div className="flex items-center gap-1">
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${color} rounded-full`} 
              style={{ width: `${safeConfidence}%` }}
            />
          </div>
          <span className="text-xs font-medium">{safeConfidence}%</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="space-y-1 text-xs">
          <p>Confidence score: {safeConfidence}%</p>
          {confidenceInterval && (
            <p>Confidence interval: [{confidenceInterval[0].toFixed(0)}% - {confidenceInterval[1].toFixed(0)}%]</p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
