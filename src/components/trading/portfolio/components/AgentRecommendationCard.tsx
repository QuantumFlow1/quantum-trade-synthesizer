
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AgentRecommendation, AgentPerformance } from "../types/portfolioTypes";
import { ArrowDown, ArrowUp, Pause, BarChart2, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { PerformanceMetrics } from "./PerformanceMetrics";

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

export const AgentRecommendationCard: React.FC<AgentRecommendationCardProps> = ({
  recommendation,
  agentPerformance,
  accuracyData
}) => {
  const getActionColor = (action: string) => {
    switch (action) {
      case "BUY":
      case "COVER":
        return "text-green-500 bg-green-500/10";
      case "SELL":
      case "SHORT":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-yellow-500 bg-yellow-500/10";
    }
  };
  
  const getActionIcon = (action: string) => {
    switch (action) {
      case "BUY":
      case "COVER":
        return <ArrowUp className="h-4 w-4" />;
      case "SELL":
      case "SHORT":
        return <ArrowDown className="h-4 w-4" />;
      default:
        return <Pause className="h-4 w-4" />;
    }
  };
  
  // Extract the agent name from the agentId (e.g., "value-investor-001" -> "Value Investor")
  const getAgentName = (agentId: string) => {
    const parts = agentId.split('-');
    if (parts.length >= 2) {
      return parts.slice(0, -1).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    return agentId;
  };
  
  return (
    <Card className="border border-border/40 bg-background/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium text-sm">{getAgentName(recommendation.agentId)}</div>
          <div className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${getActionColor(recommendation.action)}`}>
            {getActionIcon(recommendation.action)}
            {recommendation.action}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mb-3">
          {recommendation.reasoning.length > 100 
            ? `${recommendation.reasoning.substring(0, 100)}...` 
            : recommendation.reasoning}
        </div>
        
        <div className="flex justify-between items-center">
          <ConfidenceIndicator confidence={recommendation.confidence} />
          
          {agentPerformance && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 text-xs cursor-help">
                    <BarChart2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{Math.round(agentPerformance.accuracy)}%</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="w-64 p-0" side="bottom">
                  <PerformanceMetrics 
                    agentPerformance={agentPerformance}
                    accuracyData={accuracyData}
                  />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {!agentPerformance && accuracyData && (
            <div className="flex items-center gap-1.5 text-xs">
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">{Math.round(accuracyData.overall)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
