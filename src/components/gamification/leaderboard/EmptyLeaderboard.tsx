
import React from 'react';
import { Trophy } from 'lucide-react';

export const EmptyLeaderboard: React.FC = () => {
  return (
    <div className="p-6 text-center text-muted-foreground">
      <div className="flex justify-center mb-3">
        <Trophy className="h-12 w-12 text-muted-foreground opacity-30" />
      </div>
      <p>No leaderboard data available yet</p>
      <p className="text-sm mt-2">Complete learning modules and trades to appear on the leaderboard!</p>
    </div>
  );
};
