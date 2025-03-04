
/**
 * Utility functions for trade calculations and price formatting
 */

/**
 * Calculate stop loss price based on entry price, direction, and percentage
 * @param entryPrice The entry price of the position
 * @param direction Trade direction ('buy'/'long' or 'sell'/'short')
 * @param percentage Stop loss percentage (defaults to 5%)
 * @returns Calculated stop loss price
 */
export const calculateStopLoss = (
  entryPrice: number,
  direction: 'buy' | 'sell' | 'long' | 'short',
  percentage: number = 5
): number => {
  const isBuyOrLong = direction === 'buy' || direction === 'long';
  return isBuyOrLong
    ? entryPrice * (1 - percentage / 100) // For buy/long, stop loss is below entry
    : entryPrice * (1 + percentage / 100); // For sell/short, stop loss is above entry
};

/**
 * Calculate take profit price based on entry price, direction, and percentage
 * @param entryPrice The entry price of the position
 * @param direction Trade direction ('buy'/'long' or 'sell'/'short')
 * @param percentage Take profit percentage (defaults to 10%)
 * @returns Calculated take profit price
 */
export const calculateTakeProfit = (
  entryPrice: number,
  direction: 'buy' | 'sell' | 'long' | 'short',
  percentage: number = 10
): number => {
  const isBuyOrLong = direction === 'buy' || direction === 'long';
  return isBuyOrLong
    ? entryPrice * (1 + percentage / 100) // For buy/long, take profit is above entry
    : entryPrice * (1 - percentage / 100); // For sell/short, take profit is below entry
};

/**
 * Calculate potential profit based on entry price, exit price, amount, and direction
 * @param entryPrice Entry price of the position
 * @param exitPrice Exit price of the position
 * @param amount Amount of the asset
 * @param direction Trade direction ('buy'/'long' or 'sell'/'short')
 * @returns Calculated profit/loss
 */
export const calculatePotentialProfit = (
  entryPrice: number,
  exitPrice: number,
  amount: number,
  direction: 'buy' | 'sell' | 'long' | 'short'
): number => {
  const isBuyOrLong = direction === 'buy' || direction === 'long';
  return isBuyOrLong
    ? (exitPrice - entryPrice) * amount // For buy/long
    : (entryPrice - exitPrice) * amount; // For sell/short
};

/**
 * Calculate percentage change between two prices
 * @param oldPrice Original price
 * @param newPrice New price
 * @returns Percentage change
 */
export const calculatePercentageChange = (oldPrice: number, newPrice: number): number => {
  return ((newPrice - oldPrice) / oldPrice) * 100;
};

/**
 * Format a price with appropriate currency symbol and decimal places
 * @param price Price to format
 * @param currency Currency symbol (defaults to $)
 * @param decimals Number of decimal places (defaults to 2)
 * @returns Formatted price string
 */
export const formatPrice = (
  price: number | undefined,
  currency: string = '$',
  decimals: number = 2
): string => {
  if (price === undefined) return 'N/A';
  return `${currency}${price.toFixed(decimals)}`;
};

/**
 * Format a price change with + or - prefix
 * @param priceChange The price change value
 * @param currency Currency symbol (defaults to $)
 * @param decimals Number of decimal places (defaults to 2)
 * @returns Formatted price change string
 */
export const formatPriceChange = (
  priceChange: number | undefined,
  currency: string = '$',
  decimals: number = 2
): string => {
  if (priceChange === undefined) return 'N/A';
  const prefix = priceChange >= 0 ? '+' : '';
  return `${prefix}${currency}${priceChange.toFixed(decimals)}`;
};

/**
 * Format a percentage value with + or - prefix
 * @param percentage The percentage value
 * @param decimals Number of decimal places (defaults to 2)
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  percentage: number | undefined,
  decimals: number = 2
): string => {
  if (percentage === undefined) return 'N/A';
  const prefix = percentage >= 0 ? '+' : '';
  return `${prefix}${percentage.toFixed(decimals)}%`;
};

/**
 * Determine whether a trade is profitable
 * @param entryPrice Entry price of the position
 * @param currentPrice Current price of the asset
 * @param direction Trade direction ('buy'/'long' or 'sell'/'short')
 * @returns Boolean indicating profitability
 */
export const isProfitable = (
  entryPrice: number,
  currentPrice: number,
  direction: 'buy' | 'sell' | 'long' | 'short'
): boolean => {
  const isBuyOrLong = direction === 'buy' || direction === 'long';
  return isBuyOrLong
    ? currentPrice > entryPrice // For buy/long positions
    : currentPrice < entryPrice; // For sell/short positions
};

/**
 * Calculate risk/reward ratio for a trade
 * @param entryPrice Entry price of the position
 * @param stopLoss Stop loss price
 * @param takeProfit Take profit price
 * @param direction Trade direction ('buy'/'long' or 'sell'/'short')
 * @returns Risk/reward ratio as a number
 */
export const calculateRiskRewardRatio = (
  entryPrice: number,
  stopLoss: number,
  takeProfit: number,
  direction: 'buy' | 'sell' | 'long' | 'short'
): number => {
  const isBuyOrLong = direction === 'buy' || direction === 'long';
  
  // Calculate risk (absolute distance from entry to stop loss)
  const risk = isBuyOrLong
    ? entryPrice - stopLoss
    : stopLoss - entryPrice;
  
  // Calculate reward (absolute distance from entry to take profit)
  const reward = isBuyOrLong
    ? takeProfit - entryPrice
    : entryPrice - takeProfit;
  
  // Avoid division by zero
  if (risk === 0) return 0;
  
  // Return the ratio of reward to risk
  return reward / risk;
};
