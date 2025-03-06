
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ModuleDifficultyBadgeProps {
  difficulty: string;
}

export const ModuleDifficultyBadge: React.FC<ModuleDifficultyBadgeProps> = ({ difficulty }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/10 text-red-500 border-red-500/30';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
    }
  };

  return (
    <Badge className={`${getDifficultyColor(difficulty)}`}>
      {difficulty}
    </Badge>
  );
};
