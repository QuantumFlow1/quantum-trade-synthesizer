
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/tests/utils/test-utils';
import { RecommendationList } from '@/components/trading/portfolio/RecommendationList';
import { AgentRecommendation } from '@/components/trading/portfolio/types/portfolioTypes';

describe('RecommendationList', () => {
  const mockRecommendations: AgentRecommendation[] = [
    {
      agentId: 'value-investor-001',
      action: 'BUY',
      confidence: 85,
      reasoning: 'Strong fundamentals',
      ticker: 'BTC',
      timestamp: new Date().toISOString()
    },
    {
      agentId: 'technical-analyst-001',
      action: 'SELL',
      confidence: 70,
      reasoning: 'Bearish pattern',
      ticker: 'BTC',
      timestamp: new Date().toISOString()
    }
  ];

  it('renders a list of recommendations', () => {
    render(<RecommendationList recommendations={mockRecommendations} />);
    
    // Check if both recommendations are rendered
    expect(screen.getByText('Value Investor')).toBeInTheDocument();
    expect(screen.getByText('Technical Analyst')).toBeInTheDocument();
    
    // Check if their reasonings are displayed
    expect(screen.getByText('Strong fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Bearish pattern')).toBeInTheDocument();
  });

  it('returns null when recommendations array is empty', () => {
    const { container } = render(<RecommendationList recommendations={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
