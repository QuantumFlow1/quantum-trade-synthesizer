
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import { AgentRecommendation } from '@/components/trading/portfolio/AgentRecommendation';
import { AgentRecommendation as AgentRecommendationType } from '@/types/agent';

describe('AgentRecommendation', () => {
  const mockRecommendation: AgentRecommendationType = {
    agentId: 'value-investor-001',
    action: 'BUY',
    confidence: 85,
    reasoning: 'Strong fundamentals and growth potential',
    ticker: 'BTC',
    price: 45000,
    timestamp: new Date().toISOString()
  };

  it('renders recommendation correctly', () => {
    render(<AgentRecommendation recommendation={mockRecommendation} />);
    
    // Check if the agent ID is displayed
    expect(screen.getByText('value-investor')).toBeInTheDocument();
    
    // Check if the action is displayed
    expect(screen.getByText('BUY')).toBeInTheDocument();
    
    // Check if the confidence is displayed
    expect(screen.getByText('85% confidence')).toBeInTheDocument();
    
    // Check if the reasoning is displayed
    expect(screen.getByText('Strong fundamentals and growth potential')).toBeInTheDocument();
  });

  it('renders different action colors correctly', () => {
    const sellRecommendation = { ...mockRecommendation, action: 'SELL' as const };
    const { rerender } = render(<AgentRecommendation recommendation={sellRecommendation} />);
    
    // Check if sell action has correct color class
    const sellBadge = screen.getByText('SELL');
    expect(sellBadge).toHaveClass('bg-red-500/80');
    
    // Rerender with HOLD action
    const holdRecommendation = { ...mockRecommendation, action: 'HOLD' as const };
    rerender(<AgentRecommendation recommendation={holdRecommendation} />);
    
    // Check if hold action has correct color class
    const holdBadge = screen.getByText('HOLD');
    expect(holdBadge).toHaveClass('bg-blue-500/80');
  });
});
