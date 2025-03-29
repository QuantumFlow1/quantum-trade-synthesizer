
import React from 'react';
import { RiskMetric } from '@/types/risk';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface RiskMetricsProps {
  metrics: RiskMetric[];
}

export const RiskMetrics: React.FC<RiskMetricsProps> = ({ metrics }) => {
  // Function to determine color based on risk level
  const getRiskColor = (status: 'low' | 'medium' | 'high') => {
    switch (status) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Function to get progress bar color
  const getProgressColor = (status: 'low' | 'medium' | 'high') => {
    switch (status) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Function to get risk icon
  const getRiskIcon = (status: 'low' | 'medium' | 'high') => {
    switch (status) {
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'medium':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Calculate overall risk score based on metrics (simple average)
  const calculateOverallRisk = () => {
    if (!metrics.length) return { score: 0, status: 'low' as const };
    
    const scoreMapping = { 'low': 1, 'medium': 2, 'high': 3 };
    const totalScore = metrics.reduce((sum, metric) => sum + scoreMapping[metric.status], 0);
    const averageScore = totalScore / metrics.length;
    
    let status: 'low' | 'medium' | 'high' = 'low';
    if (averageScore > 2.3) status = 'high';
    else if (averageScore > 1.5) status = 'medium';
    
    return { score: Math.round(averageScore * 33.33), status };
  };

  const overallRisk = calculateOverallRisk();

  return (
    <div className="space-y-6">
      <Card className={`border-2 ${
        overallRisk.status === 'low' 
          ? 'border-green-200' 
          : overallRisk.status === 'medium' 
            ? 'border-yellow-200' 
            : 'border-red-200'
      }`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Overall Risk Level</h3>
            <Badge className={getRiskColor(overallRisk.status)}>
              {overallRisk.status.toUpperCase()}
            </Badge>
          </div>
          <Progress 
            value={overallRisk.score} 
            className="h-3 mb-2" 
            indicatorClassName={getProgressColor(overallRisk.status)}
          />
          <p className="text-sm text-muted-foreground mt-1">
            {overallRisk.status === 'low' 
              ? 'Your risk level is under control. Keep up the good work!'
              : overallRisk.status === 'medium'
                ? 'Your risk level requires attention. Consider adjusting some parameters.'
                : 'Your risk level is high. Immediate action is recommended to reduce exposure.'
            }
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="overflow-hidden transition-all duration-200 hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {getRiskIcon(metric.status)}
                  <h3 className="font-medium">{metric.name}</h3>
                </div>
                <Badge className={getRiskColor(metric.status)}>
                  {metric.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold">{metric.value.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">/ {metric.maxValue}</span>
              </div>
              
              <Progress 
                value={(metric.value / metric.maxValue) * 100} 
                className="h-2" 
                indicatorClassName={getProgressColor(metric.status)}
              />
              
              <div className="mt-2 text-sm text-muted-foreground">
                {metric.status === 'low' && (
                  <span className="flex items-center text-green-600">
                    <ArrowDown className="h-4 w-4 mr-1" /> Below risk threshold
                  </span>
                )}
                {metric.status === 'medium' && (
                  <span className="flex items-center text-yellow-600">
                    <AlertCircle className="h-4 w-4 mr-1" /> Approaching risk threshold
                  </span>
                )}
                {metric.status === 'high' && (
                  <span className="flex items-center text-red-600">
                    <ArrowUp className="h-4 w-4 mr-1" /> Exceeds recommended threshold
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
