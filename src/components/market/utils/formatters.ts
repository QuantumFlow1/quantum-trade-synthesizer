
/**
 * Formats a number as a currency with appropriate scaling (B, M, K)
 */
export const formatCurrency = (num: number | undefined): string => {
  if (num === undefined) return 'N/A';
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

/**
 * Formats a number with specified decimal places
 */
export const formatNumber = (num: number | undefined, decimals = 2): string => {
  if (num === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals 
  }).format(num);
};

/**
 * Formats a percentage value with + or - prefix
 */
export const formatPercentage = (num: number | undefined): string => {
  if (num === undefined) return 'N/A';
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
};
