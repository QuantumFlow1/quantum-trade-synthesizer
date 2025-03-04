
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { PositionsDetailPanel } from '../positions/PositionsDetailPanel';

interface PositionsTabProps {
  positions: any[];
  isLoading: boolean;
  showCharts: boolean;
  toggleChartsVisibility: () => void;
}

export const PositionsTab: React.FC<PositionsTabProps> = ({
  positions,
  isLoading,
  showCharts,
  toggleChartsVisibility
}) => {
  return (
    <>
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleChartsVisibility}
          className="flex items-center gap-2"
        >
          {showCharts ? (
            <>
              <EyeOff className="h-4 w-4" />
              <span>Hide Charts</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span>Show Charts</span>
            </>
          )}
        </Button>
      </div>
      <PositionsDetailPanel 
        positions={positions} 
        isLoading={isLoading} 
        showCharts={showCharts}
      />
    </>
  );
};
