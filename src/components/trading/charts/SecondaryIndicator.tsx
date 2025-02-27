
import { Line } from "recharts";

interface SecondaryIndicatorProps {
  indicator?: string;
}

export const SecondaryIndicator = ({ indicator }: SecondaryIndicatorProps) => {
  if (!indicator) return null;
  
  return (
    <Line
      type="monotone"
      dataKey={indicator}
      stroke="#f59e0b"
      strokeWidth={2}
      dot={false}
      name={indicator.toUpperCase()}
    />
  );
};
