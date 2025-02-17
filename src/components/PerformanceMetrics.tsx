
const metrics = [
  { label: "Totale Winst", value: "$12,345.67", change: "+15.4%" },
  { label: "Win Rate", value: "68%", change: "+2.3%" },
  { label: "Gem. Trade", value: "$234.12", change: "+5.7%" },
  { label: "Dagelijks Volume", value: "$1.2M", change: "+8.9%" },
  { label: "Open Posities", value: "12", change: "-2" },
  { label: "ROI", value: "24.5%", change: "+3.2%" }
];

const PerformanceMetrics = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
