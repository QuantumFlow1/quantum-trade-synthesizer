
import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from "recharts";
import { AlertCircle } from "lucide-react";

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
  // Validation function for data
  const validateDataPoint = (value: any): boolean => {
    return value !== undefined && value !== null && !isNaN(value);
  };

  // Process and optimize data - use useMemo to prevent recalculations on every render
  const { validData, hasValidSma, hasValidEma, hasValidBollingerBands, hasValidRsi, minPrice, maxPrice } = useMemo(() => {
    // Controleer of er geldige data is om te renderen
    if (!data || data.length === 0) {
      return {
        validData: [],
        hasValidSma: false,
        hasValidEma: false,
        hasValidBollingerBands: false,
        hasValidRsi: false,
        minPrice: 0,
        maxPrice: 0
      };
    }

    // Limit data points for better performance
    const MAX_DATA_POINTS = 100;
    const dataToProcess = data.length > MAX_DATA_POINTS 
      ? data.filter((_, i) => i % Math.ceil(data.length / MAX_DATA_POINTS) === 0)
      : data;

    // Zorg ervoor dat alle datapunten de benodigde velden hebben
    const processed = dataToProcess.map(item => {
      const base = {
        ...item,
        formattedDate: item.formattedDate || new Date(item.timestamp).toLocaleDateString('nl', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        close: validateDataPoint(item.close) ? item.close : 0,
        volume: validateDataPoint(item.volume) ? item.volume : 0,
      };

      // Alleen indicators toevoegen als ze geldig zijn
      if (visibleIndicators.sma && validateDataPoint(item.sma)) base.sma = item.sma;
      if (visibleIndicators.ema && validateDataPoint(item.ema)) base.ema = item.ema;
      if (visibleIndicators.bollingerBands) {
        if (validateDataPoint(item.upperBand)) base.upperBand = item.upperBand;
        if (validateDataPoint(item.lowerBand)) base.lowerBand = item.lowerBand;
      }
      if (visibleIndicators.rsi && validateDataPoint(item.rsi)) base.rsi = item.rsi;

      return base;
    });

    // Controleer of we geldige indicators hebben
    const hasSma = visibleIndicators.sma && processed.some(d => d.sma !== undefined);
    const hasEma = visibleIndicators.ema && processed.some(d => d.ema !== undefined);
    const hasBollingerBands = visibleIndicators.bollingerBands && 
      processed.some(d => d.upperBand !== undefined && d.lowerBand !== undefined);
    const hasRsi = visibleIndicators.rsi && processed.some(d => d.rsi !== undefined);

    // Bereken automatisch min en max voor de Y-as
    const prices = processed.map(d => d.close).filter(validateDataPoint);
    const min = Math.min(...prices) * 0.995; // 0.5% buffer onder
    const max = Math.max(...prices) * 1.005; // 0.5% buffer boven

    return {
      validData: processed,
      hasValidSma: hasSma,
      hasValidEma: hasEma,
      hasValidBollingerBands: hasBollingerBands,
      hasValidRsi: hasRsi,
      minPrice: min,
      maxPrice: max
    };
  }, [data, visibleIndicators]);

  // Display a placeholder when no data is available
  if (validData.length === 0) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-gray-50 rounded-lg border flex-col">
        <AlertCircle className="h-10 w-10 text-amber-500 mb-2" />
        <p className="text-gray-500 font-medium">Geen chartdata beschikbaar</p>
        <p className="text-gray-400 text-sm mt-1">Controleer verbinding of selecteer een andere tijdsperiode</p>
      </div>
    );
  }

  // Rendering optimization - chart format based on data points
  const shouldUseSimplifiedChart = validData.length > 50;

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
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => typeof value === 'string' ? value.split(' ')[0] : value}
              interval={shouldUseSimplifiedChart ? Math.floor(validData.length / 10) : 0}
            />
            <YAxis 
              domain={[minPrice, maxPrice]} 
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => value.toLocaleString('nl', { maximumFractionDigits: 0 })}
            />
            <Tooltip 
              formatter={(value: any) => [
                value.toLocaleString('nl', { maximumFractionDigits: 2 }), 
                'Prijs'
              ]}
              labelFormatter={(label) => `Datum: ${label}`}
            />
            {hasValidBollingerBands && !shouldUseSimplifiedChart && (
              <>
                <Line type="monotone" dataKey="upperBand" name="Upper Band" stroke="#82ca9d" dot={false} strokeWidth={1} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="lowerBand" name="Lower Band" stroke="#82ca9d" dot={false} strokeWidth={1} strokeDasharray="3 3" />
              </>
            )}
            <Area type="monotone" dataKey="close" name="Price" stroke="#8884d8" fillOpacity={1} fill="url(#colorPrice)" />
            {hasValidSma && (
              <Line type="monotone" dataKey="sma" name="SMA" stroke="#ff7300" dot={false} strokeWidth={2} />
            )}
            {hasValidEma && (
              <Line type="monotone" dataKey="ema" name="EMA" stroke="#387908" dot={false} strokeWidth={2} />
            )}
            {hasValidRsi && !shouldUseSimplifiedChart && (
              <Line type="monotone" dataKey="rsi" name="RSI" stroke="#d363ff" dot={false} strokeWidth={2} />
            )}
            {(hasValidBollingerBands || visibleIndicators.volume || hasValidSma || hasValidEma || hasValidRsi) && (
              <Legend verticalAlign="top" height={36}/>
            )}
          </AreaChart>
        ) : (
          <LineChart data={validData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => typeof value === 'string' ? value.split(' ')[0] : value}
              interval={shouldUseSimplifiedChart ? Math.floor(validData.length / 10) : 0}
            />
            <YAxis 
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => value.toLocaleString('nl', { maximumFractionDigits: 0 })}
            />
            <Tooltip 
              formatter={(value: any) => [
                value.toLocaleString('nl', { maximumFractionDigits: 2 }), 
                'Prijs'
              ]}
              labelFormatter={(label) => `Datum: ${label}`}
            />
            {hasValidBollingerBands && !shouldUseSimplifiedChart && (
              <>
                <Line type="monotone" dataKey="upperBand" name="Upper Band" stroke="#82ca9d" dot={false} strokeWidth={1} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="lowerBand" name="Lower Band" stroke="#82ca9d" dot={false} strokeWidth={1} strokeDasharray="3 3" />
              </>
            )}
            <Line 
              type="monotone" 
              dataKey="close" 
              name="Price" 
              stroke="#8884d8" 
              strokeWidth={2} 
              dot={!shouldUseSimplifiedChart}
            />
            {hasValidSma && (
              <Line type="monotone" dataKey="sma" name="SMA" stroke="#ff7300" dot={false} strokeWidth={2} />
            )}
            {hasValidEma && (
              <Line type="monotone" dataKey="ema" name="EMA" stroke="#387908" dot={false} strokeWidth={2} />
            )}
            {hasValidRsi && !shouldUseSimplifiedChart && (
              <Line type="monotone" dataKey="rsi" name="RSI" stroke="#d363ff" dot={false} strokeWidth={2} />
            )}
            {(hasValidBollingerBands || visibleIndicators.volume || hasValidSma || hasValidEma || hasValidRsi) && (
              <Legend verticalAlign="top" height={36}/>
            )}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
