
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

interface AIMessageListProps {
  messages: Message[];
  isLoading: boolean;
  aiError: string | null;
}

export const AIMessageList = ({ messages, isLoading, aiError }: AIMessageListProps) => {
  return (
    <div className="flex-grow overflow-y-auto mb-3 space-y-3">
      {aiError && (
        <Alert variant="destructive" className="mb-3">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{aiError}</AlertDescription>
        </Alert>
      )}

      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[80%] p-3 rounded-lg chat-bubble ${
              message.role === 'user' 
                ? 'bg-primary text-primary-foreground user-message' 
                : 'bg-muted assistant-message'
            }`}
          >
            <p className="message-text whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] p-3 rounded-lg bg-muted">
            <Skeleton className="h-4 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      )}
    </div>
  );
};
