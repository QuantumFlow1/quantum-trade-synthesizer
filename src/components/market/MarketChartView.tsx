
import { ResponsiveContainer } from 'recharts';
import { ChartData } from './types';
import { OverviewChart } from './chart-components/OverviewChart';
import { VolumeChart } from './chart-components/VolumeChart';
import { PriceChart } from './chart-components/PriceChart';

interface MarketChartViewProps {
  data: ChartData[];
  type: 'overview' | 'volume' | 'price';
}

export const MarketChartView = ({ data, type }: MarketChartViewProps) => {
  return (
    <div className="h-[350px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'overview' ? (
          <OverviewChart data={data} />
        ) : type === 'volume' ? (
          <VolumeChart data={data} />
        ) : (
          <PriceChart data={data} />
        )}
      </ResponsiveContainer>
    </div>
  );
};
