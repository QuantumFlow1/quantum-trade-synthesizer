
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose 
} from "@/components/ui/dialog";
import { 
  Bell, 
  Plus, 
  Trash2, 
  ChevronDown,
  BellRing,
  Volume2,
  AlertTriangle
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { TradingDataPoint } from "@/utils/tradingData";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type AlertType = "price" | "indicator" | "volume" | "pattern";
export type AlertCondition = "above" | "below" | "crosses" | "crosses-up" | "crosses-down";

export interface TradingAlert {
  id: string;
  name: string;
  type: AlertType;
  condition: AlertCondition;
  value: number;
  active: boolean;
  createdAt: Date;
  triggered?: boolean;
  symbol?: string;
  message?: string;
  indicatorParams?: {
    indicator: string;
    period: number;
  };
  sound?: boolean;
}

interface CustomAlertSystemProps {
  data: TradingDataPoint[];
  symbol?: string;
}

export const CustomAlertSystem = ({ data, symbol = "BTC/USD" }: CustomAlertSystemProps) => {
  const [alerts, setAlerts] = useState<TradingAlert[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [showActiveAlertsOnly, setShowActiveAlertsOnly] = useState(false);
  const [newAlert, setNewAlert] = useState<Omit<TradingAlert, "id" | "createdAt">>({
    name: "",
    type: "price",
    condition: "above",
    value: 0,
    active: true,
    symbol: symbol,
    sound: true
  });
  const [triggeredAlert, setTriggeredAlert] = useState<TradingAlert | null>(null);

  // Update current price when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const latestPrice = data[data.length - 1].close;
      setCurrentPrice(latestPrice);
      
      // Check if any alerts should be triggered
      checkAlerts(latestPrice);
    }
  }, [data]);

  // Check if any alerts should be triggered
  const checkAlerts = (price: number) => {
    const triggeredAlerts = alerts.filter(alert => {
      if (!alert.active) return false;
      
      switch (alert.condition) {
        case "above":
          return price > alert.value;
        case "below":
          return price < alert.value;
        case "crosses":
          // This would require previous price data to detect crossing
          return false;
        case "crosses-up":
          // This would require previous price data to detect crossing up
          return false;
        case "crosses-down":
          // This would require previous price data to detect crossing down
          return false;
        default:
          return false;
      }
    });
    
    // Mark triggered alerts and notify
    if (triggeredAlerts.length > 0) {
      const firstTriggeredAlert = triggeredAlerts[0];
      setTriggeredAlert(firstTriggeredAlert);
      
      // Mark alert as triggered
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === firstTriggeredAlert.id ? { ...alert, triggered: true } : alert
        )
      );
      
      // Show toast notification
      toast({
        title: "Alert Triggered",
        description: `${firstTriggeredAlert.name}: ${symbol} ${firstTriggeredAlert.condition} ${firstTriggeredAlert.value}`,
        variant: "destructive"
      });
      
      // Play sound if enabled
      if (firstTriggeredAlert.sound) {
        playAlertSound();
      }
    }
  };
  
  // Play alert sound
  const playAlertSound = () => {
    try {
      const audio = new Audio('/alert.mp3');
      audio.play();
    } catch (error) {
      console.error("Failed to play alert sound:", error);
    }
  };
  
  // Create a new alert
  const handleCreateAlert = () => {
    const id = Date.now().toString();
    
    const alert: TradingAlert = {
      ...newAlert,
      id,
      createdAt: new Date(),
      symbol: symbol
    };
    
    setAlerts(prev => [...prev, alert]);
    
    // Show success toast
    toast({
      title: "Alert Created",
      description: `Alert "${newAlert.name}" has been created successfully.`
    });
    
    // Reset new alert form
    setNewAlert({
      name: "",
      type: "price",
      condition: "above",
      value: 0,
      active: true,
      symbol: symbol,
      sound: true
    });
  };
  
  // Toggle alert active state
  const toggleAlertActive = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, active: !alert.active } : alert
      )
    );
  };
  
  // Delete an alert
  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    
    toast({
      title: "Alert Deleted",
      description: "Alert has been deleted successfully."
    });
  };
  
  // Dismiss triggered alert
  const dismissTriggeredAlert = () => {
    setTriggeredAlert(null);
  };
  
  // Get filtered alerts
  const getFilteredAlerts = () => {
    if (showActiveAlertsOnly) {
      return alerts.filter(alert => alert.active);
    }
    return alerts;
  };

  return (
    <div className="space-y-4">
      {/* Triggered Alert Notification */}
      {triggeredAlert && (
        <Alert variant="destructive" className="animate-pulse">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Alert Triggered</AlertTitle>
          <AlertDescription>
            {triggeredAlert.name}: {symbol} price {triggeredAlert.condition} {triggeredAlert.value}
          </AlertDescription>
          <Button 
            variant="link" 
            size="sm" 
            className="ml-auto" 
            onClick={dismissTriggeredAlert}
          >
            Dismiss
          </Button>
        </Alert>
      )}
      
      {/* Alert Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Price Alerts
        </h3>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
              <DialogDescription>
                Set up an alert to notify you when specific market conditions are met.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="alert-name">Alert Name</Label>
                <Input 
                  id="alert-name" 
                  placeholder="e.g., BTC above 50,000" 
                  value={newAlert.name}
                  onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alert-type">Alert Type</Label>
                  <Select 
                    value={newAlert.type}
                    onValueChange={(value) => setNewAlert({ ...newAlert, type: value as AlertType })}
                  >
                    <SelectTrigger id="alert-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="indicator">Indicator</SelectItem>
                      <SelectItem value="volume">Volume</SelectItem>
                      <SelectItem value="pattern">Pattern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alert-condition">Condition</Label>
                  <Select 
                    value={newAlert.condition}
                    onValueChange={(value) => setNewAlert({ ...newAlert, condition: value as AlertCondition })}
                  >
                    <SelectTrigger id="alert-condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Above</SelectItem>
                      <SelectItem value="below">Below</SelectItem>
                      <SelectItem value="crosses">Crosses</SelectItem>
                      <SelectItem value="crosses-up">Crosses Up</SelectItem>
                      <SelectItem value="crosses-down">Crosses Down</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alert-value">Value</Label>
                <Input 
                  id="alert-value" 
                  type="number" 
                  placeholder="e.g., 50000" 
                  value={newAlert.value.toString()}
                  onChange={(e) => setNewAlert({ ...newAlert, value: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              {newAlert.type === "indicator" && (
                <div className="space-y-2">
                  <Label htmlFor="indicator-type">Indicator</Label>
                  <Select 
                    value={newAlert.indicatorParams?.indicator || "rsi"}
                    onValueChange={(value) => setNewAlert({ 
                      ...newAlert, 
                      indicatorParams: { 
                        ...newAlert.indicatorParams,
                        indicator: value 
                      } 
                    })}
                  >
                    <SelectTrigger id="indicator-type">
                      <SelectValue placeholder="Select indicator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rsi">RSI</SelectItem>
                      <SelectItem value="macd">MACD</SelectItem>
                      <SelectItem value="sma">SMA</SelectItem>
                      <SelectItem value="ema">EMA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="alert-sound"
                  checked={newAlert.sound}
                  onCheckedChange={(checked) => setNewAlert({ ...newAlert, sound: checked })}
                />
                <Label htmlFor="alert-sound">Play sound when triggered</Label>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateAlert}>Create Alert</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Alerts Filter */}
      <div className="flex items-center space-x-2">
        <Switch 
          id="active-alerts-only"
          checked={showActiveAlertsOnly}
          onCheckedChange={setShowActiveAlertsOnly}
        />
        <Label htmlFor="active-alerts-only">Show active alerts only</Label>
      </div>
      
      {/* Alerts List */}
      <div className="space-y-2">
        {getFilteredAlerts().length === 0 ? (
          <div className="text-center py-6 border border-dashed border-border rounded-md">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">No alerts set up yet</p>
            <p className="text-xs text-muted-foreground/70">
              Create alerts to get notified when market conditions change
            </p>
          </div>
        ) : (
          getFilteredAlerts().map(alert => (
            <div 
              key={alert.id} 
              className={`flex items-center justify-between p-3 rounded-md border ${
                alert.triggered 
                  ? 'border-red-500 bg-red-500/10' 
                  : alert.active 
                    ? 'border-border bg-secondary/5'
                    : 'border-border bg-secondary/5 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="font-medium flex items-center">
                    {alert.name}
                    {alert.sound && <Volume2 className="h-3 w-3 ml-1 text-muted-foreground" />}
                    {alert.triggered && <BellRing className="h-3 w-3 ml-1 text-red-500 animate-ping" />}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {alert.type === "price" ? "Price" : alert.type} {alert.condition} {alert.value}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch 
                  checked={alert.active}
                  onCheckedChange={() => toggleAlertActive(alert.id)}
                  size="sm"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => deleteAlert(alert.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
