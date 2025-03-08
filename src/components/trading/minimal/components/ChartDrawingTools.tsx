
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Pencil, 
  LineChart, 
  TrendingUp,
  Scissors,
  Circle, 
  Square, 
  ArrowUpDown,
  Eraser, 
  MousePointer,
  Type
} from "lucide-react";
import { useState } from "react";

const tools = [
  { id: "pointer", icon: MousePointer, label: "Pointer" },
  { id: "pencil", icon: Pencil, label: "Free Draw" },
  { id: "line", icon: LineChart, label: "Line" },
  { id: "horizontal", icon: ArrowUpDown, label: "Horizontal Line" },
  { id: "trend", icon: TrendingUp, label: "Trend Line" },
  { id: "fibonacci", icon: Scissors, label: "Fibonacci" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "rectangle", icon: Square, label: "Rectangle" },
  { id: "text", icon: Type, label: "Text" },
  { id: "eraser", icon: Eraser, label: "Eraser" },
];

export const ChartDrawingTools = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  
  const handleSelectTool = (toolId: string) => {
    if (activeTool === toolId) {
      setActiveTool(null);
    } else {
      setActiveTool(toolId);
    }
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={activeTool ? "bg-muted" : ""}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Drawing Tools
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="end">
        <div className="grid grid-cols-5 gap-1">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant={activeTool === tool.id ? "default" : "ghost"}
                size="sm"
                className="flex flex-col items-center h-auto py-2 px-1"
                onClick={() => handleSelectTool(tool.id)}
              >
                <Icon className="h-4 w-4 mb-1" />
                <span className="text-xs">{tool.label}</span>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground text-center">
          Select a tool and then click and drag on the chart
        </div>
      </PopoverContent>
    </Popover>
  );
};
