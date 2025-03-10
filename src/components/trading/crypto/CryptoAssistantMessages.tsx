
import { CryptoMessage } from './types';
import { Avatar } from '@/components/ui/avatar';
import { AlertTriangle, Bot, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import { CryptoChart } from './CryptoChart';

interface CryptoAssistantMessagesProps {
  messages: CryptoMessage[];
}

function extractToolCalls(content: string): { content: string, charts: any[] } {
  // Extract chart function calls using regex
  const regex = /<function=showCryptoChart(.*?)><\/function>/g;
  const charts: any[] = [];
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    try {
      const jsonStr = match[1];
      const chartParams = JSON.parse(jsonStr);
      charts.push(chartParams);
    } catch (error) {
      console.error('Error parsing chart parameters:', error);
    }
  }
  
  // Remove function calls from content
  const cleanContent = content.replace(regex, '');
  
  return { content: cleanContent, charts };
}

export function CryptoAssistantMessages({ messages }: CryptoAssistantMessagesProps) {
  if (messages.length === 0) {
    return <div className="text-center text-gray-500 mt-4">No messages yet</div>;
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        // Extract any tool calls from message content
        const { content, charts } = extractToolCalls(message.content);
        
        return (
          <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
            {message.role !== 'user' && (
              <Avatar className={`h-8 w-8 rounded-full ${message.role === 'error' ? 'bg-destructive' : 'bg-primary'}`}>
                {message.role === 'error' ? (
                  <AlertTriangle className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </Avatar>
            )}
            
            <div className={`flex flex-col max-w-[85%] ${message.role === 'user' ? 'items-end' : ''}`}>
              <div className={`rounded-lg px-3 py-2 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : message.role === 'error'
                  ? 'bg-destructive/10 text-destructive border border-destructive/20'
                  : message.role === 'system'
                  ? 'bg-muted/50 text-muted-foreground'
                  : 'bg-muted'
              }`}>
                <div className="prose dark:prose-invert max-w-none text-sm">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
                
                {/* Display crypto charts if present */}
                {charts.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {charts.map((chart, idx) => (
                      <CryptoChart 
                        key={`${message.id}-chart-${idx}`}
                        symbol={chart.symbol} 
                        timeframe={chart.timeframe || '1D'} 
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {message.model && (
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Badge variant="outline" className="text-[10px] h-4 px-1">
                    {message.model.split('-')[0]}
                  </Badge>
                  <span className="opacity-50">{new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
              )}
            </div>
            
            {message.role === 'user' && (
              <Avatar className="h-8 w-8 rounded-full bg-secondary">
                <User className="h-4 w-4" />
              </Avatar>
            )}
          </div>
        );
      })}
    </div>
  );
}
