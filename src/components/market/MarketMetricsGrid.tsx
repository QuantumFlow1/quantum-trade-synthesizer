
import { MarketCard } from './MarketCard';
import { ChartData } from './types';

interface MarketMetricsGridProps {
  data: ChartData[];
  onMarketClick: (market: string) => void;
}

export const MarketMetricsGrid = ({ data, onMarketClick }: MarketMetricsGridProps) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 animate-in fade-in duration-700">
    {data.map((item, index) => (
      <MarketCard
        key={item.name}
        name={item.name}
        price={item.price}
        change={item.change}
        volume={item.volume}
        high={item.high}
        low={item.low}
        index={index}
        onClick={onMarketClick}
      />
    ))}
  </div>
);
