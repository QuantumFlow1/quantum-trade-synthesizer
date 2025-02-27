
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

export const generateTradingData = (
  timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w" = "1h"
): TradingDataPoint[] => {
  const basePrice = 45000;
  
  // Adjust points based on timeframe
  let points = 24;
  let volatilityFactor = 1;
  
  switch(timeframe) {
    case "1m": 
      points = 60; 
      volatilityFactor = 0.3;
      break;
    case "5m": 
      points = 48; 
      volatilityFactor = 0.5;
      break;
    case "15m": 
      points = 32; 
      volatilityFactor = 0.7;
      break;
    case "1h": 
      points = 24; 
      volatilityFactor = 1;
      break;
    case "4h": 
      points = 18; 
      volatilityFactor = 1.5;
      break;
    case "1d": 
      points = 30; 
      volatilityFactor = 2;
      break;
    case "1w": 
      points = 12; 
      volatilityFactor = 3;
      break;
  }
  
  return Array.from({ length: points }, (_, i) => {
    // Generate time label based on timeframe
    let timeLabel;
    const now = new Date();
    switch(timeframe) {
      case "1m":
        const minuteDate = new Date(now);
        minuteDate.setMinutes(now.getMinutes() - (points - i - 1));
        timeLabel = minuteDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        break;
      case "5m":
        const fiveMinDate = new Date(now);
        fiveMinDate.setMinutes(now.getMinutes() - (points - i - 1) * 5);
        timeLabel = fiveMinDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        break;
      case "15m":
        const fifteenMinDate = new Date(now);
        fifteenMinDate.setMinutes(now.getMinutes() - (points - i - 1) * 15);
        timeLabel = fifteenMinDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        break;
      case "1h":
        const hourDate = new Date(now);
        hourDate.setHours(now.getHours() - (points - i - 1));
        timeLabel = hourDate.getHours().toString().padStart(2, '0') + ":00";
        break;
      case "4h":
        const fourHourDate = new Date(now);
        fourHourDate.setHours(now.getHours() - (points - i - 1) * 4);
        const fourHour = Math.floor(fourHourDate.getHours() / 4) * 4;
        timeLabel = fourHour.toString().padStart(2, '0') + ":00";
        break;
      case "1d":
        const dayDate = new Date(now);
        dayDate.setDate(now.getDate() - (points - i - 1));
        timeLabel = dayDate.toLocaleDateString([], {month: 'short', day: 'numeric'});
        break;
      case "1w":
        const weekDate = new Date(now);
        weekDate.setDate(now.getDate() - (points - i - 1) * 7);
        timeLabel = "W" + Math.ceil(weekDate.getDate() / 7) + " " + weekDate.toLocaleDateString([], {month: 'short'});
        break;
      default:
        timeLabel = i.toString();
    }
    
    const randomChange = (Math.random() * 1000 - 500) * volatilityFactor;
    const open = basePrice + randomChange;
    const high = open + Math.random() * 200 * volatilityFactor;
    const low = open - Math.random() * 200 * volatilityFactor;
    const close = (open + high + low) / 3 + (Math.random() * 100 - 50) * volatilityFactor;
    const volume = Math.random() * 100 + 50;
    
    const sma = (open + close) / 2;
    const ema = sma * 0.8 + (Math.random() * 100 - 50) * volatilityFactor;
    const rsi = Math.random() * 100;
    const macd = Math.random() * 20 - 10;
    const macdSignal = macd + (Math.random() * 4 - 2);
    const macdHistogram = macd - macdSignal;
    const bollingerUpper = high + (Math.random() * 300) * volatilityFactor;
    const bollingerLower = low - (Math.random() * 300) * volatilityFactor;
    const stochastic = Math.random() * 100;
    const adx = Math.random() * 100;
    
    return {
      name: timeLabel,
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
