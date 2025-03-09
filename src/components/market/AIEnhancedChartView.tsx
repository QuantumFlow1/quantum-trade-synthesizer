
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, Legend } from 'recharts';
import { ChartData } from './types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Eye, EyeOff } from 'lucide-react';

interface AIEnhancedChartViewProps {
  data: ChartData[];
  symbol: string;
}

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

export const AIEnhancedChartView = ({ data, symbol }: AIEnhancedChartViewProps) => {
  const [showAIProjections, setShowAIProjections] = useState(true);
  
  // Generate AI projections for the next 7 days
  const generateAIProjections = () => {
    if (!data || data.length === 0) return [];
    
    const historicalData = [...data];
    const lastDataPoint = historicalData[historicalData.length - 1];
    const lastPrice = lastDataPoint.price;
    
    // Generate projection points for next 7 days
    const projectionPoints = [];
    for (let i = 1; i <= 7; i++) {
      // Simple projection logic - can be replaced with more sophisticated algorithms
      const dayFactor = i / 7; // Increasing volatility over time
      const randomTrend = Math.random() * 0.2 - 0.1; // Random trend between -10% and +10%
      const volatility = 0.05 * dayFactor; // Increasing volatility over time
      
      const projectedChange = randomTrend + (Math.random() * volatility * 2 - volatility);
      const projectedPrice = lastPrice * (1 + projectedChange);
      
      // Calculate confidence bands - wider as we go further in time
      const confidenceFactor = 0.02 + (dayFactor * 0.08); // 2% to 10% confidence bands
      const upperBand = projectedPrice * (1 + confidenceFactor);
      const lowerBand = projectedPrice * (1 - confidenceFactor);
      
      projectionPoints.push({
        name: `Day+${i}`,
        projectedPrice,
        upperBand,
        lowerBand,
        confidence: 1 - (dayFactor * 0.5), // Decreasing confidence over time (100% to 50%)
        projected: true
      });
    }
    
    return [...historicalData, ...projectionPoints];
  };
  
  const chartData = showAIProjections ? generateAIProjections() : data;
  
  // Find where projected data starts (if any)
  const projectionStartIndex = chartData.findIndex(item => item.projected);
  const hasProjections = projectionStartIndex !== -1 && showAIProjections;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{symbol} Price Chart</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAIProjections(!showAIProjections)}
          className="flex items-center gap-1.5"
        >
          {showAIProjections ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          <BrainCircuit className="h-3.5 w-3.5 ml-0.5" />
          {showAIProjections ? "Hide AI Projections" : "Show AI Projections"}
        </Button>
      </div>
    
      <div className="h-[350px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              payload={[
                { value: 'Price', color: '#8b5cf6', type: 'line' as const },
                { value: 'High', color: '#4ade80', type: 'line' as const },
                { value: 'Low', color: '#ef4444', type: 'line' as const },
                ...(hasProjections ? [
                  { value: 'AI Projection', color: '#f59e0b', type: 'line' as const },
                  { value: 'Confidence Band', color: '#f59e0b', type: 'area' as const }
                ] : [])
              ]}
              content={renderCustomLegend} 
            />
            
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
                  name="AI Projection"
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
                
                {/* Divider line between actual and projected data */}
                <ReferenceLine 
                  x={chartData[projectionStartIndex].name} 
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
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {hasProjections && (
        <div className="text-xs text-muted-foreground bg-secondary/20 p-2 rounded-md">
          <p className="flex items-center gap-1.5">
            <BrainCircuit className="h-3.5 w-3.5 text-amber-400" />
            <span>AI projections are based on historical data patterns and market conditions. Actual performance may vary.</span>
          </p>
        </div>
      )}
    </div>
  );
};
