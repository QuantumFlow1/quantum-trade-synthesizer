
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useDashboard } from "@/contexts/DashboardContext";

interface WidgetSettings {
  id: keyof typeof widgetNames;
  name: string;
  enabled: boolean;
}

const widgetNames = {
  market: "Market Overview",
  performance: "Performance Metrics",
  trading: "Trading Interface",
  autoTrading: "Auto Trading",
  riskManagement: "Risk Management",
  transactions: "Recent Transactions",
  alerts: "Alerts",
  advice: "Financial Advice",
  llmExtensions: "AI Assistant Extensions"
};

export const DashboardSettings = () => {
  const { toast } = useToast();
  const { visibleWidgets, setVisibleWidgets } = useDashboard();
  
  const widgets: WidgetSettings[] = Object.entries(widgetNames).map(([id, name]) => ({
    id: id as keyof typeof widgetNames,
    name,
    enabled: visibleWidgets[id as keyof typeof visibleWidgets]
  }));

  const handleWidgetToggle = (widgetId: keyof typeof widgetNames) => {
    setVisibleWidgets(prev => ({
      ...prev,
      [widgetId]: !prev[widgetId]
    }));

    toast({
      title: "Widget Updated",
      description: "Dashboard layout has been updated.",
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="fixed top-6 right-6 z-50 backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] bg-background/95 backdrop-blur-xl border-white/10">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-gradient">Dashboard Settings</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gradient">Visible Widgets</h3>
            <div className="space-y-4">
              {widgets.map((widget) => (
                <div key={widget.id} className="flex items-center justify-between">
                  <Label htmlFor={widget.id} className="flex items-center gap-2">
                    {widget.name}
                  </Label>
                  <Switch
                    id={widget.id}
                    checked={widget.enabled}
                    onCheckedChange={() => handleWidgetToggle(widget.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
