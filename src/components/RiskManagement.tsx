
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const riskMetrics = [
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

const RiskManagement = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Risk Management</h2>
      </div>
      <div className="space-y-6">
        {riskMetrics.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{metric.name}</span>
              <span
                className={`text-sm font-medium ${
                  metric.status === "high"
                    ? "text-red-400"
                    : metric.status === "medium"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {metric.value}%
              </span>
            </div>
            <Progress value={metric.value} max={metric.maxValue} className="h-2" />
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <div className="flex items-center gap-2 text-yellow-400 mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium">Risk Waarschuwingen</span>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Portfolio concentratie in BTC boven 30%</li>
          <li>• Margin gebruik nadert limiet</li>
        </ul>
      </div>
    </div>
  );
};

export default RiskManagement;
