
import React, { useEffect, useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingTooltip } from '@/components/ui/tooltip-custom';

interface OnboardingTooltipWrapperProps {
  children: React.ReactNode;
}

export const OnboardingTooltipWrapper: React.FC<OnboardingTooltipWrapperProps> = ({ children }) => {
  const { 
    steps, 
    currentStepIndex, 
    isOnboardingActive, 
    goToNextStep, 
    skipOnboarding 
  } = useOnboarding();
  const [tooltipsInitialized, setTooltipsInitialized] = useState(false);

  // Ensure elements are loaded before trying to find them
  useEffect(() => {
    if (isOnboardingActive && !tooltipsInitialized) {
      // Wait for elements to be available in the DOM
      setTimeout(() => {
        setTooltipsInitialized(true);
      }, 500);
    }
  }, [isOnboardingActive, tooltipsInitialized]);

  // Disable onboarding wrapper if not active
  if (!isOnboardingActive || !tooltipsInitialized) {
    return <>{children}</>;
  }

  const currentStep = steps[currentStepIndex];
  if (!currentStep) {
    return <>{children}</>;
  }

  // This ensures the elements from the steps are used as tooltip targets
  const findTargetElements = () => {
    // Find all elements that match the elementIds in the steps
    const elementsToHighlight = steps.map((step) => {
      const element = document.getElementById(step.elementId);
      return {
        id: step.id,
        element,
        active: step.id === currentStep.id,
      };
    });

    return elementsToHighlight;
  };

  const targetElements = findTargetElements();
  
  return (
    <>
      {children}
      
      {/* Overlay for onboarding */}
      <div className="fixed inset-0 z-40 bg-black/20 pointer-events-none" />
      
      {/* Map through target elements and create tooltips */}
      {targetElements.map(({ id, element, active }) => 
        element && active ? (
          <div 
            key={id}
            className="absolute" 
            style={{
              top: element.offsetTop,
              left: element.offsetLeft,
              width: element.offsetWidth,
              height: element.offsetHeight,
              zIndex: 50
            }}
          >
            <OnboardingTooltip
              id={id}
              title={currentStep.title}
              content={currentStep.content}
              position={currentStep.position || "bottom"}
              highlight={true}
              isOpen={true}
              onDismiss={skipOnboarding}
              onNext={goToNextStep}
              showNext={true}
            >
              <div 
                className="w-full h-full bg-transparent pointer-events-auto"
                data-onboarding-target={id}
              />
            </OnboardingTooltip>
          </div>
        ) : null
      )}
    </>
  );
};
