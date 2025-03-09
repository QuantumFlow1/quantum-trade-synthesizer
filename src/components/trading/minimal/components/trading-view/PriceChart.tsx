
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface PriceChartProps {
  chartType: string;
  data: any[];
  visibleIndicators: {
    volume: boolean;
    ema: boolean;
    sma: boolean;
  };
}

export const PriceChart = ({ chartType, data, visibleIndicators }: PriceChartProps) => {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "area" ? (
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedDate" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Area type="monotone" dataKey="close" stroke="#8884d8" fillOpacity={1} fill="url(#colorPrice)" />
            {visibleIndicators.sma && (
              <Line type="monotone" dataKey="sma" stroke="#ff7300" dot={false} strokeWidth={2} />
            )}
            {visibleIndicators.ema && (
              <Line type="monotone" dataKey="ema" stroke="#387908" dot={false} strokeWidth={2} />
            )}
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedDate" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="close" stroke="#8884d8" strokeWidth={2} />
            {visibleIndicators.sma && (
              <Line type="monotone" dataKey="sma" stroke="#ff7300" dot={false} strokeWidth={2} />
            )}
            {visibleIndicators.ema && (
              <Line type="monotone" dataKey="ema" stroke="#387908" dot={false} strokeWidth={2} />
            )}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
