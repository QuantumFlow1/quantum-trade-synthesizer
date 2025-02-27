
import { useState, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { 
  Pencil, 
  Line, 
  ArrowDown, 
  Square, 
  Circle,
  TrendingUp,
  Minus,
  X
} from "lucide-react";
import { DrawingToolType } from "./types/types";

interface DrawingToolsOverlayProps {
  containerRef: RefObject<HTMLDivElement>;
}

export const DrawingToolsOverlay = ({ containerRef }: DrawingToolsOverlayProps) => {
  const [selectedTool, setSelectedTool] = useState<DrawingToolType>("none");
  const [isDrawing, setIsDrawing] = useState(false);

  const handleToolSelect = (tool: DrawingToolType) => {
    if (selectedTool === tool) {
      // Deselect the tool if it's already selected
      setSelectedTool("none");
    } else {
      setSelectedTool(tool);
    }
  };

  // Placeholder for actual drawing implementation
  const handleStartDrawing = () => {
    if (selectedTool !== "none") {
      setIsDrawing(true);
      // Implement actual drawing logic here
    }
  };

  const handleStopDrawing = () => {
    setIsDrawing(false);
    // Finalize drawing here
  };

  return (
    <div className="absolute top-2 left-2 z-10 flex flex-col shadow-lg rounded-md bg-background/70 backdrop-blur-md border border-border">
      <div className="p-1 flex flex-col gap-1">
        <Tooltip content="Line">
          <Button 
            size="icon" 
            variant={selectedTool === "line" ? "default" : "ghost"} 
            className="h-8 w-8"
            onClick={() => handleToolSelect("line")}
          >
            <Line className="h-4 w-4" />
          </Button>
        </Tooltip>
        
        <Tooltip content="Arrow">
          <Button 
            size="icon" 
            variant={selectedTool === "arrow" ? "default" : "ghost"} 
            className="h-8 w-8"
            onClick={() => handleToolSelect("arrow")}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </Tooltip>
        
        <Tooltip content="Horizontal Line">
          <Button 
            size="icon" 
            variant={selectedTool === "horizontal" ? "default" : "ghost"} 
            className="h-8 w-8"
            onClick={() => handleToolSelect("horizontal")}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </Tooltip>
        
        <Tooltip content="Rectangle">
          <Button 
            size="icon" 
            variant={selectedTool === "rectangle" ? "default" : "ghost"} 
            className="h-8 w-8"
            onClick={() => handleToolSelect("rectangle")}
          >
            <Square className="h-4 w-4" />
          </Button>
        </Tooltip>
        
        <Tooltip content="Circle">
          <Button 
            size="icon" 
            variant={selectedTool === "circle" ? "default" : "ghost"} 
            className="h-8 w-8"
            onClick={() => handleToolSelect("circle")}
          >
            <Circle className="h-4 w-4" />
          </Button>
        </Tooltip>
        
        <Tooltip content="Fibonacci">
          <Button 
            size="icon" 
            variant={selectedTool === "fibonacci" ? "default" : "ghost"} 
            className="h-8 w-8"
            onClick={() => handleToolSelect("fibonacci")}
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
        </Tooltip>
        
        <Tooltip content="Pencil">
          <Button 
            size="icon" 
            variant={selectedTool === "pencil" ? "default" : "ghost"} 
            className="h-8 w-8"
            onClick={() => handleToolSelect("pencil")}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </Tooltip>
        
        <Tooltip content="Clear All">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
