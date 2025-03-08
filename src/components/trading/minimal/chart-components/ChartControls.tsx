
import { Badge } from "@/components/ui/badge";

interface ChartControlsProps {
  showVolume: boolean;
  setShowVolume: (show: boolean) => void;
  showIndicators: boolean;
  setShowIndicators: (show: boolean) => void;
}

export const ChartControls = ({ 
  showVolume, 
  setShowVolume, 
  showIndicators, 
  setShowIndicators 
}: ChartControlsProps) => {
  return (
    <div className="flex justify-end gap-2 mb-2">
      <Badge 
        variant="outline" 
        className={`cursor-pointer ${showVolume ? 'bg-primary/10' : ''}`}
        onClick={() => setShowVolume(!showVolume)}
      >
        Volume
      </Badge>
      <Badge 
        variant="outline" 
        className={`cursor-pointer ${showIndicators ? 'bg-primary/10' : ''}`}
        onClick={() => setShowIndicators(!showIndicators)}
      >
        Indicators
      </Badge>
    </div>
  );
};
