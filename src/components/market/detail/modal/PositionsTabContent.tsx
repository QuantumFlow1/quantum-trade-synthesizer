
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from 'lucide-react';
import { ChartData, MarketData } from '../../types';

interface PositionsTabContentProps {
  marketName: string | null;
  hasPositions: boolean;
  amount: string;
  leverage: string;
  latestData: ChartData;
  isPriceUp: boolean;
  setCurrentTab: (tab: string) => void;
}

export const PositionsTabContent: React.FC<PositionsTabContentProps> = ({
  marketName,
  hasPositions,
  amount,
  leverage,
  latestData,
  isPriceUp,
  setCurrentTab
}) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Your Positions for {marketName}</h3>
      
      {hasPositions ? (
        <div className="space-y-4">
          <div className="rounded-md border p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium">{marketName} Long Position</h4>
                <p className="text-sm text-muted-foreground">Opened at ${latestData.price.toFixed(2)}</p>
              </div>
              <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${isPriceUp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isPriceUp ? 'Profit' : 'Loss'}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-2 mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Size</p>
                <p className="text-sm">{amount} {marketName?.split('/')[0]}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Value</p>
                <p className="text-sm">${(parseFloat(amount) * latestData.price).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Entry Price</p>
                <p className="text-sm">${latestData.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current Price</p>
                <p className="text-sm">${latestData.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Unrealized P&L</p>
                <p className={`text-sm ${isPriceUp ? 'text-green-600' : 'text-red-600'}`}>
                  {isPriceUp ? '+' : '-'}$0.00 (0.00%)
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Leverage</p>
                <p className="text-sm">{leverage}x</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-red-500 border-red-500">
                Close Position
              </Button>
              <Button size="sm" variant="outline">
                Adjust Stop Loss
              </Button>
            </div>
          </div>
          
          <div className="rounded-md bg-blue-50 p-3">
            <div className="flex">
              <Info className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <h5 className="text-sm font-medium text-blue-700">Position Information</h5>
                <p className="text-xs text-blue-600 mt-1">
                  This position was opened moments ago. Market movements will be reflected in your P&L shortly.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-muted-foreground mb-4">You don't have any open positions for {marketName}</p>
          <Button onClick={() => setCurrentTab("trade")}>Open a Position</Button>
        </div>
      )}
    </Card>
  );
};
