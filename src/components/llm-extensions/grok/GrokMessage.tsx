import { User, Zap } from 'lucide-react';
import { Message } from '../deepseek/types';

interface GrokMessageProps {
  message: Message;
}

export function GrokMessage({ message }: GrokMessageProps) {
  // Make sure timestamp is a Date object
  const timestamp = message.timestamp instanceof Date 
    ? message.timestamp 
    : new Date(message.timestamp);
  
  // Add debugging information (keep these for when the feature is restored)
  console.log(`Rendering disabled GrokMessage:`, message);
  
  return (
    <div className="flex items-center justify-center p-4 text-gray-400 border rounded-lg">
      <Zap className="w-5 h-5 mr-2" />
      <span>Chat functionality temporarily disabled</span>
    </div>
  );
}
