
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/tests/utils/test-utils';
import { SimulationAlert } from '@/components/trading/portfolio/SimulationAlert';

describe('SimulationAlert', () => {
  it('renders the simulation alert correctly', () => {
    const mockToggle = jest.fn();
    render(<SimulationAlert onToggleSimulation={mockToggle} />);
    
    // Check if the alert message is displayed
    expect(screen.getByText(/You are in simulation mode/i)).toBeInTheDocument();
    expect(screen.getByText(/No real trades will be executed/i)).toBeInTheDocument();
    
    // Check if the exit button is displayed
    expect(screen.getByRole('button', { name: /Exit Simulation/i })).toBeInTheDocument();
  });

  it('renders without onToggleSimulation prop', () => {
    render(<SimulationAlert />);
    
    // Check if the alert message is displayed
    expect(screen.getByText(/You are in simulation mode/i)).toBeInTheDocument();
    
    // Button should not be rendered
    expect(screen.queryByRole('button', { name: /Exit Simulation/i })).not.toBeInTheDocument();
  });
});
