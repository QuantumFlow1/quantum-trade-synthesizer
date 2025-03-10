
import React from "react";
import { TradingViewChart, MarketHeatmap, StockNews } from "../widgets";

export const MessageRenderer: React.FC = () => {
  // Helper function to render the appropriate widget based on function name
  const renderFunctionWidget = (functionName: string, params: any) => {
    if (functionName === "getStockNews") {
      const symbol = params.symbol || "market";
      const count = params.count || 5;
      return (
        <>
          <div className="mb-2">Here's the latest news for {symbol}:</div>
          <StockNews symbol={symbol} count={count} />
        </>
      );
    } else if (functionName === "showStockChart") {
      const symbol = params.symbol || "SPY";
      const timeframe = params.timeframe || "1M";
      return (
        <>
          <div className="mb-2">Here's the chart for {symbol}:</div>
          <TradingViewChart symbol={symbol} timeframe={timeframe} />
        </>
      );
    } else if (functionName === "showMarketHeatmap") {
      const sector = params.sector || "all";
      return (
        <>
          <div className="mb-2">Here's the market heatmap{sector !== "all" ? ` for the ${sector} sector` : ""}:</div>
          <MarketHeatmap sector={sector} />
        </>
      );
    }
    
    // If no match, return the original content
    return <div className="whitespace-pre-wrap">Unsupported function: {functionName}</div>;
  };

  return { renderFunctionWidget };
};
