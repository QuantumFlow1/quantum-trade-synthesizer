
import { Card } from "@/components/ui/card";
import { MarketViewHeader } from "./MarketViewHeader";
import { LoadingState } from "./LoadingState";

interface Market3DInitializingProps {
  isSimulationMode?: boolean;
  onRetry: () => void;
}

export const Market3DInitializing = ({ 
  isSimulationMode = false, 
  onRetry 
}: Market3DInitializingProps) => {
  return (
    <Card className="relative backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] transition-all h-[500px] overflow-hidden">
      <MarketViewHeader isSimulationMode={isSimulationMode} />
      <LoadingState 
        message="Initializing 3D Visualization..." 
        retryAction={onRetry}
        loadingTime={5000} // Show retry after 5 seconds
      />
    </Card>
  );
};
