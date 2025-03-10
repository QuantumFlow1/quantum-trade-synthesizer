
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle } from "lucide-react";

interface VolumeChartProps {
  data: any[];
}

export const VolumeChart = ({ data }: VolumeChartProps) => {
  // Controleer of er geldige data is om te renderen
  if (!data || data.length === 0) {
    return (
      <div className="h-[100px] w-full flex items-center justify-center bg-gray-50 rounded-lg border">
        <p className="text-gray-500 text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
          Geen volumedata beschikbaar
        </p>
      </div>
    );
  }

  // Validatie functie voor data
  const validateVolumeData = (value: any): boolean => {
    return value !== undefined && value !== null && !isNaN(value) && value > 0;
  };

  // Controleer of we geldige volume data hebben
  const hasValidVolumeData = data.some(item => validateVolumeData(item.volume));
  
  if (!hasValidVolumeData) {
    return (
      <div className="h-[100px] w-full flex items-center justify-center bg-gray-50 rounded-lg border">
        <p className="text-gray-500 text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
          Volume data is ongeldig of niet beschikbaar
        </p>
      </div>
    );
  }

  // Zorg ervoor dat alle datapunten de benodigde velden hebben
  const validData = data.map(item => ({
    ...item,
    formattedDate: item.formattedDate || new Date(item.timestamp).toLocaleDateString('nl', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    volume: validateVolumeData(item.volume) ? item.volume : 0
  }));

  // Bereken automatisch max voor de Y-as
  const volumes = validData.map(d => d.volume).filter(validateVolumeData);
  const maxVolume = Math.max(...volumes) * 1.1; // 10% buffer boven

  return (
    <div className="h-[100px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={validData} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => typeof value === 'string' ? value.split(' ')[0] : value}
            height={15}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => value >= 1000000
              ? `${(value / 1000000).toFixed(1)}M`
              : value >= 1000
              ? `${(value / 1000).toFixed(1)}K`
              : value.toString()
            }
            width={40}
            domain={[0, maxVolume]}
          />
          <Tooltip 
            formatter={(value: any) => [
              value >= 1000000
                ? `${(value / 1000000).toFixed(2)}M`
                : value >= 1000
                ? `${(value / 1000).toFixed(2)}K`
                : value.toFixed(2),
              'Volume'
            ]}
            labelFormatter={(label) => `Datum: ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="volume" 
            name="Volume"
            stroke="#82ca9d" 
            fillOpacity={1} 
            fill="url(#colorVolume)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
