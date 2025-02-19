
import { Card } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface MarketCardProps {
  name: string;
  price: number;
  change: number;
  volume: number;
  high: number;
  low: number;
  index: number;
  onClick: (market: string) => void;
}

export const MarketCard = ({ name, price, change, volume, high, low, index, onClick }: MarketCardProps) => (
  <Card 
    key={name} 
    className="p-4 backdrop-blur-xl bg-secondary/30 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300 hover:translate-y-[-2px] animate-in fade-in duration-700 cursor-pointer"
    style={{ animationDelay: `${index * 100}ms` }}
    onClick={() => onClick(name)}
    data-market={name}
    role="button"
    tabIndex={0}
    aria-label={`Bekijk details voor ${name}`}
  >
    <div className="flex flex-col relative overflow-hidden">
      <div className={`absolute inset-0 opacity-20 blur-xl ${
        Number(change) >= 0 ? 'bg-green-500' : 'bg-red-500'
      }`} />
      
      <span className="text-sm font-medium text-gradient">{name}</span>
      <span className="text-lg font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
        {formatNumber(price)}
      </span>
      <div className="flex items-center gap-1 mt-1">
        {Number(change) >= 0 ? (
          <ArrowUpIcon className="w-4 h-4 text-green-500 animate-pulse" />
        ) : (
          <ArrowDownIcon className="w-4 h-4 text-red-500 animate-pulse" />
        )}
        <span className={`text-sm ${Number(change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change}%
        </span>
      </div>
      <div className="mt-2 text-xs text-muted-foreground space-y-1">
        <div className="flex justify-between items-center">
          <span>Vol:</span>
          <span className="font-medium">{formatNumber(volume)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>H:</span>
          <span className="font-medium text-green-400">{formatNumber(high)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>L:</span>
          <span className="font-medium text-red-400">{formatNumber(low)}</span>
        </div>
      </div>
    </div>
  </Card>
);
