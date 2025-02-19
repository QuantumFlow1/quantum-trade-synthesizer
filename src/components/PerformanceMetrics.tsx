
import { motion } from "framer-motion";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

const metrics = [
  { label: "Totale Winst", value: "$12,345.67", change: "+15.4%", icon: TrendingUp },
  { label: "Win Rate", value: "68%", change: "+2.3%", icon: Activity },
  { label: "Gem. Trade", value: "$234.12", change: "+5.7%", icon: TrendingUp },
  { label: "Dagelijks Volume", value: "$1.2M", change: "+8.9%", icon: Activity },
  { label: "Open Posities", value: "12", change: "-2", icon: TrendingDown },
  { label: "ROI", value: "24.5%", change: "+3.2%", icon: TrendingUp }
];

const PerformanceMetrics = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            Performance Metrics
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Updates
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const isPositive = metric.change.startsWith("+");
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden group"
              >
                <div className="p-4 rounded-lg backdrop-blur-xl bg-secondary/20 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{metric.label}</span>
                      <Icon className={`w-4 h-4 ${isPositive ? "text-green-500" : "text-red-500"}`} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-2xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                        {metric.value}
                      </div>
                      <div className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
                        {metric.change}
                      </div>
                    </div>
                    
                    {/* Progress indicator */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary/50 to-secondary/50"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default PerformanceMetrics;
