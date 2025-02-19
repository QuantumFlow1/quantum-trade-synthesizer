
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketCharts } from "./market/MarketCharts";
import { useMarketData } from "@/hooks/use-market-data";

const MarketOverview = () => {
  const { data: marketData, isLoading } = useMarketData();

  const chartData = marketData?.map(item => ({
    name: item.symbol,
    volume: item.volume,
    price: item.price,
    change: item.change24h,
    high: item.high24h,
    low: item.low24h
  })) || [];

  return (
    <div className="w-full p-4 rounded-lg border bg-card">
      <h2 className="text-xl font-semibold mb-4">Markt Overzicht</h2>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="volume">Volume Analyse</TabsTrigger>
          <TabsTrigger value="price">Prijstrends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="h-[400px]">
          <MarketCharts data={chartData} isLoading={isLoading} type="overview" />
        </TabsContent>

        <TabsContent value="volume" className="h-[400px]">
          <MarketCharts data={chartData} isLoading={isLoading} type="volume" />
        </TabsContent>

        <TabsContent value="price" className="h-[400px]">
          <MarketCharts data={chartData} isLoading={isLoading} type="price" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketOverview;
