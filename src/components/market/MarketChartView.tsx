
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend, ReferenceLine } from 'recharts';
import { ChartData } from './types';

interface MarketChartViewProps {
  data: ChartData[];
  type: 'overview' | 'volume' | 'price';
}

const tooltipStyle = {
  backgroundColor: "rgba(0,0,0,0.8)",
  border: "none",
  borderRadius: "8px",
  color: "white",
  padding: "8px",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const isProjected = dataPoint.projected;
    
    return (
      <div className="bg-black/80 backdrop-blur-xl text-white p-2 rounded-lg border border-white/10 shadow-xl">
        <p className="text-sm font-medium">{label}</p>
        
        {isProjected ? (
          <>
            <p className="text-xs text-white/80 flex items-center justify-between">
              <span>Projected Price:</span>
              <span className="font-bold text-amber-400">${dataPoint.projectedPrice?.toFixed(2) || 'N/A'}</span>
            </p>
            <p className="text-xs text-white/80 flex items-center justify-between">
              <span>Confidence:</span>
              <span>{dataPoint.confidence ? (dataPoint.confidence * 100).toFixed(0) : 'N/A'}%</span>
            </p>
            <p className="text-xs text-white/80 flex items-center justify-between">
              <span>Range:</span>
              <span>${dataPoint.lowerBand?.toFixed(2) || 'N/A'} - ${dataPoint.upperBand?.toFixed(2) || 'N/A'}</span>
            </p>
            <div className="mt-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded text-center">
              AI Projection
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-white/80 flex items-center justify-between">
              <span>Price:</span>
              <span className="font-bold">${payload[0].value?.toFixed(2) || 'N/A'}</span>
            </p>
            {payload[1] && (
              <p className="text-xs text-white/80 flex items-center justify-between">
                <span>High:</span>
                <span>${payload[1].value?.toFixed(2) || 'N/A'}</span>
              </p>
            )}
            {payload[2] && (
              <p className="text-xs text-white/80 flex items-center justify-between">
                <span>Low:</span>
                <span>${payload[2].value?.toFixed(2) || 'N/A'}</span>
              </p>
            )}
          </>
        )}
      </div>
    );
  }
  return null;
};

// Custom legend renderer
const renderCustomLegend = (props: any) => {
  const { payload } = props;
  
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-2 text-xs">
      {payload.map((entry: any, index: number) => {
        const isProjection = entry.value.includes('Projection') || entry.value.includes('Bound') || entry.value.includes('Band');
        return (
          <div key={`item-${index}`} className="flex items-center gap-1.5">
            <div 
              className={`w-3 h-2 ${isProjection ? 'border-t-[2px] border-dashed' : ''}`} 
              style={{ 
                backgroundColor: isProjection ? 'transparent' : entry.color,
                borderColor: isProjection ? entry.color : 'transparent'
              }}
            />
            <span style={{ color: entry.color }}>{entry.value}</span>
          </div>
        );
      })}
    </div>
  );
};

export const MarketChartView = ({ data, type }: MarketChartViewProps) => {
  const commonProps = {
    data: data,
    margin: { top: 20, right: 30, left: 20, bottom: 20 }
  };

  // Find where projected data starts (if any)
  const projectionStartIndex = data.findIndex(item => item.projected);
  const hasProjections = projectionStartIndex !== -1;

  return (
    <div className="h-[350px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'overview' ? (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(value) => value} />
            <Bar dataKey="volume" fill="#4ade80" name="Volume" />
            <Bar dataKey="price" fill="#8b5cf6" name="Price" />
          </BarChart>
        ) : type === 'volume' ? (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(value) => value} />
            <defs>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="volume" fill="url(#volumeGradient)" stroke="#4ade80" name="Volume" fillOpacity={0.2} />
          </AreaChart>
        ) : (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip content={<CustomTooltip />} />
            <Legend payload={[
              { value: 'Price', color: '#8b5cf6', type: 'line' },
              { value: 'High', color: '#4ade80', type: 'line' },
              { value: 'Low', color: '#ef4444', type: 'line' },
              ...(hasProjections ? [
                { value: 'Projection', color: '#f59e0b', type: 'line' },
                { value: 'Confidence Band', color: '#f59e0b', type: 'area' }
              ] : [])
            ]} content={renderCustomLegend} />
            
            {/* Current price line */}
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#8b5cf6" 
              name="Price" 
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
            
            {/* High and low lines */}
            <Line type="monotone" dataKey="high" stroke="#4ade80" name="High" strokeWidth={1.5} />
            <Line type="monotone" dataKey="low" stroke="#ef4444" name="Low" strokeWidth={1.5} />
            
            {/* Projected price line (if available) */}
            {hasProjections && (
              <>
                {/* Main projected price line */}
                <Line
                  type="monotone"
                  dataKey="projectedPrice"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Projection"
                  connectNulls={true}
                  dot={{ r: 3, fill: "#f59e0b", strokeWidth: 1, stroke: "#fff" }}
                />
                
                {/* Confidence band - upper bound */}
                <Line
                  type="monotone"
                  dataKey="upperBand"
                  stroke="#f59e0b"
                  strokeWidth={1}
                  strokeOpacity={0.4}
                  strokeDasharray="3 3"
                  name="Upper Bound"
                  connectNulls={true}
                  dot={false}
                />
                
                {/* Confidence band - lower bound */}
                <Line
                  type="monotone"
                  dataKey="lowerBand"
                  stroke="#f59e0b"
                  strokeWidth={1}
                  strokeOpacity={0.4}
                  strokeDasharray="3 3"
                  name="Lower Bound"
                  connectNulls={true}
                  dot={false}
                />
                
                {/* Confidence band area */}
                <defs>
                  <linearGradient id="confidenceBandGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="upperBand"
                  stroke="none"
                  fillOpacity={1}
                  fill="url(#confidenceBandGradient)"
                  name="Confidence Band"
                  connectNulls={true}
                />
              </>
            )}
            
            {/* Divider line between actual and projected data */}
            {hasProjections && (
              <ReferenceLine 
                x={data[projectionStartIndex].name} 
                stroke="#f59e0b" 
                strokeDasharray="3 3"
                strokeWidth={1.5}
                label={{ 
                  value: "AI Projections →", 
                  position: "insideTopRight", 
                  fill: "#f59e0b", 
                  fontSize: 10,
                  fontWeight: "bold",
                  offset: 5
                }}
              />
            )}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
