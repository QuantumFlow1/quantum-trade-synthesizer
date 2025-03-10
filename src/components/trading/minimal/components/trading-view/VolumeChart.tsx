
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface VolumeChartProps {
  data: any[];
}

export const VolumeChart = ({ data }: VolumeChartProps) => {
  // Controleer of er geldige data is om te renderen
  if (!data || data.length === 0) {
    return (
      <div className="h-[100px] w-full flex items-center justify-center bg-gray-50 rounded-lg border">
        <p className="text-gray-500 text-sm">Geen volumedata beschikbaar</p>
      </div>
    );
  }

  // Zorg ervoor dat alle datapunten de benodigde velden hebben
  const validData = data.map(item => ({
    ...item,
    formattedDate: item.formattedDate || 'N/A',
    volume: typeof item.volume === 'number' ? item.volume : 0
  }));

  return (
    <div className="h-[100px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={validData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="formattedDate" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="volume" stroke="#82ca9d" fillOpacity={1} fill="url(#colorVolume)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
