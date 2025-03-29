import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

interface OnboardingStep {
  id: string;
  title: string;
  content: string;
  elementId: string;
  position?: "top" | "bottom" | "left" | "right";
  completed: boolean;
}

interface OnboardingContextType {
  steps: OnboardingStep[];
  currentStepIndex: number;
  isOnboardingActive: boolean;
  startOnboarding: () => void;
  completeCurrentStep: () => void;
  goToNextStep: () => void;
  skipOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const defaultSteps: OnboardingStep[] = [
  {
    id: "dashboard-overview",
    title: "Welkom bij het Dashboard",
    content: "Hier vindt u een overzicht van uw portefeuille en marktgegevens.",
    elementId: "dashboard-overview",
    position: "bottom",
    completed: false,
  },
  {
    id: "market-analysis",
    title: "Marktanalyse",
    content: "Bekijk gedetailleerde marktanalyses en trends.",
    elementId: "market-tab",
    position: "bottom",
    completed: false,
  },
  {
    id: "trading-tools",
    title: "Handelsplatform",
    content: "Plaats handelsorders en beheer uw posities.",
    elementId: "trading-tab",
    position: "bottom",
    completed: false,
  },
  {
    id: "ai-tools",
    title: "AI Hulpmiddelen",
    content: "Gebruik geavanceerde AI-tools voor marktinzichten en voorspellingen.",
    elementId: "ai-tab",
    position: "bottom",
    completed: false,
  },
  {
    id: "risk-management",
    title: "Risicobeheer",
    content: "Beheer uw risicoparameters en stel limieten in.",
    elementId: "risk-tab",
    position: "bottom",
    completed: false,
  }
];

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { userProfile } = useAuth();
  const [steps, setSteps] = useState<OnboardingStep[]>(defaultSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isOnboardingActive, setIsOnboardingActive] = useState<boolean>(false);

  // Check if user is new and should see onboarding
  useEffect(() => {
    if (userProfile) {
      const hasSeenOnboarding = localStorage.getItem(`onboarding-completed-${userProfile.id}`);
      if (!hasSeenOnboarding) {
        // Only auto-start for brand new users, checking 'last_login' instead of 'last_login_at'
        const isNewUser = userProfile.last_login === null;
        if (isNewUser) {
          // Wait a moment for the UI to load before starting
          setTimeout(() => {
            startOnboarding();
          }, 2000);
        }
      }
    }
  }, [userProfile]);

  const startOnboarding = () => {
    setSteps(defaultSteps.map(step => ({ ...step, completed: false })));
    setCurrentStepIndex(0);
    setIsOnboardingActive(true);
  };

  const completeCurrentStep = () => {
    setSteps(prev => 
      prev.map((step, index) => 
        index === currentStepIndex ? { ...step, completed: true } : step
      )
    );
  };

  const goToNextStep = () => {
    completeCurrentStep();
    
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // All steps completed
      if (userProfile) {
        localStorage.setItem(`onboarding-completed-${userProfile.id}`, 'true');
      }
      setIsOnboardingActive(false);
    }
  };

  const skipOnboarding = () => {
    if (userProfile) {
      localStorage.setItem(`onboarding-completed-${userProfile.id}`, 'true');
    }
    setIsOnboardingActive(false);
  };

  const resetOnboarding = () => {
    if (userProfile) {
      localStorage.removeItem(`onboarding-completed-${userProfile.id}`);
    }
    setSteps(defaultSteps.map(step => ({ ...step, completed: false })));
    setCurrentStepIndex(0);
    setIsOnboardingActive(false);
  };

  return (
    <OnboardingContext.Provider
      value={{
        steps,
        currentStepIndex,
        isOnboardingActive,
        startOnboarding,
        completeCurrentStep,
        goToNextStep,
        skipOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
