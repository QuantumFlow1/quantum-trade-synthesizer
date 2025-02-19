
import { Button } from "@/components/ui/button";
import { Settings2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface WidgetSettings {
  id: string;
  name: string;
  enabled: boolean;
}

export const DashboardSettings = () => {
  const { toast } = useToast();
  const [widgets, setWidgets] = useState<WidgetSettings[]>([
    { id: "market", name: "Market Overview", enabled: true },
    { id: "performance", name: "Performance Metrics", enabled: true },
    { id: "trading", name: "Trading Interface", enabled: true },
    { id: "autoTrading", name: "Auto Trading", enabled: true },
    { id: "riskManagement", name: "Risk Management", enabled: true },
    { id: "transactions", name: "Recent Transactions", enabled: true },
    { id: "alerts", name: "Alerts", enabled: true },
    { id: "advice", name: "Financial Advice", enabled: true }
  ]);

  const handleWidgetToggle = (widgetId: string) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, enabled: !widget.enabled }
          : widget
      )
    );

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
