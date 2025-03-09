
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MarketData } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface AIMarketAnalysisProps {
  marketData?: MarketData;
  analysisData?: any;
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export const AIMarketAnalysis: React.FC<AIMarketAnalysisProps> = ({
  marketData,
  analysisData,
  isLoading = false,
  onRefresh,
  className
}) => {
  // Helper to generate placeholder analysis data
  const generatePlaceholderAnalysis = () => {
    return {
      sentiment: "neutral",
      trend: "sideways",
      riskLevel: "moderate",
      recommendation: "hold",
      signals: ["Price near resistance level", "Volume trending down"],
      confidence: 68
    };
  };

  const analysis = analysisData || generatePlaceholderAnalysis();

  // Render loading state
  if (isLoading) {
    return (
      <Card className={`bg-secondary/20 backdrop-blur-md ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center mb-4">
            <Brain className="w-5 h-5 mr-2 text-primary" />
            <h3 className="text-lg font-medium">AI Market Analysis</h3>
            <div className="ml-auto flex items-center text-primary">
              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              <span className="text-sm">Loading analysis...</span>
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // When no market data is provided
  if (!marketData) {
    return (
      <Card className={`bg-secondary/20 backdrop-blur-md ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-muted-foreground" />
              <h3 className="text-lg font-medium">AI Market Analysis</h3>
            </div>
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            )}
          </div>
          <div className="flex items-center justify-center p-6 text-center">
            <div>
              <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No market data available for analysis</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine colors based on sentiment
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'bullish':
      case 'positive':
        return 'text-green-500';
      case 'bearish':
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  const sentimentColor = getSentimentColor(analysis.sentiment);

  return (
    <Card className={`bg-secondary/20 backdrop-blur-md border-secondary/50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-primary" />
            <h3 className="text-lg font-medium">AI Market Analysis</h3>
          </div>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Market: {marketData.market}</span>
            <span className="font-semibold">{marketData.name}</span>
            <span className={`${marketData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {marketData.change >= 0 ? '+' : ''}{(marketData.change * 100).toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">${Number(marketData.price).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</span>
            <div className="bg-secondary/40 rounded px-2 py-1 text-sm">
              <span className={sentimentColor}>
                {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)} ({analysis.confidence}% confidence)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-secondary/30 rounded p-3">
            <h4 className="font-medium mb-2">Analysis</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trend:</span>
                <span>{analysis.trend}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk Level:</span>
                <span>{analysis.riskLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recommendation:</span>
                <span className="font-medium">{analysis.recommendation}</span>
              </div>
            </div>
          </div>

          <div className="bg-secondary/30 rounded p-3">
            <h4 className="font-medium mb-2">Signals</h4>
            <ul className="space-y-1 text-sm">
              {analysis.signals.map((signal: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};
