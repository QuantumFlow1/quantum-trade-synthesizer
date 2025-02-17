
import React from "react";

const StatisticsPanel = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="p-4 rounded-lg bg-secondary/50">
        <div className="font-medium mb-1">Actieve Users</div>
        <div className="text-2xl font-bold">1,234</div>
      </div>
      <div className="p-4 rounded-lg bg-secondary/50">
        <div className="font-medium mb-1">Open Orders</div>
        <div className="text-2xl font-bold">567</div>
      </div>
      <div className="p-4 rounded-lg bg-secondary/50">
        <div className="font-medium mb-1">Dagelijks Volume</div>
        <div className="text-2xl font-bold">$2.5M</div>
      </div>
      <div className="p-4 rounded-lg bg-secondary/50">
        <div className="font-medium mb-1">Systeem Status</div>
        <div className="text-2xl font-bold text-green-400">Normaal</div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
