
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, X } from "lucide-react";

interface PriceAlert {
  id: string;
  symbol: string;
  condition: "above" | "below";
  price: number;
}

export const PriceAlerts = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    { id: "1", symbol: "BTC/USDT", condition: "above", price: 50000 },
    { id: "2", symbol: "BTC/USDT", condition: "below", price: 40000 }
  ]);
  
  const [newAlertCondition, setNewAlertCondition] = useState<"above" | "below">("above");
  const [newAlertPrice, setNewAlertPrice] = useState("");
  
  const addAlert = () => {
    if (!newAlertPrice || isNaN(Number(newAlertPrice))) return;
    
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      symbol: "BTC/USDT", // Default symbol, could be made dynamic
      condition: newAlertCondition,
      price: Number(newAlertPrice)
    };
    
    setAlerts([...alerts, newAlert]);
    setNewAlertPrice("");
  };
  
  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md">Price Alerts</CardTitle>
          <Badge variant="outline">{alerts.length} Active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 items-center">
          <div className="col-span-1">
            <div className="text-xs text-muted-foreground mb-1">Condition</div>
            <Select value={newAlertCondition} onValueChange={(value: "above" | "below") => setNewAlertCondition(value)}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Price Above</SelectItem>
                <SelectItem value="below">Price Below</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="col-span-1">
            <div className="text-xs text-muted-foreground mb-1">Price (USD)</div>
            <Input 
              className="h-8" 
              placeholder="Enter price..." 
              value={newAlertPrice}
              onChange={(e) => setNewAlertPrice(e.target.value)}
            />
          </div>
          
          <div className="flex items-end">
            <Button onClick={addAlert} className="h-8 w-full" disabled={!newAlertPrice || isNaN(Number(newAlertPrice))}>
              Add Alert
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex justify-between items-center p-2 border rounded-md">
              <div className="flex items-center space-x-2">
                <Badge variant={alert.condition === "above" ? "default" : "destructive"} className="h-6 px-1">
                  {alert.condition === "above" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                </Badge>
                <span>
                  {alert.symbol} {alert.condition === "above" ? "↑" : "↓"} ${alert.price.toLocaleString()}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeAlert(alert.id)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
