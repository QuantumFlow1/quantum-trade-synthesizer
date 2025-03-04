
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, Lightbulb } from "lucide-react";

interface SimulationToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const SimulationToggle = ({ enabled, onToggle }: SimulationToggleProps) => {
  const isEnglish = localStorage.getItem('preferredLanguage') === 'en';

  return (
    <div className={`flex items-center space-x-2 p-3 ${enabled ? 'bg-green-500/20' : 'bg-green-500/10'} border ${enabled ? 'border-green-500/30' : 'border-green-500/20'} rounded-md transition-colors duration-300`}>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        id="simulation-mode"
        className={enabled ? "bg-green-500" : ""}
      />
      <Label htmlFor="simulation-mode" className="cursor-pointer font-medium">
        {isEnglish ? "Simulation Mode" : "Simulatiemodus"}
      </Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              {enabled && (
                <div className="ml-2 flex items-center text-xs text-green-600 font-medium">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  {isEnglish ? "Active" : "Actief"}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>
              {isEnglish 
                ? "In simulation mode, orders are not actually executed. Ideal for testing strategies without risk. Our guide recommends starting with simulations to develop effective trading strategies."
                : "In simulatiemodus worden orders niet echt uitgevoerd. Ideaal om strategieën te testen zonder risico. Onze gids raadt aan om te beginnen met simulaties om effectieve handelsstrategieën te ontwikkelen."}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
