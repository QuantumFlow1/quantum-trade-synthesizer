
import { Bot, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ClaudeEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <Bot className="h-10 w-10 text-green-600" />
      </div>
      
      <h3 className="text-lg font-semibold mb-2">Welcome to Claude Chat</h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        Claude is an AI assistant created by Anthropic that excels at thoughtful, 
        accurate, and helpful conversations. Start a chat to see it in action.
      </p>
      
      <Alert variant="outline" className="max-w-md mt-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Getting Started</AlertTitle>
        <AlertDescription>
          You'll need a Claude API key to use this chat. 
          Click the Settings icon in the top-right to add your API key.
        </AlertDescription>
      </Alert>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>Example questions you can ask Claude:</p>
        <ul className="list-disc list-inside mt-2 text-left">
          <li>Explain quantum computing in simple terms</li>
          <li>Help me plan a vegetarian dinner menu</li>
          <li>What are some strategies for managing stress?</li>
          <li>Compare different approaches to learning a new language</li>
        </ul>
      </div>
    </div>
  );
}
