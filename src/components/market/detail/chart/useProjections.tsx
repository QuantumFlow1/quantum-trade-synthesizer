
import { useState, useEffect } from 'react';
import { MarketData, HourlyProjection, ChartData } from '../../types';
import { generateChartData } from '../../utils/chartDataGenerator';
import { toast } from '@/hooks/use-toast';

export const useProjections = (marketData: MarketData, activeTimeframe: string) => {
  const [chartData, setChartData] = useState(generateChartData(marketData));
  const [hourlyProjections, setHourlyProjections] = useState<HourlyProjection[]>([]);
  const [isLoadingProjections, setIsLoadingProjections] = useState(false);

  useEffect(() => {
    if (activeTimeframe === '24h') {
      setIsLoadingProjections(true);
      
      // Simulate API call for projections
      setTimeout(() => {
        const projections: HourlyProjection[] = [];
        const currentHour = new Date().getHours();
        const basePrice = marketData.price;
        const volatilityFactor = Math.random() * 0.05 + 0.01; // 1-6% volatility
        
        // Generate 24 hours of projections
        for (let i = 1; i <= 24; i++) {
          const hour = (currentHour + i) % 24;
          const trendBias = Math.random() > 0.5 ? 1 : -1; // Random trend direction
          const hourlyChange = (Math.random() * volatilityFactor * basePrice) * trendBias;
          const projectedPrice = basePrice + (hourlyChange * i * 0.7); // Cumulative effect with dampening
          const confidence = Math.max(0, 1 - (i * 0.03)); // Confidence decreases over time
          
          // Determine trend and volatility
          const trend = hourlyChange > 0 ? 'up' : hourlyChange < 0 ? 'down' : 'neutral';
          const volatility = 
            Math.abs(hourlyChange) > (basePrice * 0.03) ? 'high' :
            Math.abs(hourlyChange) > (basePrice * 0.01) ? 'medium' : 'low';
          
          projections.push({
            hour,
            projectedPrice,
            confidence,
            trend,
            volatility
          });
        }
        
        setHourlyProjections(projections);
        
        // Modify chart data to include projections
        const currentData = generateChartData(marketData);
        const currentHourIndex = currentData.findIndex(d => {
          const date = new Date(d.name);
          return date.getHours() === currentHour;
        });
        
        if (currentHourIndex !== -1) {
          // Take all existing data up to current hour
          const baseData = currentData.slice(0, currentHourIndex + 1);
          
          // Add projection data points
          const projectedData = projections.map((proj, idx) => {
            const confidenceBand = proj.projectedPrice * (1 - proj.confidence * 0.2); // Wider bands for less confidence
            return {
              name: `${proj.hour.toString().padStart(2, '0')}:00`,
              price: currentData[0].price, // Maintain a reference line
              volume: 0,
              high: proj.projectedPrice + confidenceBand * 0.5, // Add confidence bands
              low: proj.projectedPrice - confidenceBand * 0.5,
              change: 0,
              projected: true,
              projectedPrice: proj.projectedPrice,
              confidence: proj.confidence,
              upperBand: proj.projectedPrice + confidenceBand * 0.5,
              lowerBand: proj.projectedPrice - confidenceBand * 0.5
            };
          });
          
          setChartData([...baseData, ...projectedData]);
        }
        
        setIsLoadingProjections(false);
        
        toast({
          title: "Hourly Projections Generated",
          description: "24-hour price projections have been calculated based on recent market activity",
          duration: 3000,
        });
      }, 1500);
    } else {
      // Reset to regular chart data for other timeframes
      setChartData(generateChartData(marketData));
    }
  }, [activeTimeframe, marketData]);

  const hasProjections = hourlyProjections.length > 0;

  return {
    chartData,
    hourlyProjections,
    isLoadingProjections,
    hasProjections
  };
};
