
const SystemAlerts = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Systeem Alerts</h3>
      <div className="space-y-2">
        <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400 text-sm">
          Hoge trading volume op BTC/USD
        </div>
        <div className="p-3 rounded-lg bg-green-500/10 text-green-400 text-sm">
          Alle systemen operationeel
        </div>
      </div>
    </div>
  );
};

export default SystemAlerts;
