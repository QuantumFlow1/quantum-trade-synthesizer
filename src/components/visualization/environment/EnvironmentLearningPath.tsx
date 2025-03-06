
import React, { useState } from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { LearningModule } from '@/types/virtual-environment';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle2, Clock, Star, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const EnvironmentLearningPath: React.FC = () => {
  const { selectedEnvironment, currentEnvironment, userProgress, completeModule } = useEnvironment();
  const { toast } = useToast();
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  
  const learningPath = userProgress.learningPaths[selectedEnvironment];
  
  if (!learningPath) {
    return <div>No learning path available for this environment</div>;
  }
  
  const handleComplete = (module: LearningModule) => {
    if (!module.completed) {
      completeModule(selectedEnvironment, module.id);
      toast({
        title: "Module Completed!",
        description: `You earned ${module.points} points for completing "${module.title}"`,
        duration: 5000,
      });
    }
  };
  
  const handleStartModule = (module: LearningModule) => {
    setExpandedModuleId(module.id);
    // In a real implementation, this would navigate to the module content or open it
    toast({
      title: "Module Started",
      description: `You've started "${module.title}". Complete it to earn ${module.points} points!`,
    });
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/10 text-red-500 border-red-500/30';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">{currentEnvironment.name} Learning Path</h2>
          <p className="text-sm text-muted-foreground">
            {learningPath.completedModules} of {learningPath.totalModules} modules completed
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="font-bold">{learningPath.earnedPoints}/{learningPath.totalPoints} Points</span>
        </div>
      </div>
      
      <Progress 
        value={(learningPath.completedModules / learningPath.totalModules) * 100} 
        className="h-2 mb-6"
      />
      
      <div className="grid gap-4">
        {learningPath.modules.map((module) => (
          <Card 
            key={module.id} 
            className={`transition-all ${
              module.completed 
                ? 'border-green-500/30 bg-green-500/5' 
                : expandedModuleId === module.id 
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
                <Badge className={`${getDifficultyColor(module.difficulty)}`}>
                  {module.difficulty}
                </Badge>
              </div>
            </CardHeader>
            
            {expandedModuleId === module.id && !module.completed && (
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
              ) : expandedModuleId === module.id ? (
                <Button onClick={() => handleComplete(module)}>
                  Mark as Completed
                </Button>
              ) : (
                <Button variant="outline" onClick={() => handleStartModule(module)}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start Module
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
