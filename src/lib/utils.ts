
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as a currency string with $ symbol and commas
 */
export function formatCurrency(value: number): string {
  // Handle edge cases for NaN, undefined, or null values
  if (value === undefined || value === null || isNaN(value)) {
    return "$0.00";
  }
  
  // Format the number with $ symbol, commas, and 2 decimal places
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format a percentage value with % symbol and 2 decimal places
 */
export function formatPercentage(value: number): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "0.00%";
  }
  
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

/**
 * Format a number with commas and specified decimal places
 */
export function formatNumber(num: number, decimals = 2): string {
  if (num === undefined || num === null || isNaN(num)) {
    return "0.00";
  }
  
  return num.toLocaleString('en-US', { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals 
  });
}

/**
 * Truncate a string if it's longer than the specified length
 */
export function truncateString(str: string, maxLength: number = 20): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  
  return `${str.substring(0, maxLength)}...`;
}
