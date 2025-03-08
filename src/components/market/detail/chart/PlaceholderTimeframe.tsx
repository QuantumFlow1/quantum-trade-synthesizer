
import { Clock } from 'lucide-react';

interface PlaceholderTimeframeProps {
  timeframe: string;
}

export const PlaceholderTimeframe = ({ timeframe }: PlaceholderTimeframeProps) => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
      <div className="text-center">
        <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p>{timeframe} data coming soon</p>
      </div>
    </div>
  );
};
