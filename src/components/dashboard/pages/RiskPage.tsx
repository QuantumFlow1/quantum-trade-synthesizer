
import React, { useState, useEffect } from 'react';
import RiskManagement from '@/components/RiskManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TrendingDown, BarChart3, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";

export const RiskPage = () => {
  const [showOnboarding, setShowOnboarding] = useLocalStorage('risk-onboarding-completed', true);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const totalSteps = 4;

  useEffect(() => {
    // First time users see the onboarding dialog
    const hasSeenOnboarding = localStorage.getItem('risk-onboarding-seen');
    if (!hasSeenOnboarding) {
      localStorage.setItem('risk-onboarding-seen', 'true');
    }
  }, []);

  const handleNextStep = () => {
    if (onboardingStep < totalSteps) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
    }
  };

  const handleSkipOnboarding = () => {
    setShowOnboarding(false);
  };
  
  const handleRestartOnboarding = () => {
    setOnboardingStep(1);
    setShowOnboarding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Risk Management</h1>
          <p className="text-muted-foreground">
            Monitor and control your trading risks. Set risk parameters, analyze your risk exposure, and receive warnings when approaching your risk limits.
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleRestartOnboarding}>
                <i className="mr-2">?</i> Tutorial
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Restart the risk management tutorial</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TooltipProvider>
          <Tooltip open={showOnboarding && onboardingStep === 1} onOpenChange={open => !open && handleNextStep()}>
            <TooltipTrigger asChild>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-blue-500 mr-2" />
                    <CardTitle className="text-lg">Risk Management</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Set your risk parameters and control exposure with custom settings.</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="p-4 max-w-sm">
              <p className="font-bold">Risk Management</p>
              <p>This section shows your current risk parameters and allows you to customize your risk preferences.</p>
              <p className="text-muted-foreground mt-2">Click anywhere to continue...</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip open={showOnboarding && onboardingStep === 2} onOpenChange={open => !open && handleNextStep()}>
            <TooltipTrigger asChild>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                    <CardTitle className="text-lg">Drawdown Control</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Monitor and limit drawdowns to protect your capital.</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="p-4 max-w-sm">
              <p className="font-bold">Drawdown Control</p>
              <p>Protect your portfolio by setting maximum drawdown limits and receiving alerts when they're approached.</p>
              <p className="text-muted-foreground mt-2">Click anywhere to continue...</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip open={showOnboarding && onboardingStep === 3} onOpenChange={open => !open && handleNextStep()}>
            <TooltipTrigger asChild>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-green-500 mr-2" />
                    <CardTitle className="text-lg">Metrics History</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Track your risk metrics over time and analyze patterns.</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="p-4 max-w-sm">
              <p className="font-bold">Metrics History</p>
              <p>Review how your risk exposure has changed over time and identify trends that might need attention.</p>
              <p className="text-muted-foreground mt-2">Click anywhere to continue...</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip open={showOnboarding && onboardingStep === 4} onOpenChange={open => !open && handleNextStep()}>
            <TooltipTrigger asChild>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    <CardTitle className="text-lg">Risk Alerts</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Receive automated warnings when your risk levels exceed thresholds.</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="p-4 max-w-sm">
              <p className="font-bold">Risk Alerts</p>
              <p>Get notified automatically when any risk parameter approaches or exceeds your predefined thresholds.</p>
              <p className="text-muted-foreground mt-2">Click anywhere to finish the tutorial!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <RiskManagement />

      <Dialog open={showOnboarding && onboardingStep === 1} onOpenChange={setShowOnboarding}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to Risk Management</DialogTitle>
            <DialogDescription>
              This tutorial will guide you through the key features of the risk management dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p>The Risk Management module helps you monitor and control various risk factors in your trading activities.</p>
            <p>Follow along with the tooltips to learn how to use this module effectively.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleSkipOnboarding}>Skip Tutorial</Button>
            <Button onClick={handleNextStep}>Start Tour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
