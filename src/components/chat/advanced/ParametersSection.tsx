
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ParametersSectionProps {
  temperature: number;
  setTemperature: (value: number) => void;
  maxTokens: number;
  setMaxTokens: (value: number) => void;
  handleGenerate: () => void;
  isLoading: boolean;
}

const ParametersSection: React.FC<ParametersSectionProps> = ({
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  handleGenerate,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold mb-4">Parameters</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="temperature">Temperatuur</Label>
          <span className="text-sm">{temperature.toFixed(1)}</span>
        </div>
        <Slider
          id="temperature"
          min={0}
          max={1}
          step={0.1}
          value={[temperature]}
          onValueChange={(value) => setTemperature(value[0])}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="max-tokens">Max Tokens</Label>
        </div>
        <Input
          id="max-tokens"
          type="number"
          value={maxTokens}
          onChange={(e) => setMaxTokens(parseInt(e.target.value))}
          min={10}
          max={2000}
        />
      </div>
      
      <Button
        onClick={handleGenerate}
        className="w-full mt-4"
        disabled={isLoading}
      >
        {isLoading ? 'Bezig met genereren...' : 'Genereren'}
      </Button>
    </div>
  );
};

export default ParametersSection;
