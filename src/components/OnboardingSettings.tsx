
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { HelpCircle, PlayCircle, RefreshCw } from "lucide-react";
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/components/auth/AuthProvider';

export const OnboardingSettings = () => {
  const { startOnboarding, resetOnboarding } = useOnboarding();
  const { userProfile } = useAuth();
  
  const hasSeenOnboarding = userProfile 
    ? localStorage.getItem(`onboarding-completed-${userProfile.id}`) === 'true'
    : false;

  const handleToggleOnboarding = (checked: boolean) => {
    if (userProfile) {
      if (checked) {
        localStorage.removeItem(`onboarding-completed-${userProfile.id}`);
      } else {
        localStorage.setItem(`onboarding-completed-${userProfile.id}`, 'true');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1.5">
        <h3 className="text-lg font-medium">Rondleiding Instellingen</h3>
        <p className="text-sm text-muted-foreground">
          Beheer de interactieve rondleiding door het platform
        </p>
      </div>
      
      <div className="flex items-center justify-between py-2">
        <div className="flex flex-col space-y-1">
          <Label htmlFor="onboarding-toggle" className="font-medium">
            Rondleiding tonen
          </Label>
          <span className="text-sm text-muted-foreground">
            Toon de interactieve rondleiding voor nieuwe gebruikers
          </span>
        </div>
        <Switch 
          id="onboarding-toggle"
          checked={!hasSeenOnboarding}
          onCheckedChange={handleToggleOnboarding}
        />
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          onClick={startOnboarding}
        >
          <PlayCircle className="h-4 w-4" />
          Start Rondleiding
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          onClick={resetOnboarding}
        >
          <RefreshCw className="h-4 w-4" />
          Reset Rondleiding
        </Button>
      </div>
    </div>
  );
};
