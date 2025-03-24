
import React from 'react';
import { ApiStatus } from '@/hooks/use-trading-chart-data';
import { Card, CardContent } from '@/components/ui/card';
import { ApiStatusAlert } from './ApiStatusAlert';
import { PriceChart } from './PriceChart';
import { ChartControls } from './ChartControls';
import { useTradingViewState } from '../../hooks/useTradingViewState';
import { TradingToolbar } from './TradingToolbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderForm } from './OrderForm';

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
          <TradingToolbar chartType={chartType} setChartType={setChartType} />
          <Tabs defaultValue="chart" className="flex-1">
            <TabsList className="mx-4 mt-2">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="order">Trade</TabsTrigger>
            </TabsList>
            <div className="flex-1 relative">
              <TabsContent value="chart" className="mt-0 h-full">
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
              </TabsContent>
              <TabsContent value="order" className="mt-0 p-4">
                <OrderForm currentPrice={42000} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingView;
