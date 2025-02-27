
import { Slider } from "@/components/ui/slider";
import { Turtle, Rabbit } from "lucide-react";
import { SpeedControlProps } from "./types";

export const SpeedControl = ({ currentSpeed, onSpeedChange }: SpeedControlProps) => {
  return (
    <div className="flex items-center space-x-1">
      <Turtle className="h-4 w-4 text-muted-foreground" />
      <Slider 
        className="w-24"
        value={[currentSpeed]} 
        min={0.5} 
        max={5} 
        step={0.5}
        onValueChange={(value) => onSpeedChange(value[0])}
      />
      <Rabbit className="h-4 w-4 text-muted-foreground" />
    </div>
  );
};
