
import { useState, useRef, useEffect, RefObject } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowDownToLine,
  Circle,
  Crop,
  LineChart,
  MousePointer,
  Pencil,
  PenTool,
  RectangleHorizontal,
  Trash2,
  Undo2,
} from "lucide-react";
import { DrawingToolType } from "./types/types";

interface Point {
  x: number;
  y: number;
}

interface DrawingToolsOverlayProps {
  containerRef: RefObject<HTMLDivElement>;
}

export const DrawingToolsOverlay = ({ containerRef }: DrawingToolsOverlayProps) => {
  const [activeTool, setActiveTool] = useState<DrawingToolType>("none");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [drawings, setDrawings] = useState<{ tool: DrawingToolType; start: Point; end: Point }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeDrawingRef = useRef<{ tool: DrawingToolType; start: Point; end: Point } | null>(null);

  // Set up canvas
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const resizeObserver = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      redrawCanvas();
    });

    resizeObserver.observe(container);
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  // Redraw all drawings
  const redrawCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all saved drawings
    drawings.forEach((drawing) => {
      drawShape(ctx, drawing.tool, drawing.start, drawing.end);
    });

    // Draw the active drawing
    if (activeDrawingRef.current) {
      drawShape(
        ctx,
        activeDrawingRef.current.tool,
        activeDrawingRef.current.start,
        activeDrawingRef.current.end
      );
    }
  };

  // Draw a shape based on the selected tool
  const drawShape = (
    ctx: CanvasRenderingContext2D,
    tool: DrawingToolType,
    start: Point,
    end: Point
  ) => {
    if (tool === "none") return;
    
    ctx.strokeStyle = "#3b82f6"; // Blue color
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    switch (tool) {
      case "line":
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        break;
      case "arrow":
        drawArrow(ctx, start, end);
        break;
      case "horizontal":
        ctx.beginPath();
        ctx.moveTo(0, start.y);
        ctx.lineTo(ctx.canvas.width, start.y);
        ctx.stroke();
        break;
      case "rectangle":
        drawRectangle(ctx, start, end);
        break;
      case "circle":
        drawCircle(ctx, start, end);
        break;
      case "fibonacci":
        drawFibonacci(ctx, start, end);
        break;
      case "pencil":
        // Freehand drawing is handled differently
        break;
    }
  };

  // Helper functions for different shapes
  const drawArrow = (ctx: CanvasRenderingContext2D, start: Point, end: Point) => {
    const headLength = 10;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);

    // Line
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - headLength * Math.cos(angle - Math.PI / 6),
      end.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      end.x - headLength * Math.cos(angle + Math.PI / 6),
      end.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = "#3b82f6";
    ctx.fill();
  };

  const drawRectangle = (ctx: CanvasRenderingContext2D, start: Point, end: Point) => {
    const width = end.x - start.x;
    const height = end.y - start.y;
    ctx.beginPath();
    ctx.rect(start.x, start.y, width, height);
    ctx.stroke();
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, start: Point, end: Point) => {
    const radius = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );
    ctx.beginPath();
    ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const drawFibonacci = (ctx: CanvasRenderingContext2D, start: Point, end: Point) => {
    const height = end.y - start.y;
    const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];

    // Main trend line
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // Fibonacci levels
    levels.forEach((level) => {
      const y = start.y + height * level;
      ctx.beginPath();
      ctx.setLineDash([2, 2]);
      ctx.moveTo(start.x - 50, y); // Extend a bit to the left
      ctx.lineTo(end.x + 50, y); // Extend a bit to the right
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.font = "10px Arial";
      ctx.fillStyle = "#3b82f6";
      ctx.fillText(`${(level * 100).toFixed(1)}%`, end.x + 5, y);
    });
  };

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === "none") return;
    
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setStartPoint({ x, y });
    setEndPoint({ x, y });
    
    // Start tracking the active drawing
    activeDrawingRef.current = {
      tool: activeTool,
      start: { x, y },
      end: { x, y },
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !startPoint) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setEndPoint({ x, y });
    
    // Update the active drawing
    if (activeDrawingRef.current && startPoint) {
      activeDrawingRef.current.end = { x, y };
      redrawCanvas();
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !startPoint || !endPoint) return;
    
    // Add the completed drawing to the list
    if (activeTool !== "none") {
      setDrawings([
        ...drawings,
        { tool: activeTool, start: startPoint, end: endPoint },
      ]);
    }
    
    setIsDrawing(false);
    activeDrawingRef.current = null;
    redrawCanvas();
  };

  const handleMouseLeave = () => {
    if (isDrawing) {
      handleMouseUp();
    }
  };

  // Tool selection and clearing
  const handleToolSelect = (tool: DrawingToolType) => {
    setActiveTool(tool === activeTool ? "none" : tool);
  };

  const handleClear = () => {
    setDrawings([]);
    redrawCanvas();
  };

  const handleUndo = () => {
    if (drawings.length > 0) {
      setDrawings(drawings.slice(0, -1));
      redrawCanvas();
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 ${activeTool !== "none" ? "pointer-events-auto" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      
      <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm p-1 rounded-md border shadow-md pointer-events-auto">
        <div className="flex flex-col gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={activeTool === "none" ? "default" : "secondary"}
                  className="h-8 w-8"
                  onClick={() => setActiveTool("none")}
                >
                  <MousePointer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Select (no drawing)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={activeTool === "line" ? "default" : "secondary"}
                  className="h-8 w-8"
                  onClick={() => handleToolSelect("line")}
                >
                  <LineChart className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Trendline</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={activeTool === "arrow" ? "default" : "secondary"}
                  className="h-8 w-8"
                  onClick={() => handleToolSelect("arrow")}
                >
                  <ArrowDownToLine className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Arrow</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={activeTool === "horizontal" ? "default" : "secondary"}
                  className="h-8 w-8"
                  onClick={() => handleToolSelect("horizontal")}
                >
                  <Crop className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Horizontal Line</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={activeTool === "rectangle" ? "default" : "secondary"}
                  className="h-8 w-8"
                  onClick={() => handleToolSelect("rectangle")}
                >
                  <RectangleHorizontal className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Rectangle</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={activeTool === "circle" ? "default" : "secondary"}
                  className="h-8 w-8"
                  onClick={() => handleToolSelect("circle")}
                >
                  <Circle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Circle</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={activeTool === "fibonacci" ? "default" : "secondary"}
                  className="h-8 w-8"
                  onClick={() => handleToolSelect("fibonacci")}
                >
                  <PenTool className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Fibonacci</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={activeTool === "pencil" ? "default" : "secondary"}
                  className="h-8 w-8"
                  onClick={() => handleToolSelect("pencil")}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Freehand</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm p-1 rounded-md border shadow-md pointer-events-auto">
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={handleUndo}
                  disabled={drawings.length === 0}
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={handleClear}
                  disabled={drawings.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear All</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
