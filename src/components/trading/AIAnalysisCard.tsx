
import React from "react";
import { Brain, TrendingUp, AlertTriangle, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AIAnalysis {
  confidence: number;
  riskLevel: string;
  recommendation: string;
  expectedProfit: string;
  collaboratingAgents: string[];
}

interface AIAnalysisCardProps {
  analysis: AIAnalysis;
}

export const AIAnalysisCard = ({ analysis }: AIAnalysisCardProps) => {
  const getRecommendationColor = (recommendation: string) => {
    return recommendation.toLowerCase() === 'long' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <Card className="p-4 bg-secondary/10 backdrop-blur-xl border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium">AI Trading Analysis</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span>Confidence: {analysis.confidence}%</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span>Risk Level: {analysis.riskLevel}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className={`flex items-center gap-2 ${getRecommendationColor(analysis.recommendation)}`}>
            Recommendation: {analysis.recommendation.toUpperCase()}
          </div>
          <div className="text-green-400">
            Expected Profit: {analysis.expectedProfit}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>Collaborating AI Agents: {analysis.collaboratingAgents.join(", ")}</span>
      </div>
    </Card>
  );
};

