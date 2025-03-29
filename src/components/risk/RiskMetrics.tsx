
import React, { useState, useEffect } from 'react';
import { RiskMetric } from '@/types/risk';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, AlertTriangle, CheckCircle, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RiskMetricsProps {
  metrics: RiskMetric[];
}

export const RiskMetrics: React.FC<RiskMetricsProps> = ({ metrics }) => {
  const [activeTab, setActiveTab] = useState('current');
  const [aiPredictions, setAiPredictions] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);

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

  // Generate mock historical risk data for demo purposes
  useEffect(() => {
    if (metrics.length === 0) return;
    
    const mockHistoricalData = [];
    const today = new Date();
    
    // Generate data for the last 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Convert current metrics to historical format with slight variations
      const dayData = {
        date: date.toISOString().split('T')[0],
        overallRisk: calculateOverallRisk().score + Math.floor(Math.random() * 15 - 7.5), // Add some randomness
      };
      
      // Add each metric as a data point
      metrics.forEach(metric => {
        const variation = Math.random() * 0.2 - 0.1; // -10% to +10% variation
        dayData[metric.name.replace(/\s+/g, '_')] = Math.max(0, Math.min(100, 
          (metric.value / metric.maxValue) * 100 * (1 + variation)
        ));
      });
      
      mockHistoricalData.push(dayData);
    }
    
    setHistoricalData(mockHistoricalData);
  }, [metrics]);

  // Simulate AI risk prediction generation
  const generateAIPrediction = () => {
    setIsLoadingPrediction(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const currentRisk = calculateOverallRisk();
      
      // Generate prediction based on historical trend and current risk
      const riskTrend = historicalData.length > 5 
        ? historicalData[historicalData.length - 1].overallRisk - historicalData[historicalData.length - 6].overallRisk 
        : 0;
      
      const predictionData = {
        predictedRiskLevel: riskTrend > 5 ? 'high' : riskTrend < -5 ? 'low' : currentRisk.status,
        confidence: 70 + Math.floor(Math.random() * 20),
        insights: [
          `Based on historical patterns, your ${
            riskTrend > 0 ? 'increasing' : riskTrend < 0 ? 'decreasing' : 'stable'
          } risk trend suggests ${
            riskTrend > 5 ? 'potential exposure issues' : 
            riskTrend < -5 ? 'improving risk management' : 
            'consistent risk levels'
          }.`,
          metrics.some(m => m.status === 'high') 
            ? `Pay attention to high-risk areas, particularly ${
                metrics.filter(m => m.status === 'high').map(m => m.name).join(' and ')
              }.`
            : 'No critical risk factors detected at this time.',
          `Consider ${
            currentRisk.status === 'high' ? 'reducing position sizes and reviewing stop-loss settings' : 
            currentRisk.status === 'medium' ? 'monitoring closely but maintaining current strategy' :
            'potentially increasing position sizes to optimize returns'
          }.`
        ],
        recommendedActions: [
          currentRisk.status === 'high' ? 'Reduce overall exposure by 15-20%' : 
          currentRisk.status === 'medium' ? 'Review high-risk positions' :
          'Consider optimizing position sizing for better returns',
          metrics.some(m => m.status === 'high') ? 'Adjust stop-loss levels on high-risk positions' : 'Maintain current stop-loss settings',
          'Review portfolio diversification'
        ]
      };
      
      setAiPredictions(predictionData);
      setIsLoadingPrediction(false);
    }, 1500);
  };

  // Generate AI prediction on initial load
  useEffect(() => {
    if (metrics.length > 0 && historicalData.length > 0 && !aiPredictions) {
      generateAIPrediction();
    }
  }, [metrics, historicalData, aiPredictions]);

  const overallRisk = calculateOverallRisk();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="current">Current Risk</TabsTrigger>
          <TabsTrigger value="history">Risk History</TabsTrigger>
          <TabsTrigger value="prediction">AI Prediction</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-6">
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
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risk History Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {historicalData.length > 0 ? (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historicalData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="overallRisk" name="Overall Risk" stroke="#8884d8" activeDot={{ r: 8 }} />
                      {metrics.map((metric, index) => (
                        <Line 
                          key={index}
                          type="monotone" 
                          dataKey={metric.name.replace(/\s+/g, '_')}
                          name={metric.name}
                          stroke={metric.status === 'low' ? '#10b981' : metric.status === 'medium' ? '#f59e0b' : '#ef4444'}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex justify-center items-center h-60">
                  <p className="text-muted-foreground">Loading historical data...</p>
                </div>
              )}
              <div className="mt-4 p-3 bg-secondary/20 rounded-md">
                <h4 className="text-sm font-medium mb-1">Risk Trend Analysis</h4>
                <p className="text-xs text-muted-foreground">
                  This chart shows your risk metrics over time. Look for patterns to identify which factors contribute 
                  most to your overall risk profile and when risk levels tend to increase.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="prediction">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-primary mr-2" />
                <CardTitle className="text-lg">AI Risk Analysis & Prediction</CardTitle>
              </div>
              <Badge variant="outline" className="flex items-center gap-1 border-primary/20 bg-primary/10">
                <TrendingUp className="h-3 w-3" /> Powered by ML
              </Badge>
            </CardHeader>
            <CardContent>
              {isLoadingPrediction ? (
                <div className="flex flex-col items-center justify-center h-60 space-y-4">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  <p className="text-sm text-muted-foreground">Analyzing risk patterns...</p>
                </div>
              ) : aiPredictions ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-md bg-secondary/30">
                    <div className="flex items-center">
                      <span className="font-medium">Predicted Risk Level:</span>
                    </div>
                    <Badge className={getRiskColor(aiPredictions.predictedRiskLevel as any)}>
                      {aiPredictions.predictedRiskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium mr-2">AI Confidence:</span>
                    <Progress value={aiPredictions.confidence} className="h-2 flex-1" />
                    <span className="ml-2 text-sm">{aiPredictions.confidence}%</span>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Key Insights:</h4>
                    <ul className="space-y-2">
                      {aiPredictions.insights.map((insight: string, i: number) => (
                        <li key={i} className="text-sm bg-secondary/20 p-2 rounded-md flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    <h4 className="text-sm font-medium">Recommended Actions:</h4>
                    <ul className="space-y-2">
                      {aiPredictions.recommendedActions.map((action: string, i: number) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {i + 1}
                          </div>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <p className="text-xs text-muted-foreground">
                      This prediction uses historical data and current market conditions to forecast potential risk levels.
                      Review regularly as market conditions change.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-60">
                  <p className="text-muted-foreground">Unable to generate prediction. Please try again later.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
