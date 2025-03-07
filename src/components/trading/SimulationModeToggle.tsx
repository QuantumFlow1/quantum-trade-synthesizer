
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SimulationModeToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  apiStatus: 'checking' | 'available' | 'unavailable';
}

export const SimulationModeToggle: React.FC<SimulationModeToggleProps> = ({
  enabled,
  onChange,
  apiStatus
}) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-secondary/10 mb-4">
      <div className="space-y-0.5">
        <Label className="text-sm font-medium" htmlFor="simulation-mode">
          Simulation Mode
        </Label>
        <p className="text-xs text-muted-foreground">
          {apiStatus === 'unavailable'
            ? "API is unavailable. Simulation mode recommended."
            : "Trade with virtual funds for practice"}
        </p>
      </div>
      <Switch
        id="simulation-mode"
        checked={enabled}
        onCheckedChange={onChange}
        className={enabled ? "bg-green-500" : ""}
      />
    </div>
  );
};
