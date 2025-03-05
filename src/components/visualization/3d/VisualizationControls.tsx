
import { Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";

interface VisualizationControlsProps {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isSimulationMode?: boolean;
}

export const VisualizationControls = ({
  isFullscreen,
  toggleFullscreen,
  isSimulationMode = false
}: VisualizationControlsProps) => {
  return (
    <div className="flex justify-between items-center p-2 bg-black/50 border-b border-gray-800">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <span className="font-medium text-gray-200">Market 3D View</span>
        {isSimulationMode && (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Simulation
          </Badge>
        )}
      </div>
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="h-7 px-2 bg-gray-800/50 hover:bg-gray-700/50 border-gray-700"
          onClick={toggleFullscreen}
        >
          <Maximize className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
