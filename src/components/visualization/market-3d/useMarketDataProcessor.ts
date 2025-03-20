
import { useState, useMemo } from 'react';

export interface ProcessedDataPoint {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  price: number;
  volume: number;
  date: string;
}

export const useMarketDataProcessor = (
  data: any[], 
  dataDensity: number, 
  viewMode: 'default' | 'volume' | 'price'
) => {
  // Process data for visualization
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Take a subset of data based on data density
    const stepSize = Math.max(1, Math.floor(data.length / (dataDensity / 10)));
    const filteredData = data.filter((_, i) => i % stepSize === 0);
    
    // Process the data for visualization
    const maxPrice = Math.max(...filteredData.map(d => d.high || d.close || 0));
    const minPrice = Math.min(...filteredData.map(d => d.low || d.close || 0));
    const priceRange = maxPrice - minPrice;
    const maxVolume = Math.max(...filteredData.map(d => d.volume || 0));

    return filteredData.map((item, index) => {
      const price = item.close || 0;
      const normalizedPrice = priceRange ? (price - minPrice) / priceRange * 2 - 1 : 0;
      const normalizedVolume = maxVolume ? (item.volume || 0) / maxVolume : 0.1;
      
      // Determine color based on price change
      const priceChange = index > 0 ? price - (filteredData[index - 1].close || 0) : 0;
      const color = priceChange > 0 ? '#22c55e' : priceChange < 0 ? '#ef4444' : '#3b82f6';
      
      return {
        position: [index * 0.3 - filteredData.length * 0.15, normalizedPrice, 0] as [number, number, number],
        size: viewMode === 'volume' 
          ? [0.1, normalizedVolume * 3, 0.1] as [number, number, number]
          : viewMode === 'price'
          ? [0.1, Math.abs(normalizedPrice) * 2, 0.1] as [number, number, number]
          : [0.1, 0.1, normalizedVolume * 5 + 0.1] as [number, number, number],
        color,
        price,
        volume: item.volume || 0,
        date: item.name || `Day ${index}`
      };
    });
  }, [data, dataDensity, viewMode]);

  return processedData;
};
