
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';

interface EmptyAnalysisStateProps {
  onRefreshAnalysis: () => void;
  isDisabled?: boolean;
}

export const EmptyAnalysisState: React.FC<EmptyAnalysisStateProps> = ({ 
  onRefreshAnalysis,
  isDisabled = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-gray-500/30 rounded-lg bg-gray-900/20">
      <TrendingUp className="h-10 w-10 text-gray-500 mb-3" />
      <h3 className="text-base font-medium mb-2">No Active Portfolio Analysis</h3>
      <p className="text-sm text-gray-400 mb-4 max-w-md">
        Click the button below to generate AI-powered trading recommendations based on current market conditions.
      </p>
      
      {isDisabled && (
        <div className="flex items-center gap-2 text-amber-400 text-sm mb-4">
          <AlertCircle className="h-4 w-4" />
          <span>Select a position first to enable analysis</span>
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm"
        className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
        onClick={onRefreshAnalysis}
        disabled={isDisabled}
      >
        <RefreshCw className="h-4 w-4" />
        Analyze Portfolio
      </Button>
    </div>
  );
};
