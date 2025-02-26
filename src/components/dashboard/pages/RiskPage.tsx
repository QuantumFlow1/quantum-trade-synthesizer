
import RiskManagement from "@/components/RiskManagement";
import Alerts from "@/components/Alerts";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export const RiskPage = () => {
  return (
    <div className="space-y-6">
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <RiskManagement />
      </Card>
      
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <h2 className="text-xl font-bold mb-4 flex items-center"><AlertCircle className="w-5 h-5 mr-2" /> Alerts</h2>
        <Alerts />
      </Card>
    </div>
  );
};
