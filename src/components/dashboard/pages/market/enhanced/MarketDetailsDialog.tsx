
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { EnhancedMarketDetail } from '@/components/market/EnhancedMarketDetail';
import { MarketData } from '@/components/market/types';

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
  return (
    <Dialog open={showMarketDetail} onOpenChange={setShowMarketDetail}>
      <DialogContent className="max-w-4xl">
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
