
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/tests/utils/test-utils';
import { LoadingDecision } from '@/components/trading/portfolio/LoadingDecision';

describe('LoadingDecision', () => {
  it('renders the loading state correctly', () => {
    render(<LoadingDecision />);
    
    // Check if the loading spinner is displayed
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    
    // Check if the loading text is displayed
    expect(screen.getByText('Generating portfolio decision...')).toBeInTheDocument();
  });
});
