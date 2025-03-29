
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Zap, Shield, BarChart3, Sparkles } from 'lucide-react';

interface SubscriptionTier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: Array<{
    name: string;
    included: boolean;
    highlighted?: boolean;
  }>;
  highlighted?: boolean;
  buttonText: string;
  icon: React.ReactNode;
}

interface SubscriptionTiersProps {
  onSelectTier?: (tierId: string) => void;
  currentTier?: string;
}

export const SubscriptionTiers: React.FC<SubscriptionTiersProps> = ({
  onSelectTier,
  currentTier
}) => {
  const subscriptionTiers: SubscriptionTier[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: '€29',
      description: 'Essential tools for casual traders',
      icon: <BarChart3 className="h-5 w-5" />,
      features: [
        { name: 'Real-time market data', included: true },
        { name: 'Basic technical indicators', included: true },
        { name: 'Portfolio tracking', included: true },
        { name: 'Basic risk assessment', included: true, highlighted: true },
        { name: 'AI trading signals', included: false },
        { name: 'Advanced risk management', included: false },
        { name: 'API access', included: false },
        { name: 'Priority support', included: false }
      ],
      buttonText: 'Start Basic'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '€99',
      description: 'Advanced features for serious traders',
      icon: <Shield className="h-5 w-5" />,
      highlighted: true,
      features: [
        { name: 'Real-time market data', included: true },
        { name: 'Advanced technical indicators', included: true },
        { name: 'Portfolio tracking & optimization', included: true },
        { name: 'Comprehensive risk management', included: true, highlighted: true },
        { name: 'AI trading signals & analysis', included: true, highlighted: true },
        { name: 'Multi-asset correlation analysis', included: true },
        { name: 'API access (limited)', included: true },
        { name: 'Priority support', included: false }
      ],
      buttonText: 'Upgrade to Pro'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      description: 'Tailored solutions for institutions',
      icon: <Sparkles className="h-5 w-5" />,
      features: [
        { name: 'Real-time market data', included: true },
        { name: 'All technical indicators', included: true },
        { name: 'Advanced portfolio management', included: true },
        { name: 'Advanced risk management suite', included: true, highlighted: true },
        { name: 'Custom AI models & signals', included: true, highlighted: true },
        { name: 'White-label solution', included: true, highlighted: true },
        { name: 'Full API access', included: true, highlighted: true },
        { name: 'Dedicated account manager', included: true }
      ],
      buttonText: 'Contact Sales'
    }
  ];

  const handleSelectTier = (tierId: string) => {
    if (onSelectTier) {
      onSelectTier(tierId);
    } else {
      console.log(`Selected tier: ${tierId}`);
    }
  };

  return (
    <div className="py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">Choose Your Trading Power</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select the plan that best fits your trading strategy and goals. All plans include our core platform features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {subscriptionTiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={`flex flex-col h-full transition-all duration-200 ${
              tier.highlighted 
                ? 'border-primary shadow-lg relative overflow-hidden' 
                : 'border-white/10'
            }`}
          >
            {tier.highlighted && (
              <div className="absolute top-0 left-0 w-full bg-primary/20 text-center py-1 text-xs font-medium text-primary">
                MOST POPULAR
              </div>
            )}
            <CardHeader className={tier.highlighted ? 'pt-8' : ''}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-2 rounded-full ${tier.highlighted ? 'bg-primary text-white' : 'bg-secondary'}`}>
                  {tier.icon}
                </div>
                <CardTitle>{tier.name}</CardTitle>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold">{tier.price}</span>
                {tier.id !== 'enterprise' && <span className="text-muted-foreground">/mo</span>}
              </div>
              <CardDescription className="mt-2">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    {feature.included ? (
                      <CheckCircle className={`h-5 w-5 mt-0.5 ${feature.highlighted ? 'text-primary' : 'text-green-500'}`} />
                    ) : (
                      <XCircle className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    )}
                    <span className={feature.highlighted ? 'font-medium' : ''}>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${tier.highlighted ? 'bg-primary hover:bg-primary/90' : ''}`}
                variant={tier.highlighted ? 'default' : 'outline'}
                onClick={() => handleSelectTier(tier.id)}
                disabled={currentTier === tier.id}
              >
                {currentTier === tier.id ? (
                  <span className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Current Plan
                  </span>
                ) : (
                  <span className="flex items-center">
                    {tier.highlighted && <Zap className="mr-2 h-4 w-4" />}
                    {tier.buttonText}
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-10 text-sm text-muted-foreground">
        <p>All plans include a 14-day free trial. No credit card required.</p>
        <p className="mt-1">Need help choosing? <Button variant="link" className="h-auto p-0">Contact our team</Button></p>
      </div>
    </div>
  );
};
