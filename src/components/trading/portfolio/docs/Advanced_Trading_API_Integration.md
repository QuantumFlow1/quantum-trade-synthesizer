
# Advanced Trading API Integration Guide

This document provides detailed instructions for integrating real market data APIs and trading algorithms with the agent-based portfolio management system.

## Current Implementation Status

The portfolio management system currently operates in simulation mode, using randomized data and simplified decision-making algorithms that mimic real trading strategies. This allows for demonstrating the agent collaboration concept without requiring external API connections.

## Architecture for API Integration

### 1. Data Layer

The first step in integrating real trading capability is to update the data layer to fetch actual market information:

```typescript
// Example Market Data API Client
import axios from 'axios';

export class MarketDataClient {
  private apiKey: string;
  private baseUrl: string;
  
  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }
  
  async getPrice(ticker: string): Promise<number> {
    const response = await axios.get(`${this.baseUrl}/price/${ticker}`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    });
    return response.data.price;
  }
  
  async getHistoricalData(ticker: string, timeframe: string): Promise<any[]> {
    const response = await axios.get(`${this.baseUrl}/historical/${ticker}`, {
      params: { timeframe },
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    });
    return response.data;
  }
  
  async getMarketSentiment(ticker: string): Promise<any> {
    const response = await axios.get(`${this.baseUrl}/sentiment/${ticker}`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    });
    return response.data;
  }
}
```

### 2. Agent Algorithm Layer

Each agent type needs to be updated with real algorithms using the actual market data:

```typescript
// Example of a real technical analysis agent algorithm
export const technicalAnalysisAlgorithm = async (
  client: MarketDataClient,
  ticker: string, 
  currentPrice: number
): Promise<AgentRecommendation> => {
  // Fetch historical data for technical analysis
  const historicalData = await client.getHistoricalData(ticker, '1d');
  
  // Calculate real technical indicators
  const rsi = calculateRSI(historicalData);
  const macd = calculateMACD(historicalData);
  const movingAverages = {
    sma20: calculateSMA(historicalData, 20),
    sma50: calculateSMA(historicalData, 50),
    ema12: calculateEMA(historicalData, 12),
    ema26: calculateEMA(historicalData, 26)
  };
  
  // Apply real trading logic based on technical indicators
  let action: "BUY" | "SELL" | "HOLD" = "HOLD";
  let confidence = 50;
  let reasoning = "";
  
  // RSI Conditions
  if (rsi < 30) {
    action = "BUY";
    confidence += 15;
    reasoning += `RSI indicates oversold conditions (${rsi.toFixed(2)}). `;
  } else if (rsi > 70) {
    action = "SELL";
    confidence += 15;
    reasoning += `RSI indicates overbought conditions (${rsi.toFixed(2)}). `;
  }
  
  // MACD Conditions
  if (macd.histogram > 0 && macd.histogram > macd.previousHistogram) {
    // Increasing positive histogram suggests strengthening bullish momentum
    if (action !== "SELL") {
      action = "BUY";
      confidence += 10;
      reasoning += `MACD shows strengthening bullish momentum. `;
    }
  } else if (macd.histogram < 0 && macd.histogram < macd.previousHistogram) {
    // Decreasing negative histogram suggests strengthening bearish momentum
    if (action !== "BUY") {
      action = "SELL";
      confidence += 10;
      reasoning += `MACD shows strengthening bearish momentum. `;
    }
  }
  
  // Moving Average Conditions
  if (currentPrice > movingAverages.sma50 && movingAverages.sma20 > movingAverages.sma50) {
    // Price above SMA50 and SMA20 above SMA50 suggests bullish trend
    if (action !== "SELL") {
      action = "BUY";
      confidence += 10;
      reasoning += `Price is above SMA50 and SMA20 is above SMA50, indicating a bullish trend. `;
    }
  } else if (currentPrice < movingAverages.sma50 && movingAverages.sma20 < movingAverages.sma50) {
    // Price below SMA50 and SMA20 below SMA50 suggests bearish trend
    if (action !== "BUY") {
      action = "SELL";
      confidence += 10;
      reasoning += `Price is below SMA50 and SMA20 is below SMA50, indicating a bearish trend. `;
    }
  }
  
  // If no strong signals, default to HOLD
  if (action === "HOLD" || confidence < 60) {
    action = "HOLD";
    confidence = Math.max(50, confidence);
    reasoning = `Technical indicators show mixed signals for ${ticker}. ${reasoning}`;
  } else {
    reasoning = `Technical analysis suggests to ${action} ${ticker}. ${reasoning}`;
  }
  
  return {
    agentId: "technical-analyst",
    action,
    confidence: Math.min(95, confidence), // Cap at 95% confidence
    reasoning: reasoning.trim(),
    timestamp: new Date().toISOString()
  };
};
```

