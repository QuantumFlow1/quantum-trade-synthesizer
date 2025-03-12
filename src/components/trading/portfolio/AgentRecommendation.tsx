
import React from 'react';
import { AgentRecommendation as AgentRecommendationType } from "@/types/agent";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";

export const AgentRecommendation = ({ recommendation }: { recommendation: AgentRecommendationType }) => {
  // Display only the agent type from the full ID (e.g., 'value-investor-001' -> 'value-investor')
  const agentType = recommendation.agentId.split('-').slice(0, -1).join('-');

  const getActionColor = (action: string) => {
    if (action === "BUY" || action === "COVER") {
      return "bg-green-500/80 text-white";
    } else if (action === "SELL" || action === "SHORT") {
      return "bg-red-500/80 text-white";
    } else {
      return "bg-blue-500/80 text-white";
    }
  };
  
  // Get confidence level styling
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 75) return "text-green-500";
    if (confidence > 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-card/50 backdrop-blur-sm p-3 pb-1">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium flex items-center gap-1.5">
            {agentType}
          </CardTitle>
          <Badge variant="outline" className={`${getActionColor(recommendation.action)}`}>
            {recommendation.action}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Ticker: {recommendation.ticker}
          {recommendation.price && ` | Price: $${recommendation.price.toLocaleString()}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <div className="flex justify-between mb-2">
          <span className="text-xs text-muted-foreground">Confidence:</span>
          <span className={`text-xs font-medium ${getConfidenceColor(recommendation.confidence)}`}>
            {recommendation.confidence}% confidence
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {recommendation.reasoning}
        </p>
      </CardContent>
    </Card>
  );
};
