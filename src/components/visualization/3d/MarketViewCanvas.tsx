
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { TradingDataPoint } from "@/utils/tradingData";
import { Suspense } from "react";

interface MarketViewCanvasProps {
  theme: ColorTheme;
  webGLAvailable: boolean;
  hasError: boolean;
  contextLost: boolean;
  isLoading: boolean;
  data: TradingDataPoint[];
  onWebGLContextLost: () => void;
  onWebGLContextRestored: () => void;
}

export const MarketViewCanvas = ({
  theme,
  webGLAvailable,
  hasError,
  contextLost,
  isLoading,
  data,
  onWebGLContextLost,
  onWebGLContextRestored
}: MarketViewCanvasProps) => {
  // Don't render canvas if WebGL is not available or there's an error
  if (!webGLAvailable || hasError || contextLost) {
    return null;
  }
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Canvas
        onContextLost={onWebGLContextLost}
        onContextRestored={onWebGLContextRestored}
        camera={{ position: [0, 5, 15], fov: 50 }}
        shadows={false} // Disable shadows for better performance
        dpr={[1, 2]} // Responsive pixel ratio
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true 
        }}
        style={{ background: theme === 'dark' ? 'radial-gradient(circle, #1a1a3a 0%, #0f0f23 100%)' : 'radial-gradient(circle, #f8fafc 0%, #e2e8f0 100%)' }}
      >
        <Suspense fallback={null}>
          <Scene data={data} optimizationLevel={isLoading ? 'aggressive' : 'normal'} />
        </Suspense>
      </Canvas>
    </div>
  );
};
