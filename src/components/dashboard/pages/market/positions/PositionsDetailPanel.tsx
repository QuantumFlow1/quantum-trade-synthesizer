
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import PositionsList from '@/components/trading/PositionsList';
import { PositionDetails } from './PositionDetails';

interface PositionsDetailPanelProps {
  positions: any[];
  isLoading: boolean;
  showCharts: boolean;
}

export const PositionsDetailPanel: React.FC<PositionsDetailPanelProps> = ({ 
  positions, 
  isLoading,
  showCharts
}) => {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Your Positions</h3>
        <PositionsList 
          positions={positions} 
          isLoading={isLoading} 
          onPositionSelect={(id) => setSelectedPosition(id)}
          selectedPositionId={selectedPosition}
        />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-4">Position Details</h3>
        {selectedPosition ? (
          <PositionDetails 
            position={positions.find(p => p.id === selectedPosition)} 
            showCharts={showCharts}
          />
        ) : (
          <Card className="p-6 text-center text-muted-foreground">
            <p>Select a position to view detailed information</p>
          </Card>
        )}
      </div>
    </div>
  );
};
