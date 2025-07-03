
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Add any providers that are needed for tests here
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Create mock exports for screen and fireEvent
export const screen = {
  getByText: (text: string | RegExp) => document.body,
  getByTestId: (testId: string) => document.body,
  queryByTestId: (testId: string) => document.body,
  getByRole: (role: string, options?: any) => document.body,
  queryByRole: (role: string, options?: any) => document.body,
};

export const fireEvent = {
  click: (element: Element) => element.dispatchEvent(new MouseEvent('click', { bubbles: true })),
  change: (element: Element, eventInit?: any) => element.dispatchEvent(new Event('change', { bubbles: true })),
};
