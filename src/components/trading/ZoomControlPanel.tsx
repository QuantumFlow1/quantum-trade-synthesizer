
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Minus, RotateCcw } from "lucide-react";

interface ZoomControlPanelProps {
  scale: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
}

export const ZoomControlPanel: React.FC<ZoomControlPanelProps> = ({
  scale,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom
}) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomOut}
        disabled={scale <= 0.5}
        className="h-8 w-8"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleResetZoom}
        className="h-8"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset Zoom
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomIn}
        disabled={scale >= 1.5}
        className="h-8 w-8"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground ml-2">
        {Math.round(scale * 100)}%
      </span>
    </div>
  );
};
