
import { useEffect } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine
} from 'recharts';

interface MarketChartViewProps {
  data: any[];
  type: 'overview' | 'volume' | 'price';
}

// Professional color palette for financial charts
const CHART_COLORS = [
  '#2563eb', // blue-600
  '#0d9488', // teal-600
  '#7c3aed', // violet-600
  '#0369a1', // sky-700
  '#16a34a', // green-600
  '#9333ea', // purple-600
  '#be123c', // rose-700
  '#0891b2', // cyan-600
  '#4f46e5', // indigo-600
  '#ca8a04'  // yellow-600
];

// Color gradient for area charts
const AREA_GRADIENT = {
  price: {
    id: 'colorPrice',
    color: '#3b82f6', // blue-500
    opacity: [0.8, 0]
  },
  volume: {
    id: 'colorVolume',
    color: '#10b981', // emerald-500
    opacity: [0.7, 0]
  }
};

const MarketChartView = ({ data, type }: MarketChartViewProps) => {
  // Debug logging for chart data
  useEffect(() => {
    console.log(`MarketChartView rendering with type: ${type}, data:`, {
      count: data.length,
      firstItem: data[0],
      hasValidFields: data.length > 0 ? checkDataFields(data[0]) : false
    });
  }, [data, type]);

  // Check if data has required fields
  const checkDataFields = (item: any) => {
    const requiredFields = ['name', 'price', 'volume'];
    return requiredFields.every(field => item[field] !== undefined);
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Make sure we have all required fields
  const validData = data.map(item => ({
    name: item.name || 'Unknown',
    price: item.price ?? 0,
    volume: item.volume ?? 0,
    change: item.change ?? 0,
    high: item.high ?? (item.price * 1.05),
    low: item.low ?? (item.price * 0.95)
  }));

  // For overview with 6 or fewer items, use pie chart
  if (type === 'overview' && validData.length <= 6) {
    return (
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={validData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={100}
              innerRadius={60} // Donut chart
              fill="#8884d8"
              paddingAngle={2}
              dataKey="price"
            >
              {validData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CHART_COLORS[index % CHART_COLORS.length]} 
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Price']} 
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                border: 'none', 
                borderRadius: '5px',
                padding: '8px 12px',
                fontSize: '12px'
              }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              formatter={(value) => <span style={{ fontSize: '12px' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // For price data or larger overview datasets, use area charts
  if (type === 'price' || (type === 'overview' && validData.length > 6)) {
    return (
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={validData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={AREA_GRADIENT.price.id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={AREA_GRADIENT.price.color} stopOpacity={AREA_GRADIENT.price.opacity[0]} />
                <stop offset="95%" stopColor={AREA_GRADIENT.price.color} stopOpacity={AREA_GRADIENT.price.opacity[1]} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              tickFormatter={(value) => `$${Number(value).toLocaleString()}`} 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <Tooltip 
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Price']} 
              labelFormatter={(label) => `Symbol: ${label}`}
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                border: 'none', 
                borderRadius: '5px',
                padding: '8px 12px',
                fontSize: '12px'
              }}
            />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={AREA_GRADIENT.price.color}
              strokeWidth={2}
              fill={`url(#${AREA_GRADIENT.price.id})`} 
              activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff' }} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // For volume data, use bar chart
  if (type === 'volume') {
    return (
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={validData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={AREA_GRADIENT.volume.id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={AREA_GRADIENT.volume.color} stopOpacity={AREA_GRADIENT.volume.opacity[0]} />
                <stop offset="95%" stopColor={AREA_GRADIENT.volume.color} stopOpacity={AREA_GRADIENT.volume.opacity[1]} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              tickFormatter={(value) => `${Number(value).toLocaleString()}`} 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <Tooltip 
              formatter={(value: any) => [`${Number(value).toLocaleString()}`, 'Volume']} 
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                border: 'none', 
                borderRadius: '5px',
                padding: '8px 12px',
                fontSize: '12px'
              }}
            />
            <Bar 
              dataKey="volume" 
              fill={`url(#${AREA_GRADIENT.volume.id})`} 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Fallback to line chart with multiple data points
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={validData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <YAxis 
            yAxisId="left"
            orientation="left"
            tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(value) => `${Number(value).toLocaleString()}`}
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: 'none', 
              borderRadius: '5px',
              padding: '8px 12px',
              fontSize: '12px'
            }}
          />
          <Legend 
            formatter={(value) => <span style={{ fontSize: '12px' }}>{value}</span>}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={CHART_COLORS[0]} 
            strokeWidth={2}
            dot={{ strokeWidth: 1, r: 4, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff' }}
            yAxisId="left"
          />
          <Line 
            type="monotone" 
            dataKey="volume" 
            stroke={CHART_COLORS[1]} 
            strokeWidth={2}
            dot={{ strokeWidth: 1, r: 4, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff' }}
            yAxisId="right"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChartView;
