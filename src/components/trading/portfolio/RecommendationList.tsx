
import React from 'react';
import { AgentRecommendation, AgentPerformance } from "./types/portfolioTypes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AgentRecommendationCard } from './components/AgentRecommendationCard';

interface RecommendationListProps {
  recommendations: AgentRecommendation[];
  agentPerformance?: Record<string, AgentPerformance>;
  agentAccuracy?: Record<string, {
    overall: number;
    recent: number;
    confidence: [number, number]; // Confidence interval [lower, upper]
    predictionHistory?: Array<{correct: boolean, date: string, prediction: string}>;
  }>;
}

export const RecommendationList: React.FC<RecommendationListProps> = ({ 
  recommendations,
  agentPerformance = {},
  agentAccuracy = {}
}) => {
  // Validate recommendations before processing
  const validRecommendations = recommendations?.filter(rec => 
    rec && typeof rec.confidence === 'number' && 
    ['BUY', 'SELL', 'HOLD', 'SHORT'].includes(rec.action as string)
  ) || [];
  
  // Sort recommendations by confidence (highest first)
  const sortedRecommendations = [...validRecommendations].sort((a, b) => b.confidence - a.confidence);
  
  if (!sortedRecommendations.length) {
    console.log('No valid recommendations to display');
    return null;
  }
  
  return (
    <TooltipProvider>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {sortedRecommendations.map((rec) => (
          <AgentRecommendationCard
            key={rec.agentId}
            recommendation={rec}
            agentPerformance={agentPerformance[rec.agentId]}
            accuracyData={agentAccuracy[rec.agentId]}
          />
        ))}
      </div>
    </TooltipProvider>
  );
};
