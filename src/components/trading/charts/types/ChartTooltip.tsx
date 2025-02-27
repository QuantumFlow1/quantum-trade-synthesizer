
import { Tooltip } from "recharts";

export const ChartTooltip = () => {
  return (
    <Tooltip
      contentStyle={{
        backgroundColor: "rgba(0,0,0,0.8)",
        border: "none",
        borderRadius: "8px",
        color: "white",
        backdropFilter: "blur(16px)"
      }}
      labelFormatter={(label) => `Time: ${label}`}
      formatter={(value, name) => {
        // Convert value to string before returning
        return [value.toString(), name];
      }}
    />
  );
};
