
import { formatPrice, formatPercentage as formatPct, formatPriceChange } from '@/utils/tradeCalculations';

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
  return formatPct(num);
};

/**
 * Formats a large number with appropriate scaling (B, M, K)
 */
export const formatLargeNumber = (num: number | undefined): string => {
  if (num === undefined) return 'N/A';
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
};

/**
 * Formats a date to a readable string
 */
export const formatDate = (timestamp: number | undefined): string => {
  if (timestamp === undefined) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formats a simple date without time
 */
export const formatSimpleDate = (timestamp: number | undefined): string => {
  if (timestamp === undefined) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
