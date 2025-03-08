
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BellIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface PriceAlertsProps {
  selectedPair: string;
}

interface PriceAlert {
  id: string;
  pair: string;
  condition: "above" | "below";
  price: number;
  enabled: boolean;
}

export const PriceAlerts = ({ selectedPair }: PriceAlertsProps) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    { id: "1", pair: "BTC/USDT", condition: "above", price: 50000, enabled: true },
    { id: "2", pair: "BTC/USDT", condition: "below", price: 40000, enabled: true },
  ]);
  
  const [price, setPrice] = useState<string>("");
  const [condition, setCondition] = useState<"above" | "below">("above");
  
  const handleAddAlert = () => {
    if (!price || isNaN(Number(price))) {
      return;
    }
    
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      pair: selectedPair,
      condition,
      price: Number(price),
      enabled: true
    };
    
    setAlerts([...alerts, newAlert]);
    setPrice("");
  };
  
  const handleToggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };
  
  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <BellIcon className="h-5 w-5" />
          Price Alerts
        </CardTitle>
        <Badge variant="outline" className="ml-2">
          {alerts.filter(a => a.enabled).length} Active
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="alert-condition">Condition</Label>
            <Select value={condition} onValueChange={(value: "above" | "below") => setCondition(value)}>
              <SelectTrigger id="alert-condition">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Price Above</SelectItem>
                <SelectItem value="below">Price Below</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="alert-price">Price (USD)</Label>
            <Input
              id="alert-price"
              type="number"
              placeholder="Enter price..."
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          
          <div className="flex items-end">
            <Button onClick={handleAddAlert} className="w-full">
              <PlusCircleIcon className="h-4 w-4 mr-2" />
              Add Alert
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          {alerts.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No price alerts set. Add one above.
            </div>
          ) : (
            alerts.map(alert => (
              <div 
                key={alert.id} 
                className={`flex items-center justify-between p-3 rounded-md border ${
                  alert.enabled ? 'bg-muted/30' : 'bg-muted/10 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Switch
                    checked={alert.enabled}
                    onCheckedChange={() => handleToggleAlert(alert.id)}
                  />
                  <span className="font-medium">
                    {alert.pair} {alert.condition === "above" ? "↑" : "↓"} ${alert.price.toLocaleString()}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDeleteAlert(alert.id)}
                >
                  <Trash2Icon className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
