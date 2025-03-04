
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../utils/test-utils';
import { EmptyAnalysisState } from '@/components/trading/portfolio/EmptyAnalysisState';

describe('EmptyAnalysisState', () => {
  it('renders the empty state message correctly', () => {
    const mockRefresh = vi.fn();
    render(<EmptyAnalysisState onRefreshAnalysis={mockRefresh} isDisabled={false} />);
    
    // Check if the empty state text is displayed
    expect(screen.getByText('No Active Analysis')).toBeInTheDocument();
    expect(screen.getByText(/Generate AI trading recommendations/i)).toBeInTheDocument();
    
    // Check if the button is displayed
    const button = screen.getByRole('button', { name: /Analyze Market/i });
    expect(button).toBeInTheDocument();
  });

  it('calls the refresh function when button is clicked', () => {
    const mockRefresh = vi.fn();
    render(<EmptyAnalysisState onRefreshAnalysis={mockRefresh} isDisabled={false} />);
    
    // Click the button
    const button = screen.getByRole('button', { name: /Analyze Market/i });
    fireEvent.click(button);
    
    // Check if the refresh function was called
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it('disables the button when isDisabled is true', () => {
    const mockRefresh = vi.fn();
    render(<EmptyAnalysisState onRefreshAnalysis={mockRefresh} isDisabled={true} />);
    
    // Check if the button is disabled
    const button = screen.getByRole('button', { name: /Analyze Market/i });
    expect(button).toBeDisabled();
    
    // Click the disabled button
    fireEvent.click(button);
    
    // Check that the refresh function was not called
    expect(mockRefresh).not.toHaveBeenCalled();
  });
});
