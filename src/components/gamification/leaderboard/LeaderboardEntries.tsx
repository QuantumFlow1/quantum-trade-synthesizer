
import React from 'react';
import { Trophy, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LeaderboardEntry } from '@/types/gamification';

interface LeaderboardEntriesProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export const LeaderboardEntries: React.FC<LeaderboardEntriesProps> = ({
  entries,
  currentUserId
}) => {
  return (
    <div className="max-h-[320px] overflow-y-auto">
      {entries.slice(0, 10).map((entry, index) => (
        <div 
          key={entry.userId} 
          className={`flex items-center p-3 border-b border-secondary/20 ${
            entry.userId === currentUserId ? 'bg-primary/10' : ''
          }`}
        >
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary/30 text-sm font-bold">
            {index + 1}
          </div>
          <div className="ml-3 flex-1">
            <p className="font-medium">{entry.username}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Trophy className="h-3 w-3 mr-1 text-yellow-500" />
              <span>{entry.totalPoints} pts</span>
              <Award className="h-3 w-3 mx-1 text-purple-500" />
              <span>{entry.badgeCount} badges</span>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="bg-primary/20 text-primary">
              Level {entry.level}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};
