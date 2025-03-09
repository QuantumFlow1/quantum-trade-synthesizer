
import React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { BalanceHistoryDataPoint } from "../utils/balanceHistoryUtils";
import { WalletType } from "../../types/walletTypes";

interface BalanceAreaChartProps {
  data: BalanceHistoryDataPoint[];
  currency: string;
  walletType: WalletType;
}

export const BalanceAreaChart: React.FC<BalanceAreaChartProps> = ({ 
  data, 
  currency, 
  walletType 
}) => {
  // Different colors for crypto and fiat
  const areaColor = walletType === 'crypto' ? '#8884d8' : '#4CAF50';

  // Custom tooltip formatter to include currency symbol
  const formatTooltipValue = (value: number) => {
    return `${currency}${value.toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
      >
        <defs>
          <linearGradient id={`color${walletType}Balance`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={areaColor} stopOpacity={0.8} />
            <stop offset="95%" stopColor={areaColor} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }} 
          tickMargin={10}
          axisLine={{ opacity: 0.3 }}
          tickLine={false}
          interval={0}
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
          labelFormatter={(label, items) => {
            // Use fullDate for tooltip to always show the complete date
            if (items && items.length > 0 && items[0].payload) {
              return items[0].payload.fullDate;
            }
            return label;
          }}
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
          stroke={areaColor} 
          fillOpacity={1}
          fill={`url(#color${walletType}Balance)`}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
