
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SimulationToggleProps {
  isSimulated: boolean;
  onToggle: (checked: boolean) => void;
}

export const SimulationToggle = ({ isSimulated, onToggle }: SimulationToggleProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Label htmlFor="simulation-mode">Simulation Mode</Label>
      <Switch
        id="simulation-mode"
        checked={isSimulated}
        onCheckedChange={onToggle}
      />
    </div>
  );
};
