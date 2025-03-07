
import { TradingDataPoint } from "@/utils/tradingData";
import { SceneContainer, OptimizationLevel, EnvironmentPreset } from "./scene/SceneContainer";

interface SceneProps {
  data: TradingDataPoint[];
  optimizationLevel?: OptimizationLevel;
  showPrices?: boolean;
  showVolume?: boolean;
  showStars?: boolean;
  dataReductionFactor?: number;
  environmentPreset?: EnvironmentPreset;
}

export const Scene = (props: SceneProps) => {
  return <SceneContainer {...props} />;
};
