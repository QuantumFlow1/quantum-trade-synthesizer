
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ContentGenerationSectionProps } from './types';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

const ContentGenerationSection: React.FC<ContentGenerationSectionProps> = ({
  inputMessage,
  setInputMessage,
  messages,
  selectedModelName
}) => {
  return (
    <div className="flex-1 p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-4">Content Generation</h2>
      <Textarea
        className="w-full flex-grow mb-4 min-h-[100px]"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Enter your prompt here..."
      />
      <div className="flex justify-end mb-4">
        <Button className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          <span>Send</span>
        </Button>
      </div>
      <div className="p-4 border rounded-md bg-gray-50 min-h-[200px] max-h-[400px] overflow-y-auto">
        {messages.length > 0 ? (
          <div>
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-blue-600' : 'text-gray-800'}`}>
                <strong>{message.role === 'user' ? 'You: ' : `${selectedModelName}: `}</strong>
                <span>{message.content}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Results will be displayed here...</p>
        )}
      </div>
    </div>
  );
};

export default ContentGenerationSection;
