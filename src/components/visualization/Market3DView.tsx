
import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { useThemeString } from '@/hooks/use-theme-string';
import { ErrorState } from './market-3d/ErrorState';
import { EmptyState } from './market-3d/EmptyState';
import { VisualizationControls } from './market-3d/VisualizationControls';
import { StatusOverlays } from './market-3d/StatusOverlays';
import { Market3DScene } from './market-3d/Market3DScene';
import { useMarketDataProcessor } from './market-3d/useMarketDataProcessor';
import { useWebGLState } from '@/hooks/use-webgl-state';

interface Market3DViewProps {
  data: any[];
  isSimulationMode?: boolean;
  onError?: () => void;
  onLoaded?: () => void;
}

export const Market3DView = ({ 
  data, 
  isSimulationMode = false,
  onError,
  onLoaded 
}: Market3DViewProps) => {
  const [viewMode, setViewMode] = useState<'default' | 'volume' | 'price'>('default');
  const [dataDensity, setDataDensity] = useState(50);
  const controlsRef = useRef<any>(null);
  const theme = useThemeString();
  
  // Use the new WebGL state hook
  const {
    isLoading,
    hasError,
    handleContextLost,
    handleContextRestored,
    handleRetry,
    setIsLoading
  } = useWebGLState();

  // Process data for visualization
  const processedData = useMarketDataProcessor(data, dataDensity, viewMode);

  // Notify parent component when loaded
  useEffect(() => {
    if (!isLoading && !hasError && onLoaded) {
      onLoaded();
    }
  }, [isLoading, hasError, onLoaded]);

  // Forward error events to parent
  useEffect(() => {
    if (hasError && onError) {
      onError();
    }
  }, [hasError, onError]);

  // Reset view
  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // Change view mode
  const cycleViewMode = () => {
    if (viewMode === 'default') setViewMode('volume');
    else if (viewMode === 'volume') setViewMode('price');
    else setViewMode('default');
  };

  // Handle control operations
  const handleIncreaseDataDensity = () => {
    setDataDensity(Math.min(100, dataDensity + 10));
  };

  const handleDecreaseDataDensity = () => {
    setDataDensity(Math.max(10, dataDensity - 10));
  };

  if (hasError) {
    return <ErrorState onRetry={handleRetry} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  return (
    <Card className="relative h-[500px] shadow-lg overflow-hidden bg-background/10 backdrop-blur-sm border border-border/30">
      <Market3DScene 
        processedData={processedData}
        onCreated={() => setIsLoading(false)}
        onError={handleContextLost}
        onControlsRef={(ref) => (controlsRef.current = ref)}
        theme={theme}
      />
      
      <VisualizationControls 
        viewMode={viewMode}
        dataDensity={dataDensity}
        onResetView={handleResetView}
        onCycleViewMode={cycleViewMode}
        onIncreaseDataDensity={handleIncreaseDataDensity}
        onDecreaseDataDensity={handleDecreaseDataDensity}
        onRefresh={handleRetry}
      />
      
      <StatusOverlays 
        isSimulationMode={isSimulationMode} 
        viewMode={viewMode} 
      />
    </Card>
  );
};
