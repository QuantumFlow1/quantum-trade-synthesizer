
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/tests/utils/test-utils';
import { PortfolioDecision } from '@/components/trading/portfolio/PortfolioDecision';
import { PortfolioDecision as PortfolioDecisionType, TradeAction } from '@/types/agent';

describe('PortfolioDecision', () => {
  const mockDecision: PortfolioDecisionType = {
    id: crypto.randomUUID(),
    ticker: 'BTC',
    amount: 0.05,
    price: 45000,
    stopLoss: 42000,
    takeProfit: 50000,
    confidence: 80,
    riskScore: 35,
    contributors: ['value-investor-001', 'technical-analyst-001'],
    reasoning: 'Consensus among the specialized agents suggests a BUY action with strong confidence.',
    timestamp: new Date().toISOString(),
    recommendedActions: [],
    finalDecision: 'BUY',
    action: 'BUY' // For backward compatibility
  };

  it('renders the decision details correctly', () => {
    const mockExecute = vi.fn();
    render(
      <PortfolioDecision 
        decision={mockDecision} 
        isSimulationMode={false} 
        onExecuteDecision={mockExecute} 
      />
    );
    
    // Check if the action badge is displayed
    expect(screen.getByText('BUY BTC')).toBeInTheDocument();
    
    // Check if the price is displayed
    expect(screen.getByText('$45000')).toBeInTheDocument();
    
    // Check if the confidence is displayed
    expect(screen.getByText('80% confidence')).toBeInTheDocument();
    
    // Check if the amount is displayed
    expect(screen.getByText('0.05 BTC')).toBeInTheDocument();
    
    // Check if the risk score is displayed
    expect(screen.getByText('35/100')).toBeInTheDocument();
    
    // Check if the stop loss is displayed
    expect(screen.getByText('$42000')).toBeInTheDocument();
    
    // Check if the take profit is displayed
    expect(screen.getByText('$50000')).toBeInTheDocument();
    
    // Check if the reasoning is displayed
    expect(screen.getByText('Consensus among the specialized agents suggests a BUY action with strong confidence.')).toBeInTheDocument();
  });

  it('displays risk analysis visualizations', () => {
    const mockExecute = vi.fn();
    render(
      <PortfolioDecision 
        decision={mockDecision} 
        isSimulationMode={false} 
        onExecuteDecision={mockExecute} 
      />
    );
    
    // Check if risk analysis title is displayed
    expect(screen.getByText('Risk Analysis')).toBeInTheDocument();
    
    // Check if risk level badge is displayed
    expect(screen.getByText('Low Risk')).toBeInTheDocument();
    
    // Check if risk metrics are displayed
    expect(screen.getByText('Market Volatility')).toBeInTheDocument();
    expect(screen.getByText('Position Size')).toBeInTheDocument();
    expect(screen.getByText('Downside Risk')).toBeInTheDocument();
    
    // Check if risk/reward visualization is displayed
    expect(screen.getByText('Risk/Reward Ratio')).toBeInTheDocument();
    expect(screen.getByText(/Risk:/)).toBeInTheDocument();
    expect(screen.getByText(/Reward:/)).toBeInTheDocument();
  });

  it('calls execute function when button is clicked', () => {
    const mockExecute = vi.fn();
    render(
      <PortfolioDecision 
        decision={mockDecision} 
        isSimulationMode={false} 
        onExecuteDecision={mockExecute} 
      />
    );
    
    // Click the execute button
    const button = screen.getByRole('button', { name: /Execute BUY Order/i });
    fireEvent.click(button);
    
    // Check if the execute function was called
    expect(mockExecute).toHaveBeenCalledTimes(1);
  });

  it('shows correct button text in simulation mode', () => {
    const mockExecute = vi.fn();
    render(
      <PortfolioDecision 
        decision={mockDecision} 
        isSimulationMode={true} 
        onExecuteDecision={mockExecute} 
      />
    );
    
    // Check if the button shows "Simulate" in simulation mode
    const button = screen.getByRole('button', { name: /Simulate BUY Order/i });
    expect(button).toBeInTheDocument();
  });

  it('renders high risk indicators for high risk decisions', () => {
    const mockExecute = vi.fn();
    const highRiskDecision: PortfolioDecisionType = { 
      ...mockDecision, 
      riskScore: 75 
    };
    
    render(
      <PortfolioDecision 
        decision={highRiskDecision} 
        isSimulationMode={false} 
        onExecuteDecision={mockExecute} 
      />
    );
    
    // Check if the high risk badge is displayed
    expect(screen.getByText('High Risk')).toBeInTheDocument();
  });
});
