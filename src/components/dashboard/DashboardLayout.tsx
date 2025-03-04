
import { ReactNode } from "react";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { useZoomControls } from "@/hooks/use-zoom-controls";
import { ZoomControls } from "@/components/ZoomControls";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls();
  const isMobile = useIsMobile();

  return (
    <DashboardProvider>
      <div 
        className="min-h-screen p-6 space-y-6 bg-gradient-to-br from-background via-background/95 to-background/90"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
      
      {/* Only show zoom controls on desktop */}
      {!isMobile && (
        <ZoomControls
          scale={scale}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
        />
      )}
    </DashboardProvider>
  );
};
