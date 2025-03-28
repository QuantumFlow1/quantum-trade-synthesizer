
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RiskHistoryEntry } from '@/types/risk';
import { format, parseISO } from 'date-fns';

interface RiskHistoryProps {
  history: RiskHistoryEntry[];
  onClearHistory: () => void;
}

export const RiskHistory: React.FC<RiskHistoryProps> = ({ history, onClearHistory }) => {
  const [selectedMetric, setSelectedMetric] = React.useState<string>(history[0]?.metrics[0]?.name || '');
  
  // Process data for chart
  const chartData = React.useMemo(() => {
    return history.map(entry => {
      const metric = entry.metrics.find(m => m.name === selectedMetric);
      return {
        date: format(parseISO(entry.date), 'MMM dd, HH:mm'),
        value: metric?.value || 0,
        status: metric?.status || 'low'
      };
    }).reverse(); // Show oldest to newest
  }, [history, selectedMetric]);
  
  // Get unique metric names from history
  const metricNames = React.useMemo(() => {
    if (history.length === 0) return [];
    return history[0].metrics.map(m => m.name);
  }, [history]);
  
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4">No risk history available yet. Risk metrics will be recorded automatically as you use the platform.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-64">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger>
              <SelectValue placeholder="Select metric to display" />
            </SelectTrigger>
            <SelectContent>
              {metricNames.map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={onClearHistory}>
          Clear History
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">{selectedMetric} History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
