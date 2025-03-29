
/**
 * Helper functions for the onboarding system
 */

// This function ensures we have valid IDs on elements for onboarding targeting
export const addOnboardingAttributes = () => {
  // Add IDs to dashboard tabs if they don't exist
  setTimeout(() => {
    // Main dashboard overview
    const dashboardOverview = document.querySelector('.dashboard-overview');
    if (dashboardOverview && !dashboardOverview.id) {
      dashboardOverview.id = 'dashboard-overview';
    }

    // Tab elements
    const tabElements = [
      { selector: '[data-tab="market"]', id: 'market-tab' },
      { selector: '[data-tab="trading"]', id: 'trading-tab' },
      { selector: '[data-tab="ai"]', id: 'ai-tab' },
      { selector: '[data-tab="risk"]', id: 'risk-tab' }
    ];

    tabElements.forEach(({ selector, id }) => {
      const element = document.querySelector(selector);
      if (element && !element.id) {
        element.id = id;
      }
    });

    console.log('Onboarding attributes added to DOM elements');
  }, 1000); // Delay to ensure elements are in the DOM
};
