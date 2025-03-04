
import React from 'react';
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp } from "lucide-react";

interface EmptyAnalysisStateProps {
  onRefreshAnalysis: () => void;
  isDisabled: boolean;
}

export const EmptyAnalysisState: React.FC<EmptyAnalysisStateProps> = ({ 
  onRefreshAnalysis,
  isDisabled
}) => {
  return (
    <div className="p-6 text-center">
      <Brain className="h-8 w-8 text-primary/50 mx-auto mb-2" />
      <h3 className="text-sm font-medium mb-1">No Active Analysis</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Generate AI trading recommendations and portfolio decisions
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefreshAnalysis}
        disabled={isDisabled}
      >
        <TrendingUp className="h-4 w-4 mr-2" />
        Analyze Market
      </Button>
    </div>
  );
};
