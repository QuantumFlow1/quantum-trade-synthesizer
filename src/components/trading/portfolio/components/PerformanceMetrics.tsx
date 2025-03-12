
import React from 'react';
import { AgentPerformance } from "../types/portfolioTypes";

export interface PerformanceMetricsProps {
  agentPerformance: AgentPerformance;
  accuracyData?: {
    overall: number;
    recent: number;
    confidence: [number, number];
    predictionHistory?: Array<{correct: boolean, date: string, prediction: string}>;
  };
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  agentPerformance,
  accuracyData
}) => {
  return (
    <div className="p-3 bg-background">
      <div className="text-sm font-medium mb-2 pb-1 border-b">Agent Performance</div>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Accuracy:</span>
          <span className="font-medium">{Math.round(agentPerformance.accuracy * 100)}%</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Profit Factor:</span>
          <span className="font-medium">{agentPerformance.profitFactor.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Recent Success:</span>
          <div className="flex gap-1">
            {agentPerformance.recentSuccess.map((success, i) => (
              <div 
                key={i} 
                className={`h-2 w-2 rounded-full ${success ? 'bg-green-500' : 'bg-red-500'}`}
              />
            ))}
          </div>
        </div>
        
        {accuracyData && (
          <div className="flex justify-between mt-1 pt-1 border-t">
            <span className="text-muted-foreground">Confidence Range:</span>
            <span className="font-medium">
              {Math.round(accuracyData.confidence[0])}%-{Math.round(accuracyData.confidence[1])}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
