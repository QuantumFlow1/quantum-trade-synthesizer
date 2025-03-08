
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TimeframeSelectorProps {
  activeTimeframe: string;
}

export const TimeframeSelector = ({ activeTimeframe }: TimeframeSelectorProps) => {
  return (
    <TabsList className="grid grid-cols-7 mb-4">
      <TabsTrigger value="1h">1H</TabsTrigger>
      <TabsTrigger value="24h">24H</TabsTrigger>
      <TabsTrigger value="7d">7D</TabsTrigger>
      <TabsTrigger value="30d">30D</TabsTrigger>
      <TabsTrigger value="90d">3M</TabsTrigger>
      <TabsTrigger value="1y">1Y</TabsTrigger>
      <TabsTrigger value="all">ALL</TabsTrigger>
    </TabsList>
  );
};
