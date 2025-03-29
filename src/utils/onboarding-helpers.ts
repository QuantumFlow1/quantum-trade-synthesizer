
// Helper functions for onboarding

export function addOnboardingAttributes() {
  // Add data attributes to dashboard elements for onboarding tooltips
  const dashboardOverview = document.getElementById('dashboard-overview');
  if (dashboardOverview) {
    dashboardOverview.setAttribute('data-onboarding-id', 'dashboard-overview');
  }

  const marketTab = document.getElementById('market-tab');
  if (marketTab) {
    marketTab.setAttribute('data-onboarding-id', 'market-tab');
  }

  const tradingTab = document.getElementById('trading-tab');
  if (tradingTab) {
    tradingTab.setAttribute('data-onboarding-id', 'trading-tab');
  }

  const aiTab = document.getElementById('ai-tab');
  if (aiTab) {
    aiTab.setAttribute('data-onboarding-id', 'ai-tab');
  }

  const riskTab = document.getElementById('risk-tab');
  if (riskTab) {
    riskTab.setAttribute('data-onboarding-id', 'risk-tab');
  }
}

// Get a reference to an element by its onboarding ID
export function getOnboardingElement(id: string): HTMLElement | null {
  return document.querySelector(`[data-onboarding-id="${id}"]`);
}
