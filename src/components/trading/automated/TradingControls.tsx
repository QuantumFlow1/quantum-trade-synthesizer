
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Brain, Zap } from 'lucide-react';

interface TradingControlsProps {
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  isRapidMode: boolean;
  setIsRapidMode: (value: boolean) => void;
  simulationMode: boolean;
}

export const TradingControls = ({
  isActive,
  setIsActive,
  isRapidMode,
  setIsRapidMode,
  simulationMode
}: TradingControlsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Automated Trading {simulationMode ? "(Simulation)" : ""}</h2>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={setIsActive}
          aria-label="Toggle automated trading"
        />
      </div>

      <div className="flex items-center gap-4">
        <Label className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          Rapid Mode
        </Label>
        <Switch
          checked={isRapidMode}
          onCheckedChange={setIsRapidMode}
          aria-label="Toggle rapid trading mode"
        />
      </div>
    </div>
  );
};
