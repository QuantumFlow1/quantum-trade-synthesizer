
import { Progress } from "@/components/ui/progress";
import { RiskMetric } from "@/types/risk";

interface RiskMetricsProps {
  metrics: RiskMetric[];
}

export const RiskMetrics = ({ metrics }: RiskMetricsProps) => {
  return (
    <div className="space-y-6">
      {metrics.map((metric, index) => (
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
  );
};

