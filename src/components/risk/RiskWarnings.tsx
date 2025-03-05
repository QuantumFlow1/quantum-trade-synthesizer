
import { AlertTriangle } from "lucide-react";
import { RiskSettings } from "@/types/risk";

interface RiskWarningsProps {
  settings: RiskSettings;
}

export const RiskWarnings = ({ settings }: RiskWarningsProps) => {
  return (
    <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
      <div className="flex items-center gap-2 text-yellow-400 mb-2">
        <AlertTriangle className="w-4 h-4" />
        <span className="font-medium">Risk Warnings</span>
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li>• Portfolio concentration in BTC above 30%</li>
        <li>• Margin usage approaching limit</li>
        {settings.daily_loss_notification && (
          <li>• Daily loss limit: ${settings.max_daily_loss}</li>
        )}
      </ul>
    </div>
  );
};
