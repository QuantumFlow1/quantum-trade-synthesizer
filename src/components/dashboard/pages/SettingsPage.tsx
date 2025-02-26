
import AutoTrading from "@/components/AutoTrading";
import { Card } from "@/components/ui/card";
import { Settings, Zap } from "lucide-react";
import { DashboardSettings } from "@/components/DashboardSettings";

export const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <h2 className="text-xl font-bold mb-4 flex items-center"><Settings className="w-5 h-5 mr-2" /> Dashboard Settings</h2>
        <DashboardSettings />
      </Card>
      
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <h2 className="text-xl font-bold mb-4 flex items-center"><Zap className="w-5 h-5 mr-2" /> Auto Trading Settings</h2>
        <AutoTrading />
      </Card>
    </div>
  );
};
