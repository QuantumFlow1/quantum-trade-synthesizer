
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from "recharts";

interface PriceChartProps {
  chartType: string;
  data: any[];
  visibleIndicators: {
    volume: boolean;
    ema: boolean;
    sma: boolean;
    macd: boolean;
    rsi: boolean;
    bollingerBands: boolean;
  };
}

export const PriceChart = ({ chartType, data, visibleIndicators }: PriceChartProps) => {
  // Controleer of er geldige data is om te renderen
  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-gray-50 rounded-lg border">
        <p className="text-gray-500">Geen chartdata beschikbaar</p>
      </div>
    );
  }

  // Zorg ervoor dat alle datapunten de benodigde velden hebben
  const validData = data.map(item => ({
    ...item,
    formattedDate: item.formattedDate || 'N/A',
    close: typeof item.close === 'number' ? item.close : 0,
    volume: typeof item.volume === 'number' ? item.volume : 0,
    sma: typeof item.sma === 'number' ? item.sma : null,
    ema: typeof item.ema === 'number' ? item.ema : null,
    upperBand: typeof item.upperBand === 'number' ? item.upperBand : null,
    lowerBand: typeof item.lowerBand === 'number' ? item.lowerBand : null,
    rsi: typeof item.rsi === 'number' ? item.rsi : null
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "area" ? (
          <AreaChart data={validData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
            {visibleIndicators.bollingerBands && (
              <>
                <Line type="monotone" dataKey="upperBand" name="Upper Band" stroke="#82ca9d" dot={false} strokeWidth={1} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="lowerBand" name="Lower Band" stroke="#82ca9d" dot={false} strokeWidth={1} strokeDasharray="3 3" />
              </>
            )}
            <Area type="monotone" dataKey="close" name="Price" stroke="#8884d8" fillOpacity={1} fill="url(#colorPrice)" />
            {visibleIndicators.sma && (
              <Line type="monotone" dataKey="sma" name="SMA" stroke="#ff7300" dot={false} strokeWidth={2} />
            )}
            {visibleIndicators.ema && (
              <Line type="monotone" dataKey="ema" name="EMA" stroke="#387908" dot={false} strokeWidth={2} />
            )}
            {visibleIndicators.rsi && validData[0]?.rsi !== null && (
              <Line type="monotone" dataKey="rsi" name="RSI" stroke="#d363ff" dot={false} strokeWidth={2} />
            )}
            {(visibleIndicators.bollingerBands || visibleIndicators.volume) && (
              <Legend verticalAlign="top" height={36}/>
            )}
          </AreaChart>
        ) : (
          <LineChart data={validData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedDate" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            {visibleIndicators.bollingerBands && (
              <>
                <Line type="monotone" dataKey="upperBand" name="Upper Band" stroke="#82ca9d" dot={false} strokeWidth={1} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="lowerBand" name="Lower Band" stroke="#82ca9d" dot={false} strokeWidth={1} strokeDasharray="3 3" />
              </>
            )}
            <Line type="monotone" dataKey="close" name="Price" stroke="#8884d8" strokeWidth={2} />
            {visibleIndicators.sma && (
              <Line type="monotone" dataKey="sma" name="SMA" stroke="#ff7300" dot={false} strokeWidth={2} />
            )}
            {visibleIndicators.ema && (
              <Line type="monotone" dataKey="ema" name="EMA" stroke="#387908" dot={false} strokeWidth={2} />
            )}
            {visibleIndicators.rsi && validData[0]?.rsi !== null && (
              <Line type="monotone" dataKey="rsi" name="RSI" stroke="#d363ff" dot={false} strokeWidth={2} />
            )}
            {(visibleIndicators.bollingerBands || visibleIndicators.volume) && (
              <Legend verticalAlign="top" height={36}/>
            )}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
