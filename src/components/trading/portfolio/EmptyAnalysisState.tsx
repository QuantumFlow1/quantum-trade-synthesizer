
import React from 'react';
import { Brain, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyAnalysisStateProps {
  onRefreshAnalysis: () => void;
  isDisabled?: boolean;
}

export const EmptyAnalysisState: React.FC<EmptyAnalysisStateProps> = ({ 
  onRefreshAnalysis,
  isDisabled = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
      <Brain className="h-12 w-12 text-muted-foreground opacity-50" />
      <div>
        <h3 className="text-lg font-medium mb-1">No active T.S.A.A. analysis</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Generate trading recommendations from our T.S.A.A. (Trading Strategie Advies Agents) to assist with your trading decisions.
        </p>
      </div>
      <Button
        onClick={onRefreshAnalysis}
        disabled={isDisabled}
        variant="outline"
        className="gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Generate Analysis
      </Button>
      {isDisabled && (
        <p className="text-xs text-muted-foreground">
          Market data not available. Please select a trading pair first.
        </p>
      )}
    </div>
  );
};
