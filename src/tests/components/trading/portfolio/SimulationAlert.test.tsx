
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import { SimulationAlert } from '@/components/trading/portfolio/SimulationAlert';

describe('SimulationAlert', () => {
  it('renders the simulation alert correctly', () => {
    render(<SimulationAlert />);
    
    // Check if the alert message is displayed
    expect(screen.getByText(/Simulation mode active/i)).toBeInTheDocument();
    expect(screen.getByText(/will not affect real balances/i)).toBeInTheDocument();
    
    // Check if the alert icon is displayed
    const checkIcon = document.querySelector('.text-green-500');
    expect(checkIcon).toBeInTheDocument();
  });
});
