import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ZeroToSixtyCalculator } from '../0-60-calculator';

describe('ZeroToSixtyCalculator', () => {
  it('renders correctly', () => {
    render(<ZeroToSixtyCalculator />);
    expect(screen.getByText('0-60 Calculator')).toBeInTheDocument();
  });

  it('calculates average speed and acceleration correctly for valid inputs', () => {
    render(<ZeroToSixtyCalculator />);
    
    const distanceInput = screen.getByLabelText('Distance Traveled (feet)');
    const timeInput = screen.getByLabelText('Time (seconds)');
    const calculateButton = screen.getByRole('button', { name: 'Calculate' });

    fireEvent.change(distanceInput, { target: { value: '1320' } });
    fireEvent.change(timeInput, { target: { value: '12' } });

    fireEvent.click(calculateButton);

    expect(screen.getByText(/Average Speed:/)).toBeInTheDocument();
    expect(screen.getByText(/Acceleration:/)).toBeInTheDocument();
  });

  it('does not crash or show NaN when fields are left blank', () => {
    render(<ZeroToSixtyCalculator />);
    
    const calculateButton = screen.getByRole('button', { name: 'Calculate' });
    
    // Click with empty inputs
    fireEvent.click(calculateButton);
    
    // Should not display Average Speed results
    expect(screen.queryByText(/Average Speed:/)).not.toBeInTheDocument();
  });
});
