
import React from 'react';
import { Brain, BarChart3, AlertTriangle, TrendingUp } from "lucide-react";
import { AgentRecommendation } from "@/types/agent";
import { AgentPerformance } from "../types/portfolioTypes";
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { RecommendationAction } from './RecommendationAction';
import { PerformanceMetrics } from './PerformanceMetrics';

interface AgentRecommendationCardProps {
  recommendation: AgentRecommendation;
  agentPerformance?: AgentPerformance;
  accuracyData?: {
    overall: number;
    recent: number;
    confidence: [number, number];
    predictionHistory?: Array<{correct: boolean, date: string, prediction: string}>;
  };
}

// Map agent IDs to their type/specialization
const agentTypeMap: Record<string, { name: string, icon: React.ElementType, color: string }> = {
  "value-investor": { 
    name: "Value Investor", 
    icon: Brain, 
    color: "bg-blue-500" 
  },
  "technical-analyst": { 
    name: "Technical Analyst", 
    icon: BarChart3, 
    color: "bg-purple-500" 
  },
  "sentiment-analyzer": { 
    name: "Sentiment Analyzer", 
    icon: Brain, 
    color: "bg-pink-500" 
  },
  "risk-manager": { 
    name: "Risk Manager", 
    icon: AlertTriangle, 
    color: "bg-yellow-500" 
  },
  "volatility-expert": { 
    name: "Volatility Expert", 
    icon: BarChart3, 
    color: "bg-cyan-500" 
  },
  "macro-economist": { 
    name: "Macro Economist", 
    icon: TrendingUp, 
    color: "bg-green-500" 
  }
};

export const AgentRecommendationCard: React.FC<AgentRecommendationCardProps> = ({ 
  recommendation,
  agentPerformance,
  accuracyData
}) => {
  const agentType = agentTypeMap[recommendation.agentId] || { 
    name: recommendation.agentId, 
    icon: Brain, 
    color: "bg-gray-500" 
  };
  
  const AgentIcon = agentType.icon;
  const performanceScore = agentPerformance ? agentPerformance.successRate : 0;
  const confidenceInterval = accuracyData?.confidence || [0, 0];
  
  return (
    <div 
      key={recommendation.agentId} 
      className="p-3 bg-card rounded-md border border-border hover:border-primary/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${agentType.color} bg-opacity-20`}>
            <AgentIcon className="h-4 w-4 text-foreground" />
          </div>
          <div className="font-medium text-sm">{agentType.name}</div>
        </div>
        <div className="flex items-center gap-2">
          <RecommendationAction action={recommendation.action} />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        {/* First row - Confidence */}
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Confidence:
          </div>
          <ConfidenceIndicator confidence={recommendation.confidence} confidenceInterval={confidenceInterval} />
        </div>
        
        {/* Performance metrics */}
        <PerformanceMetrics performanceScore={performanceScore} accuracyData={accuracyData} />
      </div>
      
      <p className="text-xs text-muted-foreground">{recommendation.reasoning}</p>
    </div>
  );
};
