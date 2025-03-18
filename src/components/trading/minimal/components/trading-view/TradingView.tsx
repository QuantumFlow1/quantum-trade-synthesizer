
import React from 'react';
import { ApiStatus } from '@/hooks/use-trading-chart-data';
import { Card, CardContent } from '@/components/ui/card';
import { ApiStatusAlert } from './ApiStatusAlert';
import { PriceChart } from './PriceChart';
import { ChartControls } from './ChartControls';
import { useTradingViewState } from '../../hooks/useTradingViewState';

interface TradingViewProps {
  apiStatus: ApiStatus;
  chartData: any[];
}

const TradingView: React.FC<TradingViewProps> = ({ apiStatus, chartData }) => {
  const {
    selectedInterval,
    setSelectedInterval,
    chartType,
    setChartType,
    visibleIndicators
  } = useTradingViewState();

  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        <div className="flex flex-col h-full">
          <ApiStatusAlert apiStatus={apiStatus} />
          <div className="flex-1 relative">
            <ChartControls 
              selectedInterval={selectedInterval}
              setSelectedInterval={setSelectedInterval}
              chartType={chartType}
              setChartType={setChartType}
            />
            <PriceChart 
              data={chartData} 
              chartType={chartType}
              visibleIndicators={visibleIndicators}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingView;
