
import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { Card } from "@/components/ui/card";

interface WalletBalanceHistoryProps {
  currency: string;
  data?: {
    date: string;
    balance: number;
  }[];
}

export const WalletBalanceHistory = ({ 
  currency, 
  data 
}: WalletBalanceHistoryProps) => {
  // Generate mock data if none provided
  const mockData = React.useMemo(() => {
    // Get last 30 days
    const generateMockData = () => {
      const result = [];
      const now = new Date();
      
      // Start with a base value and add some randomness
      let baseValue = 10000;
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Add some randomness to simulate price movements
        // More weight to previous value to simulate realistic price movements
        const randomChange = (Math.random() - 0.48) * 500; // Slightly biased towards growth
        baseValue = baseValue + randomChange;
        
        result.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          balance: Math.max(baseValue, 1000) // Ensure we don't go below 1000
        });
      }
      
      return result;
    };
    
    return data || generateMockData();
  }, [data]);

  // Custom tooltip formatter to include currency symbol
  const formatTooltipValue = (value: number) => {
    return `${currency}${value.toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Balance History</h3>
      <Card className="p-4 bg-secondary/20 backdrop-blur-sm">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickMargin={10}
                axisLine={{ opacity: 0.3 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickFormatter={(value) => `${currency}${value.toLocaleString(undefined, { notation: 'compact' })}`}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip 
                formatter={formatTooltipValue}
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: 'none', 
                  borderRadius: '4px',
                  color: 'white'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#8884d8" 
                fillOpacity={1}
                fill="url(#colorBalance)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
