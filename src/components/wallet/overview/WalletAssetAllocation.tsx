
import React from "react";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { WalletType } from "../types/walletTypes";

interface WalletAssetAllocationProps {
  walletType: WalletType;
}

export const WalletAssetAllocation = ({ walletType }: WalletAssetAllocationProps) => {
  // Generate different mock data based on wallet type
  const mockData = React.useMemo(() => {
    if (walletType === 'crypto') {
      return [
        { name: 'Bitcoin', value: 45, color: '#f7931a' },
        { name: 'Ethereum', value: 30, color: '#627eea' },
        { name: 'Solana', value: 15, color: '#00ffbd' },
        { name: 'Other', value: 10, color: '#8884d8' },
      ];
    } else {
      return [
        { name: 'Checking', value: 60, color: '#4CAF50' },
        { name: 'Savings', value: 30, color: '#2196F3' },
        { name: 'Money Market', value: 10, color: '#FFC107' },
      ];
    }
  }, [walletType]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {walletType === 'crypto' ? 'Crypto Asset Allocation' : 'Fiat Account Allocation'}
      </h3>
      <Card className="p-4 bg-secondary/20 backdrop-blur-sm">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {mockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: 'none', 
                  borderRadius: '4px',
                  color: 'white'
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
