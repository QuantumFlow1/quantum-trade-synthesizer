
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "00:00", value: 45000 },
  { name: "04:00", value: 45200 },
  { name: "08:00", value: 45400 },
  { name: "12:00", value: 45100 },
  { name: "16:00", value: 45600 },
  { name: "20:00", value: 45800 },
  { name: "24:00", value: 45900 },
];

const TradingChart = () => {
  return (
    <div className="w-full h-[400px]">
      <h2 className="text-xl font-semibold mb-4">BTC/USD Price Chart</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#888888" />
          <YAxis stroke="#888888" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "none",
              borderRadius: "8px",
              color: "white",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4ade80"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TradingChart;
