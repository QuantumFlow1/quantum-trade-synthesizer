
import React from 'react';
import { Button } from "@/components/ui/button";
import { CandlestickChart, LineChart, AreaChart, BarChart, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TradingToolbarProps {
  chartType: string;
  setChartType: (type: string) => void;
  selectedPosition?: any;
}

export const TradingToolbar: React.FC<TradingToolbarProps> = ({ 
  chartType, 
  setChartType,
  selectedPosition
}) => {
  return (
    <div className="border-b flex items-center justify-between p-2 bg-muted/10">
      <div className="flex items-center space-x-1">
        <Button
          variant={chartType === 'candles' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setChartType('candles')}
          className="h-8 w-8 p-0"
        >
          <CandlestickChart className="h-4 w-4" />
        </Button>
        <Button
          variant={chartType === 'line' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setChartType('line')}
          className="h-8 w-8 p-0"
        >
          <LineChart className="h-4 w-4" />
        </Button>
        <Button
          variant={chartType === 'area' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setChartType('area')}
          className="h-8 w-8 p-0"
        >
          <AreaChart className="h-4 w-4" />
        </Button>
        <Button
          variant={chartType === 'bars' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setChartType('bars')}
          className="h-8 w-8 p-0"
        >
          <BarChart className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Position information */}
      {selectedPosition && (
        <div className="flex items-center">
          <Badge variant="outline" className="mr-2 flex items-center gap-1">
            <span>{selectedPosition.symbol || "BTC"}</span>
            <ArrowRight className="h-3 w-3" />
            <span>${selectedPosition.entry_price || "N/A"}</span>
          </Badge>
        </div>
      )}
    </div>
  );
};
