
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Minimize2, Maximize2 } from "lucide-react";

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export const ZoomControls = ({ scale, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
      >
        {scale !== 1 ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </Button>
    </div>
  );
};
