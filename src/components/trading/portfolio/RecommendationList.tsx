
import React from 'react';
import { AgentRecommendation, TradingAgent } from "@/types/agent";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, TrendingDown, Pause, AlertTriangle, BarChart3, Percent, History, Target } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AgentPerformance } from "./types/portfolioTypes";

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

export const RecommendationList: React.FC<RecommendationListProps> = ({ 
  recommendations,
  agentPerformance = {},
  agentAccuracy = {}
}) => {
  // Function to get action icon
  const getActionIcon = (action: string) => {
    switch (action) {
      case "BUY":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "SELL":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "HOLD":
        return <Pause className="h-4 w-4 text-yellow-500" />;
      default:
        return <Brain className="h-4 w-4 text-primary" />;
    }
  };
  
  // Sort recommendations by confidence (highest first)
  const sortedRecommendations = [...recommendations].sort((a, b) => b.confidence - a.confidence);
  
  if (!sortedRecommendations.length) return null;
  
  return (
    <TooltipProvider>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {sortedRecommendations.map((rec) => {
          const agentType = agentTypeMap[rec.agentId] || { 
            name: rec.agentId, 
            icon: Brain, 
            color: "bg-gray-500" 
          };
          const AgentIcon = agentType.icon;
          const performance = agentPerformance[rec.agentId];
          const performanceScore = performance ? performance.successRate : 0;
          const accuracyData = agentAccuracy[rec.agentId];
          const confidenceInterval = accuracyData?.confidence || [0, 0];
          
          return (
            <div 
              key={rec.agentId} 
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
                  <Badge 
                    variant={rec.action === "BUY" ? "success" : rec.action === "SELL" ? "destructive" : "outline"}
                    className="flex gap-1 items-center"
                  >
                    {getActionIcon(rec.action)}
                    {rec.action}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                {/* First row - Confidence & Performance */}
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    Confidence:
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`absolute left-0 top-0 h-full rounded-full ${
                          rec.confidence > 75 ? 'bg-green-500' : 
                          rec.confidence > 50 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${rec.confidence}%` }}
                      />
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs font-medium flex items-center gap-1 cursor-help">
                          {rec.confidence}%
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
                </div>
                
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
                
                {/* Second row - Accuracy Metrics */}
                {accuracyData && (
                  <>
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
                )}
              </div>
              
              <p className="text-xs text-muted-foreground">{rec.reasoning}</p>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
