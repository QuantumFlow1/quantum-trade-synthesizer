
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/tests/utils/test-utils';
import { PortfolioDecision } from '@/components/trading/portfolio/PortfolioDecision';

describe('PortfolioDecision', () => {
  // Create a mock decision object that matches the component's expected props
  const mockDecision = {
    action: 'BUY',
    ticker: 'BTC',
    amount: 0.05,
    price: 45000,
    stopLoss: 42000,
    takeProfit: 50000,
    confidence: 80,
    riskScore: 35,
    contributors: ['value-investor-001', 'technical-analyst-001'],
    reasoning: 'Consensus among the specialized agents suggests a BUY action with strong confidence.',
    timestamp: new Date().toISOString()
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
    expect(screen.getByText('80%')).toBeInTheDocument();
    
    // Check if the amount is displayed
    expect(screen.getByText('0.05 BTC')).toBeInTheDocument();
    
    // Check if the risk score is displayed
    expect(screen.getByText('35')).toBeInTheDocument();
    
    // Check if the stop loss is displayed
    expect(screen.getByText('$42000')).toBeInTheDocument();
    
    // Check if the take profit is displayed
    expect(screen.getByText('$50000')).toBeInTheDocument();
    
    // Check if the reasoning is displayed
    expect(screen.getByText('Consensus among the specialized agents suggests a BUY action with strong confidence.')).toBeInTheDocument();
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
    const button = screen.getByRole('button');
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
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(/Simulate/i);
  });

  it('renders high risk indicators for high risk decisions', () => {
    const mockExecute = vi.fn();
    const highRiskDecision = { ...mockDecision, riskScore: 75 };
    
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
