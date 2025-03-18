
import React from 'react';
import { ApiStatus } from '@/hooks/use-trading-chart-data';
import { Card, CardContent } from '@/components/ui/card';
import { ApiStatusAlert } from './ApiStatusAlert';
import { PriceChart } from './PriceChart';
import { ChartControls } from './ChartControls';

interface TradingViewProps {
  apiStatus: ApiStatus;
  chartData: any[];
}

const TradingView: React.FC<TradingViewProps> = ({ apiStatus, chartData }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        <div className="flex flex-col h-full">
          <ApiStatusAlert apiStatus={apiStatus} />
          <div className="flex-1 relative">
            <ChartControls />
            <PriceChart data={chartData} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingView;
