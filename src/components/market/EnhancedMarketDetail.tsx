
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MarketDetailHeader } from './detail/MarketDetailHeader';
import { MarketPriceOverview } from './detail/MarketPriceOverview';
import { MarketData } from './types';
import { useIsMobile } from "@/hooks/use-mobile";
import { CollapsibleSection } from './detail/CollapsibleSection';
import { MarketTabs } from './detail/MarketTabs';

interface EnhancedMarketDetailProps {
  marketData: MarketData;
  onClose: () => void;
}

export const EnhancedMarketDetail = ({ marketData, onClose }: EnhancedMarketDetailProps) => {
  const isMobile = useIsMobile();
  const [expandedSections, setExpandedSections] = useState({
    priceOverview: true,
    chartSection: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Card className="bg-card overflow-hidden border-0">
      <MarketDetailHeader marketData={marketData} onClose={onClose} />
      
      <CardContent className={`p-4 ${isMobile ? 'p-2' : 'p-6'}`}>
        {/* Price Overview Section - Expandable */}
        <CollapsibleSection
          title="Price Overview"
          isExpanded={expandedSections.priceOverview}
          onToggle={() => toggleSection('priceOverview')}
          className="mb-6"
        >
          <MarketPriceOverview marketData={marketData} />
        </CollapsibleSection>
        
        {/* Main Content Tabs */}
        <MarketTabs 
          marketData={marketData} 
          expandedSections={expandedSections} 
          toggleSection={toggleSection}
          onClose={onClose}
        />
      </CardContent>
    </Card>
  );
};
