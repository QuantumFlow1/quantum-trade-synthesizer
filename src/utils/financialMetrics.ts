
/**
 * Calculates the Sharpe Ratio for a given set of returns
 */
export const calculateSharpeRatio = (
  returns: number[],
  riskFreeRate: number = 0.02
): number => {
  if (returns.length === 0) return 0;

  const averageReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const standardDeviation = Math.sqrt(
    returns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) /
      returns.length
  );

  return standardDeviation === 0 
    ? 0 
    : (averageReturn - riskFreeRate) / standardDeviation;
};

/**
 * Calculates the maximum drawdown from a series of prices
 */
export const calculateMaxDrawdown = (prices: number[]): number => {
  let maxDrawdown = 0;
  let peak = prices[0];

  for (const price of prices) {
    if (price > peak) {
      peak = price;
    } else {
      const drawdown = (peak - price) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
  }

  return maxDrawdown;
};

/**
 * Calculates the Sortino Ratio for a given set of returns
 */
export const calculateSortinoRatio = (
  returns: number[],
  riskFreeRate: number = 0.02,
  targetReturn: number = 0
): number => {
  if (returns.length === 0) return 0;

  const averageReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const negativeReturns = returns.filter(r => r < targetReturn);
  
  if (negativeReturns.length === 0) return 0;

  const downsideDeviation = Math.sqrt(
    negativeReturns.reduce((sum, ret) => sum + Math.pow(ret - targetReturn, 2), 0) /
    negativeReturns.length
  );

  return downsideDeviation === 0 
    ? 0 
    : (averageReturn - riskFreeRate) / downsideDeviation;
};

/**
 * Calculates Return on Investment (ROI)
 */
export const calculateROI = (
  initialInvestment: number,
  finalValue: number
): number => {
  return ((finalValue - initialInvestment) / initialInvestment) * 100;
};

