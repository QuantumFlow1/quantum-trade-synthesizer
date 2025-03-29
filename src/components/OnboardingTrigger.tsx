
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';

export const OnboardingTrigger = () => {
  const { startOnboarding } = useOnboarding();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-2"
      onClick={startOnboarding}
    >
      <PlayCircle className="h-4 w-4" />
      Start Tour
    </Button>
  );
};
