
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const alerts = [
  {
    id: 1,
    type: "price",
    asset: "BTC/USD",
    message: "Prijs boven $45,000",
    time: "5 min geleden",
    status: "new",
  },
  {
    id: 2,
    type: "volume",
    asset: "ETH/USD",
    message: "Ongewoon hoog volume",
    time: "15 min geleden",
    status: "read",
  },
  {
    id: 3,
    type: "risk",
    asset: "Portfolio",
    message: "Margin gebruik > 75%",
    time: "1 uur geleden",
    status: "new",
  },
];

const Alerts = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Market Alerts</h2>
        </div>
        <Button variant="outline" size="sm">
          Configureer Alerts
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-center justify-between p-4 rounded-lg ${
              alert.status === "new"
                ? "bg-primary/10 border border-primary/20"
                : "bg-secondary/50"
            }`}
          >
            <div className="space-y-1">
              <div className="font-medium">{alert.asset}</div>
              <div className="text-sm text-muted-foreground">{alert.message}</div>
              <div className="text-xs text-muted-foreground">{alert.time}</div>
            </div>
            {alert.status === "new" && (
              <Button variant="ghost" size="sm">
                <Check className="w-4 h-4 mr-1" />
                Markeer als gelezen
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
