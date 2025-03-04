
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { EnhancedMarketDetail } from '@/components/market/EnhancedMarketDetail';
import { MarketData } from '@/components/market/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useZoomControls } from '@/hooks/use-zoom-controls';

interface MarketDetailsDialogProps {
  selectedMarket: MarketData | null;
  showMarketDetail: boolean;
  setShowMarketDetail: (value: boolean) => void;
  handleCloseMarketDetail: () => void;
}

export const MarketDetailsDialog: React.FC<MarketDetailsDialogProps> = ({
  selectedMarket,
  showMarketDetail,
  setShowMarketDetail,
  handleCloseMarketDetail
}) => {
  const isMobile = useIsMobile();
  const { scale } = useZoomControls();
  
  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => {
      // Adjust any specific behaviors based on screen size
      // This is in addition to the CSS-based responsiveness
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent the dialog from closing when clicking the overlay if there's a transaction in progress
  const handleOpenChange = (open: boolean) => {
    // Only allow closing if we're not in a processing state
    setShowMarketDetail(open);
  };

  const isValidMarketData = selectedMarket && 
    typeof selectedMarket === 'object' && 
    'symbol' in selectedMarket && 
    'price' in selectedMarket;

  return (
    <Dialog open={showMarketDetail} onOpenChange={handleOpenChange}>
      <DialogOverlay className="bg-background/80 backdrop-blur-sm" />
      <DialogContent 
        className={`${isMobile ? 'max-w-[95vw]' : 'max-w-4xl'} p-0 overflow-hidden rounded-lg border bg-background shadow-lg h-[85vh] overflow-y-auto`}
        style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
      >
        {isValidMarketData ? (
          <EnhancedMarketDetail 
            marketData={selectedMarket} 
            onClose={handleCloseMarketDetail} 
          />
        ) : (
          <div className="p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Invalid Market Data</AlertTitle>
              <AlertDescription>
                The market data for this selection is incomplete or unavailable.
                Please try selecting a different market or refreshing the page.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
