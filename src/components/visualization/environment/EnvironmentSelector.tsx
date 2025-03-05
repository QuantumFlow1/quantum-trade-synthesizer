
import React from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export const EnvironmentSelector = () => {
  const { environments, selectedEnvironment, setSelectedEnvironment } = useEnvironment();
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-sm border-white/10 text-white">
          <Settings className="h-4 w-4 mr-2" />
          <span>Environment</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-black/80 backdrop-blur-xl border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Select Virtual Environment</DialogTitle>
          <DialogDescription>
            Choose the environment where you want to interact with AI trading agents
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
          {environments.map((env) => {
            const Icon = env.thumbnailIcon;
            return (
              <Button
                key={env.id}
                variant={selectedEnvironment === env.id ? "default" : "outline"}
                className={`h-auto py-6 flex flex-col items-center justify-center gap-2 ${
                  selectedEnvironment === env.id 
                    ? "bg-primary/20 border-primary/50" 
                    : "bg-black/50 border-white/10 hover:bg-black/70"
                }`}
                onClick={() => {
                  setSelectedEnvironment(env.id);
                  setOpen(false);
                }}
              >
                <Icon className="h-10 w-10 mb-2" />
                <div className="font-medium text-sm">{env.name}</div>
                <p className="text-xs text-white/70 text-center">{env.description}</p>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
