
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { ChartData } from '../../types';

interface ModalHeaderProps {
  marketName: string | null;
  latestData: ChartData;
  isPriceUp: boolean;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  marketName,
  latestData,
  isPriceUp
}) => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {marketName}
          <span className={`text-sm font-medium ${isPriceUp ? "text-green-500" : "text-red-500"}`}>
            {isPriceUp ? <TrendingUp className="h-4 w-4 inline" /> : <TrendingDown className="h-4 w-4 inline" />}
            ${latestData.price.toFixed(2)}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.open(`https://www.coingecko.com/en/coins/${marketName?.split('/')[0].toLowerCase()}`, "_blank")}>
            <ExternalLink className="h-4 w-4 mr-2" />
            CoinGecko
          </Button>
        </div>
      </DialogTitle>
      <DialogDescription>
        Detailed market information and trading options
      </DialogDescription>
    </DialogHeader>
  );
};
