
import { Slider } from "@/components/ui/slider";
import { ProgressControlProps } from "./types";

export const ProgressControl = ({ 
  progress, 
  onProgressChange 
}: ProgressControlProps) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs text-muted-foreground min-w-8">
        {Math.floor(progress)}%
      </span>
      <Slider 
        value={[progress]} 
        min={0} 
        max={100} 
        step={1}
        onValueChange={(value) => onProgressChange(value[0])}
        className="flex-1"
      />
    </div>
  );
};
