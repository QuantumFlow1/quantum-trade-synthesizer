
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Users } from "lucide-react";

interface DashboardViewProps {
  userCount: number;
  systemLoad: number;
  errorRate: number;
}

const DashboardView = ({
  userCount,
  systemLoad,
  errorRate
}: DashboardViewProps) => {
  const { data: marketData, isLoading: marketLoading } = useQuery({
    queryKey: ['marketData'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('agent_collected_data')
          .select('*')
          .eq('data_type', 'market_data')
          .order('collected_at', { ascending: false })
          .limit(24);
        
        if (error) throw error;
        
        // Transform data to ensure it's properly formatted for charts
        const formattedData = data?.map(item => ({
          ...item,
          content: typeof item.content === 'string' 
            ? JSON.parse(item.content) 
            : item.content
        })) || [];
        
        console.log('Formatted Market Data:', formattedData);
        return formattedData;
      } catch (err) {
        console.error('Error fetching market data:', err);
        return [];
      }
    }
  });

  const { data: sentimentData, isLoading: sentimentLoading } = useQuery({
    queryKey: ['sentimentData'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('agent_collected_data')
          .select('*')
          .eq('data_type', 'social_sentiment')
          .order('collected_at', { ascending: false })
          .limit(24);
        
        if (error) throw error;
        
        // Transform data to ensure it's properly formatted for charts
        const formattedData = data?.map(item => ({
          ...item,
          content: typeof item.content === 'string' 
            ? JSON.parse(item.content) 
            : item.content
        })) || [];
        
        console.log('Formatted Sentiment Data:', formattedData);
        return formattedData;
      } catch (err) {
        console.error('Error fetching sentiment data:', err);
        return [];
      }
    }
  });

  // Create mock data if real data is not available
  const mockMarketData = Array.from({ length: 24 }, (_, i) => ({
    id: `mock-market-${i}`,
    collected_at: new Date(Date.now() - (i * 3600000)).toISOString(),
    data_type: 'market_data',
    content: {
      price: 100 + Math.random() * 20 - 10,
      volume: 1000 + Math.random() * 500
    }
  }));

  const mockSentimentData = Array.from({ length: 24 }, (_, i) => ({
    id: `mock-sentiment-${i}`,
    collected_at: new Date(Date.now() - (i * 3600000)).toISOString(),
    data_type: 'social_sentiment',
    content: {
      sentiment: Math.random() * 2 - 1,
      confidence: Math.random() * 0.5 + 0.5
    }
  }));

  // Use mock data if real data is empty
  const displayMarketData = (marketData && marketData.length > 0) ? marketData : mockMarketData;
  const displaySentimentData = (sentimentData && sentimentData.length > 0) ? sentimentData : mockSentimentData;

  // Add console logs for debugging
  console.log('Market Data to display:', displayMarketData);
  console.log('Sentiment Data to display:', displaySentimentData);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-background/80 border border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Gebruikers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
            <p className="text-xs text-muted-foreground">Actieve accounts</p>
          </CardContent>
        </Card>
        <Card className="bg-background/80 border border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Systeem Load</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemLoad}%</div>
            <p className="text-xs text-muted-foreground">Huidige belasting</p>
          </CardContent>
        </Card>
        <Card className="bg-background/80 border border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorRate}%</div>
            <p className="text-xs text-muted-foreground">Laatste 24 uur</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-background/80 border border-border/50">
          <CardHeader>
            <CardTitle>Market Data Trend</CardTitle>
            <CardDescription>24-uurs markt activiteit</CardDescription>
          </CardHeader>
          <CardContent>
            {marketLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p>Loading market data...</p>
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={displayMarketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="collected_at" 
                      tickFormatter={(value) => {
                        try {
                          return new Date(value).toLocaleTimeString();
                        } catch (e) {
                          console.error('Error formatting time:', e, value);
                          return '';
                        }
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => {
                        try {
                          return new Date(value).toLocaleString();
                        } catch (e) {
                          console.error('Error formatting date:', e, value);
                          return '';
                        }
                      }}
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "none",
                        borderRadius: "8px",
                        color: "white"
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="content.price" 
                      stroke="#8884d8" 
                      name="Price"
                      isAnimationActive={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="content.volume" 
                      stroke="#82ca9d" 
                      name="Volume"
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-background/80 border border-border/50">
          <CardHeader>
            <CardTitle>Social Sentiment Analysis</CardTitle>
            <CardDescription>Sentiment trend van sociale media</CardDescription>
          </CardHeader>
          <CardContent>
            {sentimentLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p>Loading sentiment data...</p>
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displaySentimentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="collected_at"
                      tickFormatter={(value) => {
                        try {
                          return new Date(value).toLocaleTimeString();
                        } catch (e) {
                          console.error('Error formatting time:', e, value);
                          return '';
                        }
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => {
                        try {
                          return new Date(value).toLocaleString();
                        } catch (e) {
                          console.error('Error formatting date:', e, value);
                          return '';
                        }
                      }}
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "none",
                        borderRadius: "8px",
                        color: "white"
                      }}
                    />
                    <Bar 
                      dataKey="content.sentiment" 
                      fill="#8884d8" 
                      name="Sentiment Score"
                      isAnimationActive={false}
                    />
                    <Bar 
                      dataKey="content.confidence" 
                      fill="#82ca9d" 
                      name="Confidence"
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
