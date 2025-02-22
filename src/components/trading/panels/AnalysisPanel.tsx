
import { AIAnalysisCard } from "../AIAnalysisCard";
import { Button } from "@/components/ui/button";

interface AnalysisPanelProps {
  aiAnalysis: any;
  onBulkOrderClick: () => void;
}

export const AnalysisPanel = ({ aiAnalysis, onBulkOrderClick }: AnalysisPanelProps) => {
  return (
    <div className="space-y-6">
      <AIAnalysisCard analysis={aiAnalysis} />
      <Button 
        variant="outline" 
        onClick={onBulkOrderClick}
      >
        Bulk Order
      </Button>
    </div>
  );
};
