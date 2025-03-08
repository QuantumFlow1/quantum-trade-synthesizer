
import React from 'react';
import { AgentRecommendation } from "@/types/agent";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, TrendingDown, Pause, AlertTriangle, BarChart3 } from "lucide-react";

interface RecommendationListProps {
  recommendations: AgentRecommendation[];
  agentPerformance?: Record<string, number>;
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
  agentPerformance = {}
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
  
  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
      {sortedRecommendations.map((rec) => {
        const agentType = agentTypeMap[rec.agentId] || { 
          name: rec.agentId, 
          icon: Brain, 
          color: "bg-gray-500" 
        };
        const AgentIcon = agentType.icon;
        const performanceScore = agentPerformance[rec.agentId] || 0;
        
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
                
                {performanceScore > 0 && (
                  <div className="text-xs px-2 py-0.5 rounded bg-secondary">
                    {performanceScore}% success
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-muted-foreground">
                Confidence:
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full rounded-full ${
                      rec.confidence > 75 ? 'bg-green-500' : 
                      rec.confidence > 50 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${rec.confidence}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{rec.confidence}%</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">{rec.reasoning}</p>
          </div>
        );
      })}
    </div>
  );
};
