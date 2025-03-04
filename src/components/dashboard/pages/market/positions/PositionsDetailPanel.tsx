
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import PositionsList from '@/components/trading/PositionsList';
import { PositionDetails } from './PositionDetails';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center mb-6 gap-2">
        <h2 className="text-2xl font-bold">Trading Positions</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="ml-2 flex items-center gap-1 cursor-help">
                <Info className="h-3 w-3" />
                <span>Trade Guide</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>For successful trading, always set stop losses and take profits. Monitor market volatility before opening new positions.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-primary" /> 
            Your Positions
          </h3>
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
              <div className="flex flex-col items-center gap-3">
                <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
                <p>Select a position to view detailed information</p>
                <p className="text-sm mt-2">Trading guide: Always analyze market trends before opening a position</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
