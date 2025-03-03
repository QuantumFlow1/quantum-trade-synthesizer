
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface TemperatureControlProps {
  temperature: number;
  onTemperatureChange: (value: number[]) => void;
}

export function TemperatureControl({ temperature, onTemperatureChange }: TemperatureControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor="temperature" className="text-sm text-gray-700">Temperatuur</Label>
        <span className="text-sm font-medium text-primary">{temperature?.toFixed(1) || '0.7'}</span>
      </div>
      <Slider
        id="temperature"
        min={0}
        max={1}
        step={0.1}
        value={[temperature || 0.7]}
        onValueChange={onTemperatureChange}
      />
    </div>
  );
}
