
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { ParametersSectionProps } from './types';

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
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Bezig met genereren...
          </>
        ) : (
          'Genereren'
        )}
      </Button>
    </div>
  );
};

export default ParametersSection;
