
import React from 'react';
import { AgentRecommendation as AgentRecommendationType } from "@/types/agent";
import { AgentRecommendation } from './AgentRecommendation';

interface RecommendationListProps {
  recommendations: AgentRecommendationType[];
}

export const RecommendationList: React.FC<RecommendationListProps> = ({ 
  recommendations 
}) => {
  if (recommendations.length === 0) return null;
  
  return (
    <div className="space-y-2">
      {recommendations.map((rec, index) => (
        <AgentRecommendation key={index} recommendation={rec} />
      ))}
    </div>
  );
};
