
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EnhancedMarketDetail } from '../EnhancedMarketDetail';
import { MarketData } from '../types';

interface MarketDetailsDialogProps {
  selectedMarket: MarketData | null;
  showMarketDetail: boolean;
  setShowMarketDetail: (show: boolean) => void;
  handleCloseMarketDetail: () => void;
}

export const MarketDetailsDialog: React.FC<MarketDetailsDialogProps> = ({
  selectedMarket,
  showMarketDetail,
  setShowMarketDetail,
  handleCloseMarketDetail
}) => {
  if (!selectedMarket) return null;

  return (
    <Dialog open={showMarketDetail} onOpenChange={setShowMarketDetail}>
      <DialogContent className="w-full max-w-4xl p-0 bg-card/70 backdrop-blur-lg overflow-hidden max-h-[90vh]">
        <EnhancedMarketDetail 
          marketData={selectedMarket} 
          onClose={handleCloseMarketDetail} 
        />
      </DialogContent>
    </Dialog>
  );
};
