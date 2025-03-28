
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FileDown, FileText, AlertTriangle } from 'lucide-react';
import { RiskSettings, RiskMetric, RiskHistoryEntry } from '@/types/risk';

interface RiskReportGeneratorProps {
  settings: RiskSettings;
  currentMetrics: RiskMetric[];
  history: RiskHistoryEntry[];
}

export const RiskReportGenerator: React.FC<RiskReportGeneratorProps> = ({ 
  settings, 
  currentMetrics, 
  history 
}) => {
  const [includeSettings, setIncludeSettings] = useState(true);
  const [includeCurrentMetrics, setIncludeCurrentMetrics] = useState(true);
  const [includeHistory, setIncludeHistory] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  
  // Calculate overall risk score
  const calculateOverallRisk = () => {
    const highRiskCount = currentMetrics.filter(m => m.status === 'high').length;
    const mediumRiskCount = currentMetrics.filter(m => m.status === 'medium').length;
    
    if (highRiskCount > 1) return 'HIGH';
    if (highRiskCount === 1 || mediumRiskCount > 2) return 'MEDIUM';
    return 'LOW';
  };
  
  const generateReport = () => {
    setGeneratingReport(true);
    
    // Simulate report generation
    setTimeout(() => {
      // Create report content
      let reportContent = "# RISK MANAGEMENT REPORT\n";
      reportContent += `Generated on: ${new Date().toLocaleString()}\n\n`;
      reportContent += `## OVERALL RISK ASSESSMENT: ${calculateOverallRisk()}\n\n`;
      
      if (includeSettings) {
        reportContent += "## RISK SETTINGS\n";
        for (const [key, value] of Object.entries(settings)) {
          reportContent += `${key.replace(/_/g, ' ')}: ${value}\n`;
        }
        reportContent += "\n";
      }
      
      if (includeCurrentMetrics) {
        reportContent += "## CURRENT RISK METRICS\n";
        currentMetrics.forEach(metric => {
          reportContent += `${metric.name}: ${metric.value}/${metric.maxValue} (${metric.status.toUpperCase()})\n`;
        });
        reportContent += "\n";
      }
      
      if (includeHistory && history.length > 0) {
        reportContent += "## RISK HISTORY (Last 5 entries)\n";
        history.slice(0, 5).forEach(entry => {
          reportContent += `Date: ${new Date(entry.date).toLocaleString()}\n`;
          entry.metrics.forEach(metric => {
            reportContent += `  ${metric.name}: ${metric.value}/${metric.maxValue} (${metric.status.toUpperCase()})\n`;
          });
          reportContent += "\n";
        });
      }
      
      // In a real application, we would create a PDF or CSV file
      // For this demo, we'll just show an alert
      console.log("Report generated:", reportContent);
      
      // Create a downloadable text file
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `risk_report_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setGeneratingReport(false);
    }, 1500);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Risk Report</CardTitle>
        <CardDescription>
          Create a detailed report of your current risk profile and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-settings" 
                checked={includeSettings} 
                onCheckedChange={(checked) => setIncludeSettings(!!checked)} 
              />
              <Label htmlFor="include-settings">Include Risk Settings</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-metrics" 
                checked={includeCurrentMetrics} 
                onCheckedChange={(checked) => setIncludeCurrentMetrics(!!checked)} 
              />
              <Label htmlFor="include-metrics">Include Current Metrics</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-history" 
                checked={includeHistory} 
                onCheckedChange={(checked) => setIncludeHistory(!!checked)} 
              />
              <Label htmlFor="include-history">Include Historical Data</Label>
            </div>
          </div>
          
          <Separator />
          
          <div className="bg-muted rounded-md p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Risk Assessment</p>
                <p className="text-muted-foreground">
                  Your current risk level is <span className={`font-medium ${
                    calculateOverallRisk() === 'HIGH' ? 'text-red-500' : 
                    calculateOverallRisk() === 'MEDIUM' ? 'text-amber-500' : 'text-green-500'
                  }`}>
                    {calculateOverallRisk()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={generateReport} 
          disabled={generatingReport || (!includeSettings && !includeCurrentMetrics && !includeHistory)}
          className="w-full"
        >
          {generatingReport ? (
            <>Generating Report...</>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Generate and Download Report
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
