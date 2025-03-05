
import { Wifi, Brain, TrendingUp, AlertTriangle, Users } from "lucide-react";

interface OnlinePanelProps {
  analysis: {
    confidence: number;
    riskLevel: string;
    recommendation: string;
    expectedProfit: string;
    collaboratingAgents: string[];
  };
}

export const OnlinePanel = ({ analysis }: OnlinePanelProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium">AI Trading Analyse</h3>
        </div>
        <div className="flex items-center gap-2 text-green-400">
          <Wifi className="w-4 h-4" />
          <span className="text-sm">Online</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span>Vertrouwen: {analysis.confidence}%</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span>Risico: {analysis.riskLevel}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div>Verwachte winst: {analysis.expectedProfit}</div>
          <div>Aanbeveling: {analysis.recommendation}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>Samenwerkende AI Agents: {analysis.collaboratingAgents.join(", ")}</span>
      </div>
    </>
  );
};
