
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
      const { data, error } = await supabase
        .from('agent_collected_data')
        .select('*')
        .eq('data_type', 'market_data')
        .order('collected_at', { ascending: false })
        .limit(24);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: sentimentData, isLoading: sentimentLoading } = useQuery({
    queryKey: ['sentimentData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_collected_data')
        .select('*')
        .eq('data_type', 'social_sentiment')
        .order('collected_at', { ascending: false })
        .limit(24);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Gebruikers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
            <p className="text-xs text-muted-foreground">Actieve accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Systeem Load</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemLoad}%</div>
            <p className="text-xs text-muted-foreground">Huidige belasting</p>
          </CardContent>
        </Card>
        <Card>
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
        <Card>
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
                  <LineChart data={marketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="collected_at" 
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "none",
                        borderRadius: "8px",
                        color: "white"
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={(data) => data.content.price} 
                      stroke="#8884d8" 
                      name="Price"
                    />
                    <Line 
                      type="monotone" 
                      dataKey={(data) => data.content.volume} 
                      stroke="#82ca9d" 
                      name="Volume"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
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
                  <BarChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="collected_at"
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "none",
                        borderRadius: "8px",
                        color: "white"
                      }}
                    />
                    <Bar 
                      dataKey="sentiment" 
                      fill="#8884d8" 
                      name="Sentiment Score"
                    />
                    <Bar 
                      dataKey="confidence" 
                      fill="#82ca9d" 
                      name="Confidence"
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
