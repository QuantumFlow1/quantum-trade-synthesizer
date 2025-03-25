
import { useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface MarketChartViewProps {
  data: any[];
  type: 'overview' | 'volume' | 'price';
}

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
        <p className="text-muted-foreground">Geen gegevens beschikbaar</p>
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

  // Colors for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  // Check data type - if only 1-5 items, use pie chart for overview
  if (type === 'overview' && validData.length <= 5) {
    return (
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={validData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="price"
            >
              {validData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // For price or larger overview datasets, use line chart
  if (type === 'price' || (type === 'overview' && validData.length > 5)) {
    return (
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={validData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis 
              domain={['auto', 'auto']} 
              tickFormatter={(value) => `$${value.toLocaleString()}`} 
            />
            <Tooltip 
              formatter={(value: any) => [`$${value.toLocaleString()}`, 'Price']} 
              contentStyle={{ background: 'rgba(0, 0, 0, 0.8)', border: 'none', borderRadius: '5px' }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#8884d8" 
              fill="url(#colorPrice)" 
              activeDot={{ r: 8 }} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // For volume data, use a simple bar or area chart
  if (type === 'volume') {
    return (
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={validData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis 
              domain={['auto', 'auto']} 
              tickFormatter={(value) => `${value.toLocaleString()}`} 
            />
            <Tooltip 
              formatter={(value: any) => [`${value.toLocaleString()}`, 'Volume']} 
              contentStyle={{ background: 'rgba(0, 0, 0, 0.8)', border: 'none', borderRadius: '5px' }}
            />
            <Area 
              type="monotone" 
              dataKey="volume" 
              stroke="#82ca9d" 
              fill="url(#colorVolume)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Fallback if no matching chart type
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={validData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip contentStyle={{ background: 'rgba(0, 0, 0, 0.8)', border: 'none', borderRadius: '5px' }} />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
          <Line type="monotone" dataKey="volume" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChartView;
