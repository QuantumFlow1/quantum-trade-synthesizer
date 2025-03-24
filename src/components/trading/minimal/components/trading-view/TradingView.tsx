
import React, { useEffect } from 'react';
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
  selectedPosition?: any;
  currentPrice?: number;
}

const TradingView: React.FC<TradingViewProps> = ({ 
  apiStatus, 
  chartData, 
  selectedPosition,
  currentPrice = 42000 
}) => {
  const {
    selectedInterval,
    setSelectedInterval,
    chartType,
    setChartType,
    visibleIndicators
  } = useTradingViewState();

  // Update chart when position is selected
  useEffect(() => {
    if (selectedPosition) {
      console.log("Position selected in TradingView:", selectedPosition);
      // Here we would typically fetch specific data for this position
      // or filter existing data based on the position's symbol
    }
  }, [selectedPosition]);

  // Determine the price to display
  const displayPrice = selectedPosition?.entry_price || currentPrice;

  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        <div className="flex flex-col h-full">
          <ApiStatusAlert apiStatus={apiStatus} />
          <TradingToolbar 
            chartType={chartType} 
            setChartType={setChartType} 
            selectedPosition={selectedPosition}
          />
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
                  selectedPosition={selectedPosition}
                />
              </TabsContent>
              <TabsContent value="order" className="mt-0 p-4">
                <OrderForm 
                  currentPrice={displayPrice} 
                  selectedPosition={selectedPosition}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingView;
