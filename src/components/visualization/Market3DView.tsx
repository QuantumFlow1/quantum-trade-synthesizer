
import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./3d/Scene";
import { TradingDataPoint } from "@/utils/tradingData";
import { useMarket3DData } from "@/hooks/use-market-3d-data";
import { VisualizationControls } from "./3d/VisualizationControls";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { Sparkles, BarChart2, Activity } from "lucide-react";

interface Market3DViewProps {
  data: TradingDataPoint[];
  isSimulationMode?: boolean;
}

export const Market3DView = ({ data, isSimulationMode = false }: Market3DViewProps) => {
  const { visualizationData, stats } = useMarket3DData(data);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useThemeDetection();
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Stats for display
  const priceChangeColor = stats.priceChange >= 0 
    ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
    : theme === 'dark' ? 'text-red-400' : 'text-red-600';
    
  const priceChangeSymbol = stats.priceChange >= 0 ? '▲' : '▼';
  
  return (
    <Card className="relative backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all h-[500px] overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-6 z-10 flex items-center space-x-2">
        <h2 className="text-xl font-bold flex items-center">
          <BarChart2 className="w-5 h-5 mr-2" /> 
          3D Market Visualization
        </h2>
        {isSimulationMode && (
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600 border-yellow-600/30">
            Simulation
          </Badge>
        )}
      </div>
      
      {/* Stats overlay */}
      <div className="absolute top-4 right-6 z-10 flex flex-col space-y-2">
        <Badge className="bg-primary/20 text-primary border-primary/30 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" /> 
          <span>Avg: ${stats.avgPrice.toFixed(2)}</span>
        </Badge>
        <Badge className={`bg-black/20 ${priceChangeColor} border-white/10 flex items-center gap-1.5`}>
          <Sparkles className="w-3.5 h-3.5" /> 
          <span>
            {priceChangeSymbol} ${Math.abs(stats.priceChange).toFixed(2)} 
            ({stats.priceChangePercent >= 0 ? '+' : ''}{stats.priceChangePercent.toFixed(2)}%)
          </span>
        </Badge>
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-lg font-medium">Loading 3D visualization...</p>
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div className="absolute bottom-4 left-6 z-10">
        <VisualizationControls />
      </div>
      
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          ref={canvasRef}
          shadows
          camera={{ position: [0, 5, 15], fov: 60 }}
          style={{ background: theme === 'dark' ? 'linear-gradient(to bottom, #0f172a, #1e293b)' : 'linear-gradient(to bottom, #e0f2fe, #f0f9ff)' }}
        >
          <Scene data={visualizationData} />
        </Canvas>
      </div>
    </Card>
  );
};
