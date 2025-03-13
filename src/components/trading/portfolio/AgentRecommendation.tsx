
import React from 'react';
import { AgentRecommendation as AgentRecommendationType } from '@/types/agent';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface AgentRecommendationProps {
  recommendation: AgentRecommendationType;
}

export function AgentRecommendation({ recommendation }: AgentRecommendationProps) {
  // Format agent ID for display
  const formattedAgentId = recommendation.agentId
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  
  // Determine badge color based on action
  const getBadgeColor = () => {
    if (recommendation.action === "BUY") return "bg-green-500/80";
    if (recommendation.action === "SELL" || recommendation.action === "COVER") return "bg-red-500/80";
    if (recommendation.action === "HOLD") return "bg-blue-500/80";
    if (recommendation.action === "SHORT") return "bg-purple-500/80";
    return "bg-gray-500/80";
  };

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium text-sm text-gray-900">{formattedAgentId}</h3>
            <Badge variant="secondary" className={`${getBadgeColor()} text-white`}>
              {recommendation.action}
            </Badge>
            <p className="text-xs text-gray-500 font-medium mt-1">
              {recommendation.confidence}% confidence
            </p>
          </div>
        </div>
        
        <p className="text-sm mt-2 text-gray-700">
          {recommendation.reasoning}
        </p>
      </CardContent>
    </Card>
  );
}
