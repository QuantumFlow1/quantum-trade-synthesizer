
import { Brain, TrendingUp, AlertTriangle, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AIAnalysisPanelProps {
  aiAnalysis: {
    confidence: number;
    riskLevel: string;
    recommendation: string;
    expectedProfit: string;
    stopLossRecommendation: number;
    takeProfitRecommendation: number;
    collaboratingAgents: string[];
  };
}

export const AIAnalysisPanel = ({ aiAnalysis }: AIAnalysisPanelProps) => {
  return (
    <Card className="p-4 bg-secondary/10 backdrop-blur-xl border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium">AI Trading Analyse</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span>Vertrouwen: {aiAnalysis.confidence}%</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span>Risico: {aiAnalysis.riskLevel}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div>Verwachte winst: {aiAnalysis.expectedProfit}</div>
          <div>Aanbeveling: {aiAnalysis.recommendation}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>Samenwerkende AI Agents: {aiAnalysis.collaboratingAgents.join(", ")}</span>
      </div>
    </Card>
  );
};
