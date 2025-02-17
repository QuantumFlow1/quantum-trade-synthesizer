
const metrics = [
  { label: "Total Profit", value: "$12,345.67", change: "+15.4%" },
  { label: "Win Rate", value: "68%", change: "+2.3%" },
  { label: "Avg Trade", value: "$234.12", change: "+5.7%" },
];

const PerformanceMetrics = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
          >
            <span className="text-sm text-muted-foreground">{metric.label}</span>
            <div className="text-right">
              <div className="font-medium">{metric.value}</div>
              <div className="text-xs text-green-400">{metric.change}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrics;
