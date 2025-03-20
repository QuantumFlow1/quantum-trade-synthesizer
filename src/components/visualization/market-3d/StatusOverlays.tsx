
import React from 'react';

interface StatusOverlaysProps {
  isSimulationMode: boolean;
  viewMode: 'default' | 'volume' | 'price';
}

export const StatusOverlays: React.FC<StatusOverlaysProps> = ({ 
  isSimulationMode, 
  viewMode 
}) => {
  return (
    <>
      {/* Data source indicator */}
      <div className="absolute top-2 left-2 bg-background/40 backdrop-blur-sm px-2 py-1 rounded text-xs text-foreground/80">
        {isSimulationMode ? 'Simulated Data' : 'Live Market Data'} • {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
      </div>
      
      {/* Instruction overlay */}
      <div className="absolute bottom-2 left-2 text-xs text-foreground/70 bg-background/20 backdrop-blur-sm px-2 py-1 rounded">
        Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
    </>
  );
};
