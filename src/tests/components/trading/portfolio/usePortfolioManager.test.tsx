
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePortfolioManager } from '@/components/trading/portfolio/usePortfolioManager';
import { useToast } from '@/hooks/use-toast';

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn().mockReturnValue({
    toast: vi.fn()
  })
}));

describe('usePortfolioManager', () => {
  beforeEach(() => {
    // Reset the mocks
    vi.resetAllMocks();
    
    // Mock setTimeout to execute immediately
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => usePortfolioManager(null));
    
    expect(result.current.agentRecommendations).toEqual([]);
    expect(result.current.portfolioDecision).toBeNull();
    expect(result.current.loadingDecision).toBeFalsy();
  });

  it('generates recommendations when currentData is provided', () => {
    const mockData = { symbol: 'BTC', price: 45000 };
    
    const { result } = renderHook(() => usePortfolioManager(mockData));
    
    // Check if recommendations are generated
    expect(result.current.agentRecommendations.length).toBeGreaterThan(0);
    expect(result.current.loadingDecision).toBeTruthy();
    
    // Fast-forward timers to complete the decision generation
    act(() => {
      vi.runAllTimers();
    });
    
    // Check if portfolio decision is generated
    expect(result.current.portfolioDecision).not.toBeNull();
    expect(result.current.loadingDecision).toBeFalsy();
  });

  it('handles execute decision correctly', () => {
    const mockToast = vi.fn();
    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({ toast: mockToast });
    
    const mockData = { symbol: 'BTC', price: 45000 };
    const { result } = renderHook(() => usePortfolioManager(mockData));
    
    // Fast-forward timers to generate the decision
    act(() => {
      vi.runAllTimers();
    });
    
    // Execute the decision
    act(() => {
      result.current.handleExecuteDecision(true);
    });
    
    // Check if toast was called
    expect(mockToast).toHaveBeenCalled();
    
    // Check if state was reset
    expect(result.current.portfolioDecision).toBeNull();
    expect(result.current.agentRecommendations).toEqual([]);
  });

  it('handles refresh analysis correctly', () => {
    const mockToast = vi.fn();
    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({ toast: mockToast });
    
    const mockData = { symbol: 'BTC', price: 45000 };
    const { result } = renderHook(() => usePortfolioManager(mockData));
    
    // Fast-forward timers to complete the initial decision generation
    act(() => {
      vi.runAllTimers();
    });
    
    // Reset all mocks
    vi.resetAllMocks();
    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({ toast: mockToast });
    
    // Refresh the analysis
    act(() => {
      result.current.handleRefreshAnalysis();
    });
    
    // Check if state was reset
    expect(result.current.portfolioDecision).toBeNull();
    expect(result.current.loadingDecision).toBeTruthy();
    
    // Check if toast was called
    expect(mockToast).toHaveBeenCalled();
    
    // Fast-forward timers again to complete the refreshed decision generation
    act(() => {
      vi.runAllTimers();
    });
    
    // Check if new recommendations and decision were generated
    expect(result.current.agentRecommendations.length).toBeGreaterThan(0);
    expect(result.current.portfolioDecision).not.toBeNull();
  });

  it('calculates majority action correctly', () => {
    const mockData = { symbol: 'BTC', price: 45000 };
    
    // Create a simple mock that will produce recommendations with specific actions
    const originalMath = global.Math;
    global.Math = {
      ...originalMath,
      random: vi.fn()
    };
    
    // First set of recommendations should favor BUY
    (Math.random as ReturnType<typeof vi.fn>).mockReturnValueOnce(0.8) // value-investor -> BUY
                              .mockReturnValueOnce(0.6) // technical-analyst -> BUY
                              .mockReturnValueOnce(0.7); // sentiment-analyst -> BUY
    
    const { result: result1 } = renderHook(() => usePortfolioManager(mockData));
    
    act(() => {
      vi.runAllTimers();
    });
    
    expect(result1.current.portfolioDecision?.action).toBe('BUY');
    
    // Reset mocks
    vi.resetAllMocks();
    
    // Second set of recommendations should favor SELL
    (Math.random as ReturnType<typeof vi.fn>).mockReturnValueOnce(0.3) // value-investor -> SELL
                              .mockReturnValueOnce(0.2) // technical-analyst -> SELL
                              .mockReturnValueOnce(0.2); // sentiment-analyst -> SELL
    
    const { result: result2 } = renderHook(() => usePortfolioManager(mockData));
    
    act(() => {
      vi.runAllTimers();
    });
    
    expect(result2.current.portfolioDecision?.action).toBe('SELL');
    
    // Restore original Math
    global.Math = originalMath;
  });
});
