
import { useState, useRef, useEffect, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, TrendingUp, Ruler, Square, Circle, MinusIcon, UndoIcon, RedoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type DrawingTool = "line" | "arrow" | "rectangle" | "circle" | "horizontal" | "fibonacci" | "pencil" | "none";

interface DrawingToolsOverlayProps {
  containerRef: RefObject<HTMLDivElement>;
}

export const DrawingToolsOverlay = ({ containerRef }: DrawingToolsOverlayProps) => {
  const [selectedTool, setSelectedTool] = useState<DrawingTool>("none");
  const [drawings, setDrawings] = useState<any[]>([]);
  const [history, setHistory] = useState<any[][]>([]);
  const [redoStack, setRedoStack] = useState<any[][]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  // Initialize canvas
  useEffect(() => {
    if (!containerRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = selectedTool === 'none' ? 'none' : 'auto';
    canvas.style.zIndex = '10';
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;
    canvasRef.current = canvas;
    containerRef.current.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
    
    // Redraw existing drawings
    redrawCanvas();
    
    return () => {
      if (containerRef.current && canvas) {
        containerRef.current.removeChild(canvas);
      }
    };
  }, [containerRef, selectedTool]);
  
  // Update canvas size on window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
        redrawCanvas();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle mouse events for drawing
  useEffect(() => {
    if (!canvasRef.current || selectedTool === 'none') return;
    
    const canvas = canvasRef.current;
    
    const handleMouseDown = (e: MouseEvent) => {
      if (selectedTool === 'none') return;
      
      const rect = canvas.getBoundingClientRect();
      startPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      currentPos.current = { ...startPos.current };
      isDrawing.current = true;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing.current) return;
      
      const rect = canvas.getBoundingClientRect();
      currentPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      redrawCanvas();
      drawCurrentShape();
    };
    
    const handleMouseUp = () => {
      if (!isDrawing.current) return;
      
      // Save the drawing
      const newDrawing = {
        tool: selectedTool,
        start: { ...startPos.current },
        end: { ...currentPos.current }
      };
      
      // Save to history for undo/redo
      setHistory(prev => [...prev, [...drawings]]);
      setRedoStack([]);
      
      setDrawings(prev => [...prev, newDrawing]);
      isDrawing.current = false;
    };
    
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [selectedTool, drawings]);
  
  // Redraw all shapes on the canvas
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all saved shapes
    drawings.forEach(drawing => {
      drawShape(ctx, drawing.tool, drawing.start, drawing.end);
    });
  };
  
  // Draw the current shape being created
  const drawCurrentShape = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    drawShape(ctx, selectedTool, startPos.current, currentPos.current);
  };
  
  // Draw a specific shape
  const drawShape = (ctx: CanvasRenderingContext2D, tool: DrawingTool, start: {x: number, y: number}, end: {x: number, y: number}) => {
    switch(tool) {
      case 'line':
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        break;
      case 'arrow':
        drawArrow(ctx, start, end);
        break;
      case 'rectangle':
        ctx.beginPath();
        ctx.rect(
          Math.min(start.x, end.x),
          Math.min(start.y, end.y),
          Math.abs(end.x - start.x),
          Math.abs(end.y - start.y)
        );
        ctx.stroke();
        break;
      case 'circle':
        const radius = Math.sqrt(
          Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        );
        ctx.beginPath();
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case 'horizontal':
        ctx.beginPath();
        ctx.moveTo(0, start.y);
        ctx.lineTo(ctx.canvas.width, start.y);
        ctx.stroke();
        break;
      case 'fibonacci':
        drawFibonacciRetracement(ctx, start, end);
        break;
      case 'pencil':
        // Pencil is handled differently - in real implementation
        // this would track all points for a freeform line
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        break;
      default:
        break;
    }
  };
  
  // Draw an arrow
  const drawArrow = (ctx: CanvasRenderingContext2D, start: {x: number, y: number}, end: {x: number, y: number}) => {
    const headlen = 10;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineTo(
      end.x - headlen * Math.cos(angle - Math.PI / 6),
      end.y - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - headlen * Math.cos(angle + Math.PI / 6),
      end.y - headlen * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };
  
  // Draw Fibonacci retracement levels
  const drawFibonacciRetracement = (ctx: CanvasRenderingContext2D, start: {x: number, y: number}, end: {x: number, y: number}) => {
    const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
    const height = end.y - start.y;
    const width = ctx.canvas.width;
    
    // Draw the main trend line
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    
    // Draw horizontal lines for each level
    levels.forEach(level => {
      const y = start.y + height * level;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      
      // Label the level
      ctx.fillStyle = "#8b5cf6";
      ctx.fillText(`${(level * 100).toFixed(1)}%`, 5, y - 5);
    });
  };
  
  // Clear all drawings
  const handleClear = () => {
    // Save current state to history before clearing
    if (drawings.length > 0) {
      setHistory(prev => [...prev, [...drawings]]);
      setRedoStack([]);
    }
    
    setDrawings([]);
    redrawCanvas();
  };
  
  // Undo last drawing
  const handleUndo = () => {
    if (history.length === 0) return;
    
    const lastState = history[history.length - 1];
    setRedoStack(prev => [...prev, [...drawings]]);
    setDrawings(lastState);
    setHistory(prev => prev.slice(0, -1));
  };
  
  // Redo last undone drawing
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    
    const nextState = redoStack[redoStack.length - 1];
    setHistory(prev => [...prev, [...drawings]]);
    setDrawings(nextState);
    setRedoStack(prev => prev.slice(0, -1));
  };

  return (
    <div className="absolute top-2 left-2 z-20 bg-background/80 backdrop-blur-sm p-1 rounded-lg shadow-lg border border-border flex flex-col gap-1">
      <TooltipProvider>
        <div className="flex flex-col gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant={selectedTool === "line" ? "default" : "outline"} 
                onClick={() => setSelectedTool(selectedTool === "line" ? "none" : "line")}
              >
                <TrendingUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Trend Line</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant={selectedTool === "arrow" ? "default" : "outline"} 
                onClick={() => setSelectedTool(selectedTool === "arrow" ? "none" : "arrow")}
              >
                <TrendingUp className="h-4 w-4 rotate-45" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Arrow</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant={selectedTool === "rectangle" ? "default" : "outline"} 
                onClick={() => setSelectedTool(selectedTool === "rectangle" ? "none" : "rectangle")}
              >
                <Square className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rectangle</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant={selectedTool === "circle" ? "default" : "outline"} 
                onClick={() => setSelectedTool(selectedTool === "circle" ? "none" : "circle")}
              >
                <Circle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Circle</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant={selectedTool === "horizontal" ? "default" : "outline"} 
                onClick={() => setSelectedTool(selectedTool === "horizontal" ? "none" : "horizontal")}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Horizontal Line</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant={selectedTool === "fibonacci" ? "default" : "outline"} 
                onClick={() => setSelectedTool(selectedTool === "fibonacci" ? "none" : "fibonacci")}
              >
                <Ruler className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Fibonacci Retracement</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant={selectedTool === "pencil" ? "default" : "outline"} 
                onClick={() => setSelectedTool(selectedTool === "pencil" ? "none" : "pencil")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Freehand Drawing</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-border">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="outline" 
                onClick={handleUndo}
                disabled={history.length === 0}
              >
                <UndoIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="outline" 
                onClick={handleRedo}
                disabled={redoStack.length === 0}
              >
                <RedoIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="destructive" 
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
        </div>
      </TooltipProvider>
    </div>
  );
};
