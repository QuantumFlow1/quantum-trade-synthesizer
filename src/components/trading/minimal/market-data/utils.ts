
/**
 * Format a number with commas and fixed decimal places
 */
export const formatNumber = (num: number, decimals = 2) => {
  return num.toLocaleString('en-US', { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals 
  });
};
