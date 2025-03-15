
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatNumber } from "@/lib/utils";

interface BalanceHistoryProps {
  data: {
    date: string;
    balance: number;
  }[];
}

export function WalletBalanceHistory({ data }: BalanceHistoryProps) {
  // Process data for the chart
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedBalance: formatNumber(item.balance)
    }));
  }, [data]);

  // Calculate min and max for domain padding
  const minBalance = useMemo(() => {
    const min = Math.min(...data.map(d => d.balance));
    return min * 0.95; // 5% padding below
  }, [data]);

  const maxBalance = useMemo(() => {
    const max = Math.max(...data.map(d => d.balance));
    return max * 1.05; // 5% padding above
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis 
                domain={[minBalance, maxBalance]} 
                tickFormatter={value => `$${formatNumber(value, 0)}`}
              />
              <Tooltip 
                formatter={(value: any) => [`$${formatNumber(Number(value))}`, 'Balance']}
                labelFormatter={label => `Date: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorBalance)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
