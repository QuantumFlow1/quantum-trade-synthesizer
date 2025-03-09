
import React from 'react';
import { StockBot } from '@/components/bots/StockBot';
import { Shell } from '@/components/shell/Shell';

const StockBotPage = () => {
  return (
    <Shell>
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">StockBot Assistant</h1>
        <p className="text-muted-foreground max-w-3xl">
          Get AI-powered stock analysis, trading recommendations, and market insights. Ask about specific stocks or general market questions.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StockBot />
          </div>
          
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">How to use StockBot</h3>
              <ul className="space-y-2 text-sm">
                <li>Enter a stock symbol (e.g., AAPL, MSFT, GOOGL)</li>
                <li>Ask specific questions about a company</li>
                <li>Request technical analysis for a stock</li>
                <li>Inquire about market trends and sentiment</li>
              </ul>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Popular Queries</h3>
              <div className="space-y-2 text-sm">
                <p className="bg-secondary/20 p-2 rounded">Analysis for AAPL with price targets</p>
                <p className="bg-secondary/20 p-2 rounded">MSFT technical indicators</p>
                <p className="bg-secondary/20 p-2 rounded">Should I buy TSLA stock now?</p>
                <p className="bg-secondary/20 p-2 rounded">Compare AMZN and GOOGL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default StockBotPage;
