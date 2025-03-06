
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { Eye, EyeOff, RotateCcw, LucideZoomIn, LucideZoomOut, Maximize2, Box } from "lucide-react";

export const VisualizationControls = () => {
  const [showPrices, setShowPrices] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const theme = useThemeDetection();
  
  // This is a UI component, the actual control logic would be implemented
  // via a context or props in a real implementation
  
  const controlClass = "flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 text-primary-foreground transition-colors";

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={controlClass}
                onClick={() => setShowPrices(!showPrices)}
              >
                {showPrices ? <Eye size={16} /> : <EyeOff size={16} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{showPrices ? "Hide Price Bars" : "Show Price Bars"}</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={controlClass}
                onClick={() => setShowVolume(!showVolume)}
              >
                <Box size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{showVolume ? "Hide Volume Indicators" : "Show Volume Indicators"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className={controlClass}>
                <LucideZoomIn size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className={controlClass}>
                <LucideZoomOut size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className={controlClass}>
                <RotateCcw size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Reset View</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className={controlClass}>
                <Maximize2 size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Fullscreen</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};
