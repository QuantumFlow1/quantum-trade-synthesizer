
import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SentimentAnalysisProps {
  symbol: string;
  timeframe?: string;
}

interface SentimentData {
  score: number;
  sentiment: "positive" | "negative" | "neutral";
  sources: number;
  trend: "increasing" | "decreasing" | "stable";
}

export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ symbol, timeframe = "1D" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      try {
        // Generate simulated sentiment data based on symbol
        const simulatedData = generateSimulatedSentimentData(symbol);
        setSentimentData(simulatedData);
        setIsLoading(false);
      } catch (e) {
        console.error("Error generating sentiment data:", e);
        setError("Failed to analyze sentiment");
        setIsLoading(false);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [symbol, timeframe]);

  // Helper function to generate sentiment data for demo purposes
  const generateSimulatedSentimentData = (symbol: string): SentimentData => {
    // Use the symbol string to generate a consistent but pseudo-random sentiment
    const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Generate sentiment score between -1 and 1
    const baseScore = ((hash % 200) - 100) / 100;
    
    // Determine sentiment category
    let sentiment: "positive" | "negative" | "neutral";
    if (baseScore > 0.2) sentiment = "positive";
    else if (baseScore < -0.2) sentiment = "negative";
    else sentiment = "neutral";
    
    // Generate source count between 50 and 500
    const sources = 50 + (hash % 450);
    
    // Determine trend
    const trendValue = hash % 3;
    let trend: "increasing" | "decreasing" | "stable";
    if (trendValue === 0) trend = "increasing";
    else if (trendValue === 1) trend = "decreasing";
    else trend = "stable";
    
    return {
      score: parseFloat(baseScore.toFixed(2)),
      sentiment,
      sources,
      trend
    };
  };

  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
      case "positive": return "text-green-600";
      case "negative": return "text-red-600";
      case "neutral": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing": return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "decreasing": return <TrendingDown className="h-5 w-5 text-red-500" />;
      case "stable": return <Minus className="h-5 w-5 text-gray-500" />;
      default: return null;
    }
  };

  return (
    <div className="mt-2 mb-4 border rounded-md overflow-hidden shadow-sm">
      <div className="bg-gray-100 p-2 border-b text-sm font-medium">
        Sentiment Analysis for {symbol} - {timeframe} Timeframe
      </div>
      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      ) : error ? (
        <div className="h-48 flex items-center justify-center bg-gray-50 flex-col p-4">
          <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
          <p className="text-gray-600 text-center">{error}</p>
          <p className="text-gray-400 text-sm text-center mt-1">
            Please try refreshing or check your connection
          </p>
        </div>
      ) : sentimentData ? (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-md p-3 bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">Sentiment Score</div>
              <div className={`text-xl font-bold ${getSentimentColor(sentimentData.sentiment)}`}>
                {sentimentData.score}
              </div>
            </div>
            
            <div className="border rounded-md p-3 bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">Overall Sentiment</div>
              <div className={`text-xl font-bold capitalize ${getSentimentColor(sentimentData.sentiment)}`}>
                {sentimentData.sentiment}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-md p-3 bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">Sources Analyzed</div>
              <div className="text-xl font-bold text-gray-800">
                {sentimentData.sources.toLocaleString()}
              </div>
            </div>
            
            <div className="border rounded-md p-3 bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">Sentiment Trend</div>
              <div className="text-xl font-bold capitalize flex items-center">
                {getTrendIcon(sentimentData.trend)}
                <span className="ml-1">{sentimentData.trend}</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            Based on social media, news articles, and market data analysis
          </div>
        </div>
      ) : null}
    </div>
  );
};
