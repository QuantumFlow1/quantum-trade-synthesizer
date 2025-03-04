
// Fix for @testing-library/jest-dom with Vitest
import '@testing-library/jest-dom';

declare global {
  namespace Vi {
    interface Assertion {
      toBeInTheDocument(): void;
      toHaveClass(className: string): void;
      toBeDisabled(): void;
    }
  }
}
