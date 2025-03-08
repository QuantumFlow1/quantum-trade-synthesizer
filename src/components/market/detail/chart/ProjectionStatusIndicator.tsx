
import { TrendingUp } from 'lucide-react';

interface ProjectionStatusIndicatorProps {
  isLoading: boolean;
  hasProjections: boolean;
}

export const ProjectionStatusIndicator = ({ isLoading, hasProjections }: ProjectionStatusIndicatorProps) => {
  if (isLoading) {
    return (
      <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm py-1 px-2 rounded-md text-xs flex items-center z-10">
        <TrendingUp className="h-3 w-3 mr-1 animate-pulse" />
        Generating projections...
      </div>
    );
  }

  if (hasProjections) {
    return (
      <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm py-1 px-2 rounded-md text-xs flex items-center z-10">
        <TrendingUp className="h-3 w-3 mr-1 text-primary" />
        Showing 24h projections
      </div>
    );
  }

  return null;
};
