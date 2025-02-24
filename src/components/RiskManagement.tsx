
import { useState } from "react";
import { ShieldAlert, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth/AuthProvider";
import { RiskMetrics } from "./risk/RiskMetrics";
import { RiskSettingsForm } from "./risk/RiskSettingsForm";
import { RiskWarnings } from "./risk/RiskWarnings";
import { useRiskSettings } from "@/hooks/use-risk-settings";
import { RiskMetric } from "@/types/risk";

const RiskManagement = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { settings, isLoading, saveRiskSettings, setSettings } = useRiskSettings(user?.id);

  const riskMetrics: RiskMetric[] = [
    {
      name: "Portfolio Risk",
      value: 65,
      maxValue: 100,
      status: "medium",
    },
    {
      name: "Leverage Gebruik",
      value: 32,
      maxValue: 100,
      status: "low",
    },
    {
      name: "Drawdown",
      value: 15,
      maxValue: 100,
      status: "low",
    },
  ];

  const handleSaveSettings = async () => {
    if (settings) {
      const success = await saveRiskSettings(settings);
      if (success) {
        setIsEditing(false);
      }
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading risk settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Risk Management</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2"
        >
          <Settings2 className="w-4 h-4" />
          {isEditing ? "Cancel" : "Edit Settings"}
        </Button>
      </div>

      {isEditing && settings ? (
        <RiskSettingsForm 
          settings={settings}
          onSettingsChange={setSettings}
          onSave={handleSaveSettings}
        />
      ) : (
        <RiskMetrics metrics={riskMetrics} />
      )}
      
      {settings && <RiskWarnings settings={settings} />}
    </div>
  );
};

export default RiskManagement;

