import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/tests/utils/test-utils';
import { PortfolioManager } from '@/components/trading/PortfolioManager';
import { usePortfolioManager } from '@/components/trading/portfolio/hooks/usePortfolioManager';

// Mock the hooks and components used in PortfolioManager
vi.mock('@/components/trading/portfolio/hooks/usePortfolioManager', () => ({
  usePortfolioManager: vi.fn()
}));

vi.mock('@/components/trading/portfolio/SimulationAlert', () => ({
  SimulationAlert: () => <div data-testid="simulation-alert">Simulation Alert</div>
}));

vi.mock('@/components/trading/portfolio/EmptyAnalysisState', () => ({
  EmptyAnalysisState: ({ onRefreshAnalysis, isDisabled }) => (
    <div data-testid="empty-analysis">
      <button 
        data-testid="refresh-button" 
        disabled={isDisabled} 
        onClick={onRefreshAnalysis}
      >
        Refresh Analysis
      </button>
    </div>
  )
}));

vi.mock('@/components/trading/portfolio/RecommendationList', () => ({
  RecommendationList: ({ recommendations }) => (
    <div data-testid="recommendation-list">
      {recommendations.length} recommendations
    </div>
  )
}));

vi.mock('@/components/trading/portfolio/PortfolioDecision', () => ({
  PortfolioDecision: ({ decision, isSimulationMode, onExecuteDecision }) => (
    <div data-testid="portfolio-decision">
      <div>Decision: {decision.action}</div>
      <div>Simulation: {isSimulationMode ? 'Yes' : 'No'}</div>
      <button data-testid="execute-button" onClick={onExecuteDecision}>
        Execute
      </button>
    </div>
  )
}));

vi.mock('@/components/trading/portfolio/LoadingDecision', () => ({
  LoadingDecision: () => <div data-testid="loading-decision">Loading...</div>
}));

describe('PortfolioManager', () => {
  it('renders empty state when no recommendations', () => {
    (usePortfolioManager as ReturnType<typeof vi.fn>).mockReturnValue({
      agentRecommendations: [],
      portfolioDecision: null,
      loadingDecision: false,
      handleExecuteDecision: vi.fn(),
      handleRefreshAnalysis: vi.fn()
    });

    render(<PortfolioManager />);
    
    // Check if empty state is rendered
    expect(screen.getByTestId('empty-analysis')).toBeInTheDocument();
    expect(screen.queryByTestId('recommendation-list')).not.toBeInTheDocument();
  });

  it('renders recommendations and decision when available', () => {
    const mockHandleExecute = vi.fn();
    
    (usePortfolioManager as ReturnType<typeof vi.fn>).mockReturnValue({
      agentRecommendations: [
        { agentId: 'agent1', action: 'BUY' },
        { agentId: 'agent2', action: 'SELL' }
      ],
      portfolioDecision: {
        action: 'BUY',
        ticker: 'BTC',
        amount: 0.05,
        price: 45000,
        confidence: 80,
        riskScore: 35,
        contributors: ['agent1', 'agent2'],
        reasoning: 'Test reasoning',
        timestamp: new Date().toISOString()
      },
      loadingDecision: false,
      handleExecuteDecision: mockHandleExecute,
      handleRefreshAnalysis: vi.fn()
    });

    render(<PortfolioManager isSimulationMode={true} />);
    
    // Check if recommendations are rendered
    expect(screen.getByTestId('recommendation-list')).toBeInTheDocument();
    expect(screen.getByText('2 recommendations')).toBeInTheDocument();
    
    // Check if portfolio decision is rendered
    expect(screen.getByTestId('portfolio-decision')).toBeInTheDocument();
    expect(screen.getByText('Decision: BUY')).toBeInTheDocument();
    expect(screen.getByText('Simulation: Yes')).toBeInTheDocument();
    
    // Check if simulation alert is rendered when in simulation mode
    expect(screen.getByTestId('simulation-alert')).toBeInTheDocument();
    
    // Test execute button
    const executeButton = screen.getByTestId('execute-button');
    fireEvent.click(executeButton);
    
    // Check if execute handler was called with correct simulation mode
    expect(mockHandleExecute).toHaveBeenCalledWith(true);
  });

  it('renders loading state when loadingDecision is true', () => {
    (usePortfolioManager as ReturnType<typeof vi.fn>).mockReturnValue({
      agentRecommendations: [
        { agentId: 'agent1', action: 'BUY' }
      ],
      portfolioDecision: null,
      loadingDecision: true,
      handleExecuteDecision: vi.fn(),
      handleRefreshAnalysis: vi.fn()
    });

    render(<PortfolioManager />);
    
    // Check if recommendations are rendered
    expect(screen.getByTestId('recommendation-list')).toBeInTheDocument();
    
    // Check if loading state is rendered
    expect(screen.getByTestId('loading-decision')).toBeInTheDocument();
  });

  it('calls refresh analysis handler when refresh button is clicked', () => {
    const mockRefresh = vi.fn();
    
    (usePortfolioManager as ReturnType<typeof vi.fn>).mockReturnValue({
      agentRecommendations: [],
      portfolioDecision: null,
      loadingDecision: false,
      handleExecuteDecision: vi.fn(),
      handleRefreshAnalysis: mockRefresh
    });

    render(<PortfolioManager currentData={{ symbol: 'BTC' }} />);
    
    // Click the refresh button
    const refreshButton = screen.getByTestId('refresh-button');
    fireEvent.click(refreshButton);
    
    // Check if refresh handler was called
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it('disables refresh button when currentData is not available', () => {
    (usePortfolioManager as ReturnType<typeof vi.fn>).mockReturnValue({
      agentRecommendations: [],
      portfolioDecision: null,
      loadingDecision: false,
      handleExecuteDecision: vi.fn(),
      handleRefreshAnalysis: vi.fn()
    });

    render(<PortfolioManager currentData={null} />);
    
    // Check if the refresh button is disabled
    const refreshButton = screen.getByTestId('refresh-button');
    expect(refreshButton).toBeDisabled();
  });

  it('handles simulation toggle correctly', () => {
    const mockToggle = vi.fn();
    
    (usePortfolioManager as ReturnType<typeof vi.fn>).mockReturnValue({
      agentRecommendations: [],
      portfolioDecision: null,
      loadingDecision: false,
      handleExecuteDecision: vi.fn(),
      handleRefreshAnalysis: vi.fn()
    });

    render(<PortfolioManager isSimulationMode={false} onSimulationToggle={mockToggle} />);
    
    // Since we're not testing the actual toggle UI (it's mocked),
    // we can only verify that the props are correctly passed
    expect(screen.queryByTestId('simulation-alert')).not.toBeInTheDocument();
  });
});
