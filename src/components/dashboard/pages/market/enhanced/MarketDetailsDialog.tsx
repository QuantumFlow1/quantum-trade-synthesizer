
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { EnhancedMarketDetail } from '@/components/market/EnhancedMarketDetail';
import { MarketData } from '@/components/market/types';
import { useIsMobile } from '@/hooks/use-mobile';

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

  return (
    <Dialog open={showMarketDetail} onOpenChange={handleOpenChange}>
      <DialogOverlay className="bg-background/80 backdrop-blur-sm" />
      <DialogContent 
        className={`${isMobile ? 'max-w-[95vw]' : 'max-w-4xl'} p-0 overflow-hidden rounded-lg border bg-background shadow-lg h-[85vh] overflow-y-auto`}
      >
        {selectedMarket && (
          <EnhancedMarketDetail 
            marketData={selectedMarket} 
            onClose={handleCloseMarketDetail} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
