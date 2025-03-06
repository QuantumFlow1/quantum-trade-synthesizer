
import React from 'react';
import { LearningModule, EnvironmentType } from '@/types/virtual-environment';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle2, Clock, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { ModuleDifficultyBadge } from './ModuleDifficultyBadge';

interface ModuleCardProps {
  module: LearningModule;
  environmentId: EnvironmentType;
  isExpanded: boolean;
  onExpand: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ 
  module, 
  environmentId, 
  isExpanded, 
  onExpand 
}) => {
  const { toast } = useToast();
  const { completeModule } = useEnvironment();
  
  const handleStartModule = () => {
    onExpand();
    // In a real implementation, this would navigate to the module content or open it
    toast({
      title: "Module Started",
      description: `You've started "${module.title}". Complete it to earn ${module.points} points!`,
    });
  };
  
  const handleComplete = () => {
    if (!module.completed) {
      completeModule(environmentId, module.id);
      toast({
        title: "Module Completed!",
        description: `You earned ${module.points} points for completing "${module.title}"`,
        duration: 5000,
      });
    }
  };

  return (
    <Card 
      className={`transition-all ${
        module.completed 
          ? 'border-green-500/30 bg-green-500/5' 
          : isExpanded 
            ? 'border-blue-500/30 bg-blue-500/5' 
            : 'border-gray-200 dark:border-gray-800'
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {module.title}
              {module.completed && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </CardTitle>
            <CardDescription>{module.description}</CardDescription>
          </div>
          <ModuleDifficultyBadge difficulty={module.difficulty} />
        </div>
      </CardHeader>
      
      {isExpanded && !module.completed && (
        <CardContent>
          <div className="p-4 rounded-md bg-secondary/20 border border-secondary/30">
            <h4 className="font-semibold mb-2">Module Content</h4>
            <p className="text-sm">
              In a complete implementation, this would be the actual learning content for this module.
              For now, this is a placeholder to demonstrate the UI flow.
            </p>
          </div>
        </CardContent>
      )}
      
      <CardFooter className="flex justify-between pt-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{module.estimatedTimeMinutes} min</span>
          <Star className="h-4 w-4 ml-3 mr-1 text-yellow-500" />
          <span>{module.points} points</span>
        </div>
        
        {module.completed ? (
          <Button variant="ghost" disabled className="text-green-500">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Completed
          </Button>
        ) : isExpanded ? (
          <Button onClick={handleComplete}>
            Mark as Completed
          </Button>
        ) : (
          <Button variant="outline" onClick={handleStartModule}>
            <BookOpen className="h-4 w-4 mr-2" />
            Start Module
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
