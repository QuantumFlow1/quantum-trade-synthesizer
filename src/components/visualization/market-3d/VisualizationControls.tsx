
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ZoomIn, ZoomOut, RotateCcw, Eye } from 'lucide-react';

interface VisualizationControlsProps {
  viewMode: 'default' | 'volume' | 'price';
  dataDensity: number;
  onResetView: () => void;
  onCycleViewMode: () => void;
  onIncreaseDataDensity: () => void;
  onDecreaseDataDensity: () => void;
  onRefresh: () => void;
}

export const VisualizationControls: React.FC<VisualizationControlsProps> = ({
  viewMode,
  onResetView,
  onCycleViewMode,
  onIncreaseDataDensity,
  onDecreaseDataDensity,
  onRefresh
}) => {
  return (
    <div className="absolute bottom-4 right-4 flex gap-2">
      <Button
        variant="secondary"
        size="sm"
        className="bg-background/20 backdrop-blur-sm hover:bg-background/40"
        onClick={onResetView}
        title="Reset View"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      
      <Button
        variant="secondary"
        size="sm"
        className="bg-background/20 backdrop-blur-sm hover:bg-background/40"
        onClick={onCycleViewMode}
        title={`Current: ${viewMode} mode - Click to change`}
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      <Button
        variant="secondary"
        size="sm"
        className="bg-background/20 backdrop-blur-sm hover:bg-background/40"
        onClick={onIncreaseDataDensity}
        title="Increase Data Detail"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button
        variant="secondary"
        size="sm"
        className="bg-background/20 backdrop-blur-sm hover:bg-background/40"
        onClick={onDecreaseDataDensity}
        title="Decrease Data Detail"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <Button
        variant="secondary"
        size="sm"
        className="bg-background/20 backdrop-blur-sm hover:bg-background/40"
        onClick={onRefresh}
        title="Refresh View"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};
