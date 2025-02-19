
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  change24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

const MarketOverview = () => {
  const { toast } = useToast();

  const { data: marketData, isLoading, error } = useQuery({
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
          description: "Failed to load market data",
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
      
      {isLoading ? (
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Loading market data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {marketData?.map((item) => (
              <div key={item.symbol} className="p-4 rounded-lg bg-secondary/50">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.symbol}</span>
                  <span className={`text-sm ${item.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(2)}%
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold">${item.price.toLocaleString()}</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>
                    <span className="block">Volume</span>
                    <span className="font-medium">${item.volume.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block">24h Range</span>
                    <span className="font-medium">${item.low24h.toLocaleString()} - ${item.high24h.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overzicht</TabsTrigger>
              <TabsTrigger value="volume">Volume Analyse</TabsTrigger>
              <TabsTrigger value="price">Prijstrends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="h-[400px]">
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
            </TabsContent>

            <TabsContent value="volume" className="h-[400px]">
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
            </TabsContent>

            <TabsContent value="price" className="h-[400px]">
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
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default MarketOverview;
