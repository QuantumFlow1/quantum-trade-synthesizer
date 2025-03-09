
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowUpDown, BarChart, AreaChart } from 'lucide-react';
import MarketChartView from "../../MarketChartView";

interface ChartTabContentProps {
  marketData: any;
  marketName?: string;
  data?: any[];
  isPriceUp?: boolean;
}

export const ChartTabContent: React.FC<ChartTabContentProps> = ({ 
  marketData,
  marketName,
  data,
  isPriceUp
}) => {
  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle>Price Chart {marketName && `for ${marketName}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price">
          <TabsList>
            <TabsTrigger value="price">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Price
            </TabsTrigger>
            <TabsTrigger value="volume">
              <BarChart className="mr-2 h-4 w-4" />
              Volume
            </TabsTrigger>
            <TabsTrigger value="overview">
              <AreaChart className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="price">
            <MarketChartView data={marketData} type="price" />
          </TabsContent>
          <TabsContent value="volume">
            <MarketChartView data={marketData} type="volume" />
          </TabsContent>
          <TabsContent value="overview">
            <MarketChartView data={marketData} type="overview" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
