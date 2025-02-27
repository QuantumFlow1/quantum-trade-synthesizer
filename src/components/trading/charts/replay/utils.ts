
import { toast } from "@/hooks/use-toast";

export const handleRewind = (progress: number, onProgressChange: (progress: number) => void) => {
  const newProgress = Math.max(0, progress - 10);
  onProgressChange(newProgress);
  
  toast({
    title: "Rewinding",
    description: "Moved back 10% in the timeline",
    duration: 1500,
  });
};

export const handleFastForward = (progress: number, onProgressChange: (progress: number) => void) => {
  const newProgress = Math.min(100, progress + 10);
  onProgressChange(newProgress);
  
  toast({
    title: "Fast Forwarding",
    description: "Moved forward 10% in the timeline",
    duration: 1500,
  });
};
