
import { useState, useRef, useEffect, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, TrendingUp, Ruler, Square, Circle, MinusIcon, UndoIcon, RedoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface Point {
  x: number;
  y: number;
}

interface DrawingShape {
  id: string;
  type: "line" | "arrow" | "horizontal" | "rectangle" | "circle" | "fibonacci" | "pencil";
  points: Point[];
  color: string;
  lineWidth: number;
}

interface DrawingToolsOverlayProps {
  containerRef: RefObject<HTMLDivElement>;
}

export const DrawingToolsOverlay = ({ containerRef }: DrawingToolsOverlayProps) => {
  const [selectedTool, setSelectedTool] = useState<"none" | "line" | "arrow" | "horizontal" | "rectangle" | "circle" | "fibonacci" | "pencil">("none");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [shapes, setShapes] = useState<DrawingShape[]>([]);
  const [history, setHistory] = useState<DrawingShape[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawingShape[][]>([]);
  const [pencilPoints, setPencilPoints] = useState<Point[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingColor = "#4ade80";
  const lineWidth = 2;

  // Initialize canvas when component mounts
  useEffect(() => {
    if (containerRef.current) {
      const canvas = document.createElement("canvas");
      canvas.className = "absolute inset-0 z-10 pointer-events-auto";
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
      
      if (canvasRef.current) {
        containerRef.current.removeChild(canvasRef.current);
      }
      
      containerRef.current.appendChild(canvas);
      canvasRef.current = canvas;
      
      // Add event listeners
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);
      
      // Initial render
      redrawCanvas();
    }
    
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("mousedown", handleMouseDown);
        canvasRef.current.removeEventListener("mousemove", handleMouseMove);
        canvasRef.current.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [containerRef.current]);
  
  // Redraw canvas whenever shapes change
  useEffect(() => {
    redrawCanvas();
  }, [shapes, currentPoint, startPoint, isDrawing, selectedTool, pencilPoints]);
  
  const redrawCanvas = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw all saved shapes
    shapes.forEach(shape => {
      drawShape(ctx, shape);
    });
    
    // Draw current shape if drawing
    if (isDrawing && startPoint && currentPoint) {
      ctx.strokeStyle = drawingColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      
      if (selectedTool === "line" || selectedTool === "arrow") {
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
        
        if (selectedTool === "arrow") {
          drawArrowhead(ctx, startPoint, currentPoint);
        }
      } else if (selectedTool === "horizontal") {
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currentPoint.x, startPoint.y);
        ctx.stroke();
      } else if (selectedTool === "rectangle") {
        const width = currentPoint.x - startPoint.x;
        const height = currentPoint.y - startPoint.y;
        ctx.strokeRect(startPoint.x, startPoint.y, width, height);
      } else if (selectedTool === "circle") {
        const radius = Math.sqrt(
          Math.pow(currentPoint.x - startPoint.x, 2) + 
          Math.pow(currentPoint.y - startPoint.y, 2)
        );
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (selectedTool === "fibonacci") {
        const width = currentPoint.x - startPoint.x;
        const height = currentPoint.y - startPoint.y;
        
        // Draw main line
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
        
        // Draw Fibonacci levels
        const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
        
        levels.forEach(level => {
          const y = startPoint.y + height * level;
          ctx.beginPath();
          ctx.moveTo(startPoint.x, y);
          ctx.lineTo(currentPoint.x, y);
          ctx.stroke();
          
          // Add label
          ctx.fillStyle = drawingColor;
          ctx.font = "10px Arial";
          ctx.fillText(`${(level * 100).toFixed(1)}%`, startPoint.x - 30, y);
        });
      }
    }
    
    // Draw current pencil path
    if (selectedTool === "pencil" && pencilPoints.length > 1) {
      ctx.strokeStyle = drawingColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(pencilPoints[0].x, pencilPoints[0].y);
      
      for (let i = 1; i < pencilPoints.length; i++) {
        ctx.lineTo(pencilPoints[i].x, pencilPoints[i].y);
      }
      
      ctx.stroke();
    }
  };
  
  const drawShape = (ctx: CanvasRenderingContext2D, shape: DrawingShape) => {
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.lineWidth;
    
    if (shape.type === "pencil" && shape.points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(shape.points[0].x, shape.points[0].y);
      
      for (let i = 1; i < shape.points.length; i++) {
        ctx.lineTo(shape.points[i].x, shape.points[i].y);
      }
      
      ctx.stroke();
      return;
    }
    
    if (shape.points.length < 2) return;
    
    const start = shape.points[0];
    const end = shape.points[1];
    
    ctx.beginPath();
    
    if (shape.type === "line" || shape.type === "arrow") {
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      
      if (shape.type === "arrow") {
        drawArrowhead(ctx, start, end);
      }
    } else if (shape.type === "horizontal") {
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, start.y);
      ctx.stroke();
    } else if (shape.type === "rectangle") {
      const width = end.x - start.x;
      const height = end.y - start.y;
      ctx.strokeRect(start.x, start.y, width, height);
    } else if (shape.type === "circle") {
      const radius = Math.sqrt(
        Math.pow(end.x - start.x, 2) + 
        Math.pow(end.y - start.y, 2)
      );
      ctx.beginPath();
      ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (shape.type === "fibonacci") {
      const width = end.x - start.x;
      const height = end.y - start.y;
      
      // Draw main line
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      
      // Draw Fibonacci levels
      const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
      
      levels.forEach(level => {
        const y = start.y + height * level;
        ctx.beginPath();
        ctx.moveTo(start.x, y);
        ctx.lineTo(end.x, y);
        ctx.stroke();
        
        // Add label
        ctx.fillStyle = shape.color;
        ctx.font = "10px Arial";
        ctx.fillText(`${(level * 100).toFixed(1)}%`, start.x - 30, y);
      });
    }
  };
  
  const drawArrowhead = (ctx: CanvasRenderingContext2D, from: Point, to: Point) => {
    const headLength = 10;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - headLength * Math.cos(angle - Math.PI / 6),
      to.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - headLength * Math.cos(angle + Math.PI / 6),
      to.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };
  
  const handleMouseDown = (e: MouseEvent) => {
    if (selectedTool === "none") return;
    
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setStartPoint({ x, y });
    setCurrentPoint({ x, y });
    
    if (selectedTool === "pencil") {
      setPencilPoints([{ x, y }]);
    }
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;
    
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentPoint({ x, y });
    
    if (selectedTool === "pencil") {
      setPencilPoints(prev => [...prev, { x, y }]);
    }
  };
  
  const handleMouseUp = () => {
    if (!isDrawing || !startPoint || !currentPoint) return;
    
    // Save the drawn shape
    if (selectedTool !== "none") {
      const newShape: DrawingShape = {
        id: Math.random().toString(36).substr(2, 9),
        type: selectedTool === "none" ? "line" : selectedTool,
        points: selectedTool === "pencil" 
          ? [...pencilPoints] 
          : [startPoint, currentPoint],
        color: drawingColor,
        lineWidth,
      };
      
      // Save current state to history for undo
      setHistory(prev => [...prev, shapes]);
      setShapes(prev => [...prev, newShape]);
      
      // Clear redo stack when new action is taken
      setRedoStack([]);
    }
    
    setIsDrawing(false);
    setPencilPoints([]);
  };
  
  const handleSelectTool = (tool: "line" | "arrow" | "horizontal" | "rectangle" | "circle" | "fibonacci" | "pencil") => {
    setSelectedTool(prevTool => prevTool === tool ? "none" : tool);
  };
  
  const handleClearCanvas = () => {
    setHistory(prev => [...prev, shapes]);
    setShapes([]);
    setRedoStack([]);
  };
  
  const handleUndo = () => {
    if (history.length === 0) return;
    
    const prevShapes = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    
    setRedoStack(prev => [...prev, shapes]);
    setShapes(prevShapes);
    setHistory(newHistory);
  };
  
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    
    const nextShapes = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);
    
    setHistory(prev => [...prev, shapes]);
    setShapes(nextShapes);
    setRedoStack(newRedoStack);
  };

  return (
    <div className="absolute top-2 left-2 z-20 flex flex-col items-start space-y-2">
      <div className="flex items-center space-x-1 bg-background/80 backdrop-blur-md p-1 rounded-md border border-border">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={selectedTool === "line" ? "default" : "outline"} 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => handleSelectTool("line")}
              >
                <TrendingUp className="h-4 w-4" />
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
                variant={selectedTool === "arrow" ? "default" : "outline"} 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => handleSelectTool("arrow")}
              >
                <TrendingUp className="h-4 w-4" />
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
                variant={selectedTool === "horizontal" ? "default" : "outline"} 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => handleSelectTool("horizontal")}
              >
                <MinusIcon className="h-4 w-4" />
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
                variant={selectedTool === "rectangle" ? "default" : "outline"} 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => handleSelectTool("rectangle")}
              >
                <Square className="h-4 w-4" />
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
                variant={selectedTool === "circle" ? "default" : "outline"} 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => handleSelectTool("circle")}
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
                variant={selectedTool === "fibonacci" ? "default" : "outline"} 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => handleSelectTool("fibonacci")}
              >
                <Ruler className="h-4 w-4" />
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
                variant={selectedTool === "pencil" ? "default" : "outline"} 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => handleSelectTool("pencil")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Free Drawing</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-center space-x-1 bg-background/80 backdrop-blur-md p-1 rounded-md border border-border">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleUndo}
                disabled={history.length === 0}
              >
                <UndoIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Undo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleRedo}
                disabled={redoStack.length === 0}
              >
                <RedoIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Redo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleClearCanvas}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Clear All</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
