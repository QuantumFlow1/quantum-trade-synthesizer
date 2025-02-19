
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  change24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

const LoadingChart = () => (
  <div className="h-full w-full flex items-center justify-center bg-secondary/20 rounded-lg">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mb-2 mx-auto text-primary" />
      <p className="text-sm text-muted-foreground">Marktdata wordt geladen...</p>
    </div>
  </div>
);

const MarketOverview = () => {
  const { toast } = useToast();

  const { data: marketData, isLoading } = useQuery({
    queryKey: ['marketData'],
    queryFn: async () => {
      const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/fetch-market-data`, {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }
      
      return response.json() as Promise<MarketData[]>;
    },
    refetchInterval: 5000,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Fout bij het laden van marktdata",
          variant: "destructive",
        });
      }
    }
  });

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
          {isLoading ? (
            <LoadingChart />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Legend />
                <Bar dataKey="volume" fill="#4ade80" name="Volume" />
                <Bar dataKey="price" fill="#8b5cf6" name="Price" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabsContent>

        <TabsContent value="volume" className="h-[400px]">
          {isLoading ? (
            <LoadingChart />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="volume" fill="#4ade80" stroke="#4ade80" name="Volume" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </TabsContent>

        <TabsContent value="price" className="h-[400px]">
          {isLoading ? (
            <LoadingChart />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8b5cf6" name="Price" />
                <Line type="monotone" dataKey="high" stroke="#4ade80" name="High" />
                <Line type="monotone" dataKey="low" stroke="#ef4444" name="Low" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketOverview;
