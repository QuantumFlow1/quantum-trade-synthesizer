
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ParametersSectionProps } from "./types";
import { formatTemperature, formatTokens, isTemperatureValid, isMaxTokensValid } from "./utils";

export default function ParametersSection({
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  handleGenerate,
  isLoading
}: ParametersSectionProps) {
  return (
    <div className="w-full space-y-4 mt-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium">Temperature</span>
          <span className="text-sm text-muted-foreground">
            {formatTemperature(temperature)}
          </span>
        </div>
        <Slider
          value={[temperature]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={(value) => {
            if (isTemperatureValid(value[0])) {
              setTemperature(value[0]);
            }
          }}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium">Max Tokens</span>
          <span className="text-sm text-muted-foreground">
            {formatTokens(maxTokens)}
          </span>
        </div>
        <Slider
          value={[maxTokens]}
          min={1}
          max={4096}
          step={1}
          onValueChange={(value) => {
            if (isMaxTokensValid(value[0])) {
              setMaxTokens(value[0]);
            }
          }}
          className="w-full"
        />
      </div>
      
      <Button 
        className="w-full mt-6" 
        onClick={handleGenerate}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Response"
        )}
      </Button>
    </div>
  );
}
