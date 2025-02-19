
export interface TradingDataPoint {
  name: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma: number;
  ema: number;
  rsi: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  bollingerUpper: number;
  bollingerLower: number;
  stochastic: number;
  adx: number;
  trend: "up" | "down";
}

export const generateTradingData = (): TradingDataPoint[] => {
  const basePrice = 45000;
  const points = 24;
  return Array.from({ length: points }, (_, i) => {
    const hour = i.toString().padStart(2, '0') + ":00";
    const randomChange = Math.random() * 1000 - 500;
    const open = basePrice + randomChange;
    const high = open + Math.random() * 200;
    const low = open - Math.random() * 200;
    const close = (open + high + low) / 3;
    const volume = Math.random() * 100 + 50;
    
    const sma = (open + close) / 2;
    const ema = sma * 0.8 + (Math.random() * 100 - 50);
    const rsi = Math.random() * 100;
    const macd = Math.random() * 20 - 10;
    const macdSignal = macd + (Math.random() * 4 - 2);
    const macdHistogram = macd - macdSignal;
    const bollingerUpper = high + (Math.random() * 300);
    const bollingerLower = low - (Math.random() * 300);
    const stochastic = Math.random() * 100;
    const adx = Math.random() * 100;
    
    return {
      name: hour,
      open,
      high,
      low,
      close,
      volume,
      sma,
      ema,
      rsi,
      macd,
      macdSignal,
      macdHistogram,
      bollingerUpper,
      bollingerLower,
      stochastic,
      adx,
      trend: close > open ? "up" : "down"
    };
  });
};
