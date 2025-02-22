
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface AIAnalysis {
  confidence: number;
  recommendation: string;
  expectedProfit: string;
  riskLevel: string;
  collaboratingAgents: string[];
}

interface AnalysisDisplayProps {
  analysis: AIAnalysis | null;
}

export const AnalysisDisplay = ({ analysis }: AnalysisDisplayProps) => {
  if (!analysis) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Last Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <span>Confidence: {analysis.confidence}%</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span>Recommendation: {analysis.recommendation}</span>
        </div>
      </div>
    </div>
  );
};

