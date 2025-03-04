
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Minimize2, Maximize2 } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

interface ZoomControlsProps {
  scale?: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export const ZoomControls = ({ scale = 1, onZoomIn, onZoomOut, onResetZoom }: ZoomControlsProps) => {
  // Format scale for display (e.g., 1.0 or 1.5)
  const formattedScale = scale.toFixed(1);
  
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      <div className="absolute right-full mr-3 bg-black/60 text-white px-2 py-1 rounded text-xs bottom-[40px] min-w-[40px] text-center backdrop-blur-md">
        {formattedScale}x
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 relative group"
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
        <span className="absolute right-full mr-2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Zoom In
        </span>
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 relative group"
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
        <span className="absolute right-full mr-2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Zoom Out
        </span>
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onResetZoom}
        className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 relative group"
        title={scale !== 1 ? "Reset Zoom" : "Default Size"}
      >
        {scale !== 1 ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        <span className="absolute right-full mr-2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {scale !== 1 ? "Reset Zoom" : "Default Size"}
        </span>
      </Button>
    </div>
  );
};
