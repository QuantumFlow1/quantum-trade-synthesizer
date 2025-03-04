
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MarketData } from '../types';
import { formatCurrency, formatLargeNumber, formatPercentage } from '../utils/formatters';
import { useIsMobile } from '@/hooks/use-mobile';

interface MarketStatisticsProps {
  marketData: MarketData;
}

export const MarketStatistics: React.FC<MarketStatisticsProps> = ({ marketData }) => {
  const isMobile = useIsMobile();
  const [expandedSections, setExpandedSections] = useState({
    priceStats: true,
    marketStats: !isMobile,
    supplyStats: !isMobile
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Format and prepare data
  const priceChange24h = marketData.change24h || 0;
  const priceChange7d = marketData.change7d || 0;
  const priceChange30d = marketData.change30d || 0;
  const allTimeHigh = marketData.ath || 0;
  const allTimeLow = marketData.atl || 0;

  // Calculate ATH and ATL percentages
  const athChangePercent = allTimeHigh > 0 
    ? ((marketData.price - allTimeHigh) / allTimeHigh) * 100 
    : 0;
  
  const atlChangePercent = allTimeLow > 0 
    ? ((marketData.price - allTimeLow) / allTimeLow) * 100 
    : 0;

  // Helper function for stat item rendering
  const StatItem = ({ label, value, additionalValue = null, isPositive = null, className = '' }) => (
    <div className={`flex justify-between py-2 border-b border-secondary/20 ${className}`}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-right">
        <span className="font-medium">{value}</span>
        {additionalValue && (
          <span className={`ml-2 text-sm ${
            isPositive === true 
              ? 'text-green-500' 
              : isPositive === false 
                ? 'text-red-500' 
                : 'text-muted-foreground'
          }`}>
            {additionalValue}
          </span>
        )}
      </div>
    </div>
  );

  const SectionHeader = ({ title, isExpanded, onToggle }) => (
    <div 
      className="flex justify-between items-center py-3 cursor-pointer hover:bg-secondary/10 rounded-md px-2" 
      onClick={onToggle}
    >
      <h3 className="font-semibold">{title}</h3>
      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Price Statistics Section */}
      <div className="bg-card/30 p-4 rounded-lg">
        <SectionHeader 
          title="Price Statistics" 
          isExpanded={expandedSections.priceStats}
          onToggle={() => toggleSection('priceStats')}
        />
        
        {expandedSections.priceStats && (
          <div className="mt-2 space-y-1">
            <StatItem 
              label="Current Price" 
              value={formatCurrency(marketData.price)} 
            />
            <StatItem 
              label="24h Change" 
              value={formatCurrency(marketData.price * (1 + priceChange24h / 100) - marketData.price)}
              additionalValue={formatPercentage(priceChange24h)}
              isPositive={priceChange24h > 0}
            />
            <StatItem 
              label="7d Change" 
              value={formatCurrency(marketData.price * (1 + priceChange7d / 100) - marketData.price)}
              additionalValue={formatPercentage(priceChange7d)}
              isPositive={priceChange7d > 0}
            />
            <StatItem 
              label="30d Change" 
              value={formatCurrency(marketData.price * (1 + priceChange30d / 100) - marketData.price)}
              additionalValue={formatPercentage(priceChange30d)}
              isPositive={priceChange30d > 0}
            />
            <StatItem 
              label="All-Time High" 
              value={formatCurrency(allTimeHigh)}
              additionalValue={formatPercentage(athChangePercent)}
              isPositive={athChangePercent > 0}
            />
            <StatItem 
              label="All-Time Low" 
              value={formatCurrency(allTimeLow)}
              additionalValue={formatPercentage(atlChangePercent)}
              isPositive={atlChangePercent > 0}
            />
          </div>
        )}
      </div>

      {/* Market Statistics Section */}
      <div className="bg-card/30 p-4 rounded-lg">
        <SectionHeader 
          title="Market Statistics" 
          isExpanded={expandedSections.marketStats}
          onToggle={() => toggleSection('marketStats')}
        />
        
        {expandedSections.marketStats && (
          <div className="mt-2 space-y-1">
            <StatItem 
              label="Market Cap" 
              value={`$${formatLargeNumber(marketData.marketCap)}`} 
            />
            <StatItem 
              label="24h Trading Volume" 
              value={`$${formatLargeNumber(marketData.volume || 0)}`}
            />
            <StatItem 
              label="Market Cap Rank" 
              value={`#${marketData.rank || '-'}`}
            />
            <StatItem 
              label="Market Dominance" 
              value={`${((marketData.marketCap / 1000000000000) * 100).toFixed(2)}%`}
            />
          </div>
        )}
      </div>

      {/* Supply Statistics Section */}
      <div className="bg-card/30 p-4 rounded-lg">
        <SectionHeader 
          title="Supply Information" 
          isExpanded={expandedSections.supplyStats}
          onToggle={() => toggleSection('supplyStats')}
        />
        
        {expandedSections.supplyStats && (
          <div className="mt-2 space-y-1">
            <StatItem 
              label="Circulating Supply" 
              value={formatLargeNumber(marketData.circulatingSupply || 0)} 
            />
            <StatItem 
              label="Total Supply" 
              value={formatLargeNumber(marketData.totalSupply || 0)}
            />
            <StatItem 
              label="Max Supply" 
              value={formatLargeNumber(marketData.maxSupply || 0)}
            />
            <StatItem 
              label="Supply Ratio" 
              value={`${marketData.totalSupply && marketData.maxSupply ? 
                ((Number(marketData.totalSupply) / Number(marketData.maxSupply)) * 100).toFixed(2) : 
                '0'}%`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
