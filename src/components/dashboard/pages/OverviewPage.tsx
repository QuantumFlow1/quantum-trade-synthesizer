
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OnboardingTrigger } from '@/components/OnboardingTrigger';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface OverviewPageProps {
  apiStatus?: 'checking' | 'available' | 'unavailable';
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ apiStatus }) => {
  const { isOnboardingActive } = useOnboarding();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        {!isOnboardingActive && <OnboardingTrigger />}
      </div>
      
      {/* Rest of the dashboard overview content */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome to your trading dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your portfolio summary and market insights will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};
