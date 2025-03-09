
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ZoomIn, ZoomOut, Minimize2 } from 'lucide-react';
import { PositionsDetailPanel } from '../positions/PositionsDetailPanel';
import { useZoomControls } from '@/hooks/use-zoom-controls';

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
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls();
  const formattedScale = scale.toFixed(1);
  
  return (
    <div className="relative">
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-secondary/30 backdrop-blur-sm rounded-md px-3 py-1 flex items-center gap-2 text-sm">
            <span>Zoom: {formattedScale}x</span>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full" 
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full" 
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full" 
                onClick={handleResetZoom}
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        
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
      
      <div 
        className="overflow-auto transition-all duration-300"
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: "top left",
          height: scale > 1 ? `calc(80vh * ${scale})` : "auto",
          paddingBottom: scale > 1 ? "2rem" : 0
        }}
      >
        <PositionsDetailPanel 
          positions={positions} 
          isLoading={isLoading} 
          showCharts={showCharts}
        />
      </div>
      
      <div className="text-xs text-muted-foreground mt-2">
        <p>Use mouse wheel while holding Ctrl to zoom or pinch on touch devices.</p>
      </div>
    </div>
  );
};
