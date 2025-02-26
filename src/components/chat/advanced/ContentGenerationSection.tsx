
import React, { useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ContentGenerationSectionProps } from './types';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { getModelDisplayName } from './utils';

const ContentGenerationSection: React.FC<ContentGenerationSectionProps> = ({
  inputMessage,
  setInputMessage,
  messages,
  selectedModelName,
  onSendMessage,
  isGenerating = false
}) => {
  // Create a ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage();
    }
  };

  // Handle keyboard shortcut (Ctrl+Enter) to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && inputMessage.trim()) {
      e.preventDefault();
      onSendMessage();
    }
  };

  // Get the display name for the selected model
  const modelDisplayName = getModelDisplayName(selectedModelName);

  return (
    <div className="flex-1 p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-4">Content Generation</h2>
      
      {/* Messages display area */}
      <div className="p-4 border rounded-md bg-gray-50 mb-4 h-[300px] overflow-y-auto flex flex-col">
        {messages.length > 0 ? (
          <div className="space-y-4 w-full">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg max-w-[85%] ${
                  message.role === 'user' 
                    ? 'bg-blue-100 text-blue-900 ml-auto' 
                    : 'bg-white border border-gray-200 mr-auto'
                }`}
              >
                <div className="flex items-center mb-1">
                  <span className="font-semibold text-xs">
                    {message.role === 'user' ? 'You' : modelDisplayName}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 italic text-center">Send a message to start the conversation...</p>
          </div>
        )}
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <Textarea
          className="w-full min-h-[120px] mb-2 resize-none"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask ${modelDisplayName} anything...`}
          disabled={isGenerating}
        />
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Press Ctrl+Enter to send</span>
          <Button 
            type="submit" 
            className="flex items-center gap-2"
            disabled={!inputMessage.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContentGenerationSection;
