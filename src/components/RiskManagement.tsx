
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskMetrics } from '@/components/risk/RiskMetrics';
import { RiskSettings } from '@/components/risk/RiskSettings';
import { RiskWarnings } from '@/components/risk/RiskWarnings';
import { RiskHistory } from '@/components/risk/RiskHistory';
import { RiskReportGenerator } from '@/components/risk/RiskReportGenerator';
import { RiskMetric } from '@/types/risk';
import { useRiskSettings } from '@/hooks/use-risk-settings';
import { useRiskHistory } from '@/hooks/use-risk-history';
import { Switch } from '@/components/ui/switch';
import { Settings, BarChart3, AlertTriangle, History, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';

type RiskWidgetVisibility = {
  metrics: boolean;
  history: boolean;
  settings: boolean;
  warnings: boolean;
  reports: boolean;
};

const defaultWidgetVisibility: RiskWidgetVisibility = {
  metrics: true,
  history: true,
  settings: true,
  warnings: true,
  reports: true,
};

const RiskManagement = () => {
  // Example risk metrics
  const riskMetrics: RiskMetric[] = [
    { name: 'Portfolio Volatility', value: 15, maxValue: 40, status: 'low' },
    { name: 'Leverage Ratio', value: 2.5, maxValue: 5, status: 'medium' },
    { name: 'Concentration Risk', value: 30, maxValue: 50, status: 'medium' },
    { name: 'Drawdown', value: 8, maxValue: 25, status: 'low' },
  ];
  
  const { riskSettings } = useRiskSettings();
  const { riskHistory, addHistoryEntry, clearHistory } = useRiskHistory();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('metrics');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [widgetVisibility, setWidgetVisibility] = useLocalStorage<RiskWidgetVisibility>(
    'risk-widget-visibility', 
    defaultWidgetVisibility
  );
  
  // Record risk metrics in history periodically
  useEffect(() => {
    // Add the current metrics to history when component mounts
    addHistoryEntry(riskMetrics);
    
    // Set up a periodic update (e.g., every hour in a real application)
    // For demo purposes, we'll use a shorter interval
    const interval = setInterval(() => {
      // In a real app, you would fetch the latest metrics here
      // For demo, we'll generate slightly different metrics
      const updatedMetrics: RiskMetric[] = riskMetrics.map(metric => {
        // Generate a random status based on the value
        let newStatus: 'low' | 'medium' | 'high';
        if (Math.random() > 0.8) {
          newStatus = Math.random() > 0.5 ? 'high' : 'medium';
        } else {
          newStatus = Math.random() > 0.5 ? 'medium' : 'low';
        }
        
        // Return the updated metric
        return {
          ...metric,
          value: Math.min(
            metric.maxValue, 
            Math.max(1, metric.value + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 5)
          ),
          status: newStatus
        };
      });
      
      addHistoryEntry(updatedMetrics);
    }, 30000); // Every 30 seconds for demo
    
    return () => clearInterval(interval);
  }, []);

  const handleWidgetToggle = (widgetKey: keyof RiskWidgetVisibility) => {
    setWidgetVisibility(prev => ({
      ...prev,
      [widgetKey]: !prev[widgetKey]
    }));

    toast({
      title: "Widget visibility updated",
      description: `${widgetKey.charAt(0).toUpperCase() + widgetKey.slice(1)} widget is now ${!widgetVisibility[widgetKey] ? 'visible' : 'hidden'}`,
    });
  };

  const resetWidgetVisibility = () => {
    setWidgetVisibility(defaultWidgetVisibility);
    toast({
      title: "Widget visibility reset",
      description: "All widgets are now visible",
    });
  };

  const visibleTabTriggers = [
    { key: 'metrics', label: 'Metrics', visible: widgetVisibility.metrics, icon: <BarChart3 className="h-4 w-4 mr-2" /> },
    { key: 'history', label: 'History', visible: widgetVisibility.history, icon: <History className="h-4 w-4 mr-2" /> },
    { key: 'settings', label: 'Settings', visible: widgetVisibility.settings, icon: <Settings className="h-4 w-4 mr-2" /> },
    { key: 'warnings', label: 'Warnings', visible: widgetVisibility.warnings, icon: <AlertTriangle className="h-4 w-4 mr-2" /> },
    { key: 'reports', label: 'Reports', visible: widgetVisibility.reports, icon: <FileText className="h-4 w-4 mr-2" /> },
  ];

  // Ensure the active tab is visible; if not, switch to the first visible tab
  useEffect(() => {
    const currentTabVisible = visibleTabTriggers.find(tab => tab.key === activeTab)?.visible;
    if (!currentTabVisible) {
      const firstVisibleTab = visibleTabTriggers.find(tab => tab.visible)?.key;
      if (firstVisibleTab) {
        setActiveTab(firstVisibleTab);
      }
    }
  }, [widgetVisibility, activeTab]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Risk Management</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsCustomizing(!isCustomizing)}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          {isCustomizing ? 'Done' : 'Customize'}
        </Button>
      </CardHeader>
      <CardContent>
        {isCustomizing ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Customize Visible Widgets</h3>
              <div className="grid gap-4">
                {visibleTabTriggers.map(tab => (
                  <div key={tab.key} className="flex items-center justify-between border p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      {tab.icon}
                      <span>{tab.label}</span>
                    </div>
                    <Switch 
                      checked={widgetVisibility[tab.key as keyof RiskWidgetVisibility]} 
                      onCheckedChange={() => handleWidgetToggle(tab.key as keyof RiskWidgetVisibility)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <Button variant="outline" onClick={resetWidgetVisibility}>Reset to Defaults</Button>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              {visibleTabTriggers
                .filter(tab => tab.visible)
                .map(tab => (
                  <TabsTrigger key={tab.key} value={tab.key} className="flex items-center gap-1">
                    {tab.icon}
                    {tab.label}
                  </TabsTrigger>
                ))
              }
            </TabsList>
            
            {widgetVisibility.metrics && (
              <TabsContent value="metrics">
                <RiskMetrics metrics={riskMetrics} />
              </TabsContent>
            )}
            
            {widgetVisibility.history && (
              <TabsContent value="history">
                <RiskHistory 
                  history={riskHistory} 
                  onClearHistory={clearHistory} 
                />
              </TabsContent>
            )}
            
            {widgetVisibility.settings && (
              <TabsContent value="settings">
                <RiskSettings />
              </TabsContent>
            )}
            
            {widgetVisibility.warnings && (
              <TabsContent value="warnings">
                <RiskWarnings />
              </TabsContent>
            )}
            
            {widgetVisibility.reports && (
              <TabsContent value="reports">
                <RiskReportGenerator 
                  settings={riskSettings}
                  currentMetrics={riskMetrics}
                  history={riskHistory}
                />
              </TabsContent>
            )}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskManagement;
