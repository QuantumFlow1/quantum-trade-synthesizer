
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const marketData = [
  { name: 'Crypto', volume: 4500, trades: 245 },
  { name: 'Stocks', volume: 3200, trades: 178 },
  { name: 'Forex', volume: 2800, trades: 156 },
  { name: 'Commodities', volume: 1900, trades: 89 },
];

const MarketOverview = () => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Markt Overzicht</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={marketData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
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
            <Bar dataKey="volume" fill="#4ade80" name="Handelsvolume" />
            <Bar dataKey="trades" fill="#8b5cf6" name="Aantal Trades" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketOverview;
