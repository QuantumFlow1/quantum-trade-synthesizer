
import React from 'react';
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Share2 } from 'lucide-react';
import { MarketData } from '../types';

interface MarketDetailHeaderProps {
  marketData: MarketData;
  onClose: () => void;
}

export const MarketDetailHeader: React.FC<MarketDetailHeaderProps> = ({ 
  marketData, 
  onClose 
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-lg font-bold">{marketData.symbol.substring(0, 2).toUpperCase()}</span>
        </div>
        <div>
          <CardTitle className="text-xl">{marketData.name || marketData.symbol}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{marketData.symbol}</Badge>
            <Badge variant="outline" className="text-xs bg-gray-100">Rank #{marketData.rank || 'N/A'}</Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <ExternalLink className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    </CardHeader>
  );
};
