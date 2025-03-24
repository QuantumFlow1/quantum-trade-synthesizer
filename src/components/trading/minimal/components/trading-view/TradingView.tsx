
import React from 'react';
import { ApiStatus } from '@/hooks/use-trading-chart-data';
import { Card, CardContent } from '@/components/ui/card';
import { ApiStatusAlert } from './ApiStatusAlert';
import { PriceChart } from './PriceChart';
import { ChartControls } from './ChartControls';
import { useTradingViewState } from '../../hooks/useTradingViewState';
import { TradingToolbar } from './TradingToolbar';
import { Tabs, TabsContent } from '@/components/ui/tabs';

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
            <div className="flex-1 relative">
              <ChartControls 
                selectedInterval={selectedInterval}
                setSelectedInterval={setSelectedInterval}
                chartType={chartType}
                setChartType={setChartType}
              />
              <TabsContent value="chart" className="mt-0 h-full">
                <PriceChart 
                  data={chartData} 
                  chartType={chartType}
                  visibleIndicators={visibleIndicators}
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
