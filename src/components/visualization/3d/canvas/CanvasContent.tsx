
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { ThemeBasedLighting } from "../ThemeBasedLighting";
import { GroundPlane } from "../GroundPlane";
import { Scene } from "../Scene";
import { RendererConfigurator } from "./RendererConfigurator";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { TradingDataPoint } from "@/utils/tradingData";

interface CanvasContentProps {
  theme: ColorTheme;
  isLoading: boolean;
  data: TradingDataPoint[];
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
  onRendererReady: () => void;
}

export const CanvasContent = ({
  theme,
  isLoading,
  data,
  onCanvasReady,
  onRendererReady
}: CanvasContentProps) => {
  // Determine optimization level based on loading state
  const optimizationLevel = isLoading ? 'aggressive' : 'normal';
  
  return (
    <Suspense fallback={null}>
      <RendererConfigurator 
        theme={theme} 
        onCanvasReady={onCanvasReady}
        onRendererReady={onRendererReady}
      />
      
      <ThemeBasedLighting optimizationLevel={optimizationLevel} />
      <GroundPlane theme={theme} optimizationLevel={optimizationLevel} />
      
      <OrbitControls 
        enableZoom={true} 
        enablePan={true} 
        rotateSpeed={0.5}
        zoomSpeed={0.7}
        minDistance={5}
        maxDistance={30}
      />
      
      {data.length > 0 && (
        <Scene data={data} optimizationLevel={optimizationLevel} />
      )}
    </Suspense>
  );
};