### 3. Portfolio Decision Integration

Update the portfolio decision mechanism to use the aggregated real agent recommendations:

```typescript
export const generateRealPortfolioDecision = (
  recommendations: AgentRecommendation[],
  agents: TradingAgent[],
  marketData: any,
  risk_preferences: { maxRisk: number, minConfidence: number }
): PortfolioDecision | null => {
  if (!recommendations.length) return null;
  
  // Weight recommendations by agent quality and recent performance
  const weightedRecommendations = recommendations.map(rec => {
    const agent = agents.find(a => a.id === rec.agentId);
    const weight = agent ? agent.weight : 0.5;
    return {
      ...rec,
      weight
    };
  });
  
  // Calculate the weighted majority action
  const actionScores = {
    "BUY": 0,
    "SELL": 0,
    "HOLD": 0
  };
  
  for (const rec of weightedRecommendations) {
    actionScores[rec.action] += rec.weight * (rec.confidence / 100);
  }
  
  let majorityAction: "BUY" | "SELL" | "HOLD" = "HOLD";
  let highestScore = actionScores["HOLD"];
  
  if (actionScores["BUY"] > highestScore) {
    majorityAction = "BUY";
    highestScore = actionScores["BUY"];
  }
  if (actionScores["SELL"] > highestScore) {
    majorityAction = "SELL";
    highestScore = actionScores["SELL"];
  }
  
  // Calculate confidence and risk scores
  const totalWeight = weightedRecommendations.reduce((sum, rec) => sum + rec.weight, 0);
  const confidenceScore = Math.round((highestScore / totalWeight) * 100);
  
  // Only proceed if confidence exceeds minimum threshold
  if (confidenceScore < risk_preferences.minConfidence) {
    majorityAction = "HOLD";
  }
  
  // Calculate risk score based on recommendation divergence and market volatility
  const divergence = 1 - (highestScore / totalWeight);
  const volatilityFactor = marketData.volatility || 0.5;
  const riskScore = Math.round((divergence * 50) + (volatilityFactor * 50));
  
  // If risk exceeds maximum preference, default to HOLD
  if (riskScore > risk_preferences.maxRisk && majorityAction !== "HOLD") {
    majorityAction = "HOLD";
  }
  
  // Determine position size based on confidence and risk
  const baseSize = 0.1; // Base position size (10% of available capital)
  const riskAdjustment = 1 - (riskScore / 100);
  const confidenceAdjustment = confidenceScore / 100;
  const positionSize = baseSize * confidenceAdjustment * riskAdjustment;
  
  return {
    action: majorityAction,
    ticker: marketData.symbol,
    amount: Math.round(positionSize * 100) / 100, // Round to 2 decimal places
    price: marketData.price,
    confidence: confidenceScore,
    riskScore,
    contributors: weightedRecommendations
      .filter(rec => rec.action === majorityAction)
      .map(rec => rec.agentId),
    reasoning: generateDecisionReasoning(majorityAction, confidenceScore, riskScore, marketData),
    timestamp: new Date().toISOString()
  };
};
```

### 4. Execution Layer

