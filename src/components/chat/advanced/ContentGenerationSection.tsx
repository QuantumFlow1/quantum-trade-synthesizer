
import React from 'react';
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
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage();
    }
  };

  // Get the display name for the selected model
  const modelDisplayName = getModelDisplayName(selectedModelName);

  return (
    <div className="flex-1 p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-4">Content Generation</h2>
      <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
        <Textarea
          className="w-full flex-grow mb-4 min-h-[100px]"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Enter your prompt here..."
          disabled={isGenerating}
        />
        <div className="flex justify-end mb-4">
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
      <div className="p-4 border rounded-md bg-gray-50 min-h-[200px] max-h-[400px] overflow-y-auto">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-100 ml-auto mr-0 max-w-[80%]' 
                    : 'bg-gray-100 ml-0 mr-auto max-w-[80%]'
                }`}
              >
                <p className="font-semibold text-sm">
                  {message.role === 'user' ? 'You' : modelDisplayName}
                </p>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-center">Results will be displayed here...</p>
        )}
      </div>
    </div>
  );
};

export default ContentGenerationSection;
