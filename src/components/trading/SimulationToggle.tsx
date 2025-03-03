
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface SimulationToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const SimulationToggle = ({ enabled, onToggle }: SimulationToggleProps) => {
  const isEnglish = localStorage.getItem('preferredLanguage') === 'en';

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        id="simulation-mode"
      />
      <Label htmlFor="simulation-mode" className="cursor-pointer">
        {isEnglish ? "Simulation Mode" : "Simulatiemodus"}
      </Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              {isEnglish 
                ? "In simulation mode, orders are not actually executed. Ideal for testing strategies without risk."
                : "In simulatiemodus worden orders niet echt uitgevoerd. Ideaal om strategieën te testen zonder risico."}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
