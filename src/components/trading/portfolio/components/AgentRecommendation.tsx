
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Info, Clock } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface AgentRecommendationProps {
  recommendation: {
    agentId: string;
    action: "BUY" | "SELL" | "HOLD";
    ticker: string;
    confidence: number;
    reasoning: string;
    timestamp: string;
  };
  agent: {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    weight: number;
  };
  accuracy?: {
    overall: number;
    recent: number;
    predictionHistory?: Array<{
      prediction: string;
      correct: boolean;
      date: string;
      price?: number;
    }>;
    profitLoss?: {
      percentReturn: number;
      absoluteReturn: number;
    };
  };
  hasRealMarketData?: boolean;
}

export const AgentRecommendation: React.FC<AgentRecommendationProps> = ({
  recommendation,
  agent,
  accuracy,
  hasRealMarketData = false
}) => {
  const getActionColor = (action: string) => {
    switch (action) {
      case "BUY": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "SELL": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "HOLD": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200";
    }
  };
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-amber-600";
    return "text-slate-600";
  };
  
  const getAccuracyColor = (accuracyValue: number) => {
    if (accuracyValue >= 70) return "text-green-600";
    if (accuracyValue >= 50) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
              {agent.icon}
            </span>
            <CardTitle className="text-sm font-medium">{agent.name}</CardTitle>
          </div>
          <Badge variant="outline" className={getActionColor(recommendation.action)}>
            {recommendation.action} {recommendation.ticker}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm pt-0">
        <p className="text-slate-600 dark:text-slate-400 mb-3">
          {recommendation.reasoning}
        </p>
        
        <div className="flex flex-col space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Info size={12} /> Confidence:
            </span>
            <span className={`font-medium ${getConfidenceColor(recommendation.confidence)}`}>
              {recommendation.confidence}%
            </span>
          </div>
          
          {accuracy && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <ThumbsUp size={12} /> Overall accuracy:
                </span>
                <span className={`font-medium ${getAccuracyColor(accuracy.overall)}`}>
                  {accuracy.overall}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <ThumbsUp size={12} /> Recent accuracy:
                </span>
                <span className={`font-medium ${getAccuracyColor(accuracy.recent)}`}>
                  {accuracy.recent}%
                </span>
              </div>
              
              {accuracy.profitLoss && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Info size={12} /> Backtest return:
                  </span>
                  <span className={`font-medium ${accuracy.profitLoss.percentReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {accuracy.profitLoss.percentReturn >= 0 ? '+' : ''}{accuracy.profitLoss.percentReturn.toFixed(2)}%
                  </span>
                </div>
              )}
            </>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock size={12} /> Generated:
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              {formatDistanceToNow(new Date(recommendation.timestamp), { addSuffix: true })}
            </span>
          </div>
          
          {hasRealMarketData && (
            <div className="mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 text-[10px]">
                Using real market data
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
