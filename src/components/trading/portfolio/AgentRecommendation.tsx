
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { AgentRecommendation as AgentRecommendationType } from "@/types/agent";

interface AgentRecommendationProps {
  recommendation: AgentRecommendationType;
}

export const AgentRecommendation: React.FC<AgentRecommendationProps> = ({ recommendation }) => {
  return (
    <div className="p-2 border border-white/10 rounded-md bg-background/50">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-1">
          <Badge className="text-xs" variant="outline">
            {recommendation.agentId.split('-')[0]}
          </Badge>
          <Badge 
            className={`text-xs ${recommendation.action === "BUY" || recommendation.action === "COVER" ? "bg-green-500/80" : 
                             recommendation.action === "SELL" || recommendation.action === "SHORT" ? "bg-red-500/80" : 
                             "bg-blue-500/80"}`}
          >
            {recommendation.action}
          </Badge>
        </div>
        <Badge className="text-xs" variant="outline">
          {recommendation.confidence}% confidence
        </Badge>
      </div>
      <p className="text-xs mt-1 text-muted-foreground">{recommendation.reasoning}</p>
    </div>
  );
};
