
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
    <div className="flex items-center space-x-2 p-2 bg-green-500/10 border border-green-500/20 rounded-md">
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