For real trading, implement an execution layer that connects to a broker API:

```typescript
export class TradingExecutionService {
  private brokerClient: BrokerAPIClient;
  private isSimulationMode: boolean;
  
  constructor(apiKey: string, baseUrl: string, isSimulation: boolean = true) {
    this.brokerClient = new BrokerAPIClient(apiKey, baseUrl);
    this.isSimulationMode = isSimulation;
  }
  
  async executeDecision(decision: PortfolioDecision): Promise<boolean> {
    if (this.isSimulationMode) {
      console.log(`SIMULATION: ${decision.action} ${decision.amount} ${decision.ticker} @ $${decision.price}`);
      return true;
    }
    
    try {
      // For real execution
      const orderType = decision.action === "BUY" ? "MARKET_BUY" : "MARKET_SELL";
      
      if (decision.action === "HOLD") {
        return true; // No action needed
      }
      
      const order = await this.brokerClient.placeOrder({
        symbol: decision.ticker,
        type: orderType,
        quantity: decision.amount,
        price: decision.price,
        timeInForce: "GTC" // Good Till Cancelled
      });
      
      console.log(`Order placed: ${order.id} - ${decision.action} ${decision.amount} ${decision.ticker}`);
      return true;
    } catch (error) {
      console.error("Error executing trade decision:", error);
      return false;
    }
  }
  
  // Additional methods for order management, position tracking, etc.
}
```

## Recommended APIs for Integration

### Market Data APIs

1. **AlphaVantage** - Comprehensive stock, forex, and cryptocurrency data
   - Endpoints for real-time prices, historical data, technical indicators
   - Documentation: https://www.alphavantage.co/documentation/

2. **Finnhub** - Real-time market data and financial APIs
   - Stock, forex, crypto data with sentiment analysis
   - Documentation: https://finnhub.io/docs/api

3. **CoinGecko** - Cryptocurrency market data
   - Comprehensive data for crypto assets
   - Documentation: https://www.coingecko.com/api/documentation

### Trading Execution APIs

1. **Alpaca** - Commission-free stock trading API
   - Paper trading support for testing
   - Documentation: https://alpaca.markets/docs/

2. **Interactive Brokers** - Professional trading API
   - Comprehensive order types and global market access
   - Documentation: https://www.interactivebrokers.com/en/index.php?f=5041

3. **Binance** - Cryptocurrency exchange API
   - High liquidity and comprehensive crypto trading
   - Documentation: https://binance-docs.github.io/apidocs/

## Integration Steps

1. Create an API connection manager that handles authentication and rate limiting
2. Replace the simulated data generation with real API calls
3. Implement real trading algorithms for each agent type
4. Add error handling and fallback mechanisms
5. Create a toggle to switch between simulation and real mode
6. Implement a trading execution service with appropriate risk checks
7. Add monitoring and logging for all API interactions

## Security Considerations

1. **API Key Management**
   - Store API keys securely, preferably in environment variables
   - Use different keys for development and production

2. **Request Validation**
   - Validate all input parameters before sending API requests
   - Implement request signing where required by the API

3. **Risk Limits**
   - Set maximum position sizes and risk exposure limits
   - Implement circuit breakers to stop trading during unusual market conditions

4. **Monitoring**
   - Set up alerts for API failures or unusual trading activity
   - Log all transactions for auditing purposes

## Implementation Plan

1. **Phase 1**: Integrate market data APIs (read-only)
   - Replace simulated price data with real market data
   - Update agent algorithms to use real technical indicators

2. **Phase 2**: Enhance agent intelligence
   - Implement more sophisticated trading algorithms
   - Add machine learning models for prediction improvement

3. **Phase 3**: Add paper trading capabilities
   - Connect to broker APIs in paper trading mode
   - Test complete trading lifecycle with simulated execution

4. **Phase 4**: Enable real trading (optional)
   - Implement robust risk management and position sizing
   - Add comprehensive monitoring and alerting
   - Deploy with additional security measures
