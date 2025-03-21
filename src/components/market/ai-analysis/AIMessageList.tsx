
import React from 'react';
import { Card } from '@/components/ui/card';
import { Bot, User, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIMessageListProps {
  messages: Message[];
  isLoading: boolean;
  aiError: string | null;
}

export function AIMessageList({ messages, isLoading, aiError }: AIMessageListProps) {
  return (
    <div className="flex-1 overflow-auto mb-4 space-y-4 scrollbar">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`flex max-w-[85%] ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                message.role === 'user' 
                  ? 'bg-primary/20 ml-2 mr-0' 
                  : 'bg-secondary/20'
              }`}>
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-primary" />
              ) : (
                <Bot className="w-4 h-4 text-secondary" />
              )}
            </div>
            
            <Card
              className={`p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/20'
              }`}
            >
              <div className="prose dark:prose-invert max-w-none prose-sm">
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className="overflow-auto bg-black/20 dark:bg-white/10 rounded p-2 my-2">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, inline, ...props }) => (
                      inline 
                        ? <code className="bg-black/20 dark:bg-white/10 rounded px-1 py-0.5" {...props} />
                        : <code {...props} />
                    ),
                    table: ({ node, ...props }) => (
                      <div className="overflow-auto">
                        <table className="border-collapse border border-muted my-2" {...props} />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th className="border border-muted bg-muted/50 px-3 py-1" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="border border-muted px-3 py-1" {...props} />
                    ),
                    // Handle math expressions with better styling
                    em: ({ node, ...props }) => {
                      // Check if content contains mathematical notation
                      const content = props.children?.toString() || '';
                      if (content.includes('∑') || content.includes('θ') || 
                          content.includes('∈') || content.includes('→')) {
                        return <span className="font-mono bg-black/10 dark:bg-white/10 rounded px-1" {...props} />;
                      }
                      return <em {...props} />;
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </Card>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex max-w-[85%]">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary/20 mr-2">
              <Bot className="w-4 h-4 text-secondary animate-pulse" />
            </div>
            <Card className="p-3 bg-secondary/20">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </Card>
          </div>
        </div>
      )}
      
      {aiError && (
        <div className="flex justify-start">
          <div className="flex max-w-[85%]">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-destructive/20 mr-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </div>
            <Card className="p-3 bg-destructive/10 text-destructive">
              {aiError}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
