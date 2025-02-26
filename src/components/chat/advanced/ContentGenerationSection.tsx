
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  role: string;
  content: string;
}

interface ContentGenerationSectionProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  messages: Message[];
  selectedModelName: string;
}

const ContentGenerationSection: React.FC<ContentGenerationSectionProps> = ({
  inputMessage,
  setInputMessage,
  messages,
  selectedModelName
}) => {
  return (
    <div className="flex-1 p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-4">Content Generatie</h2>
      <Textarea
        className="w-full flex-grow mb-4"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Voer uw prompt in..."
      />
      <div className="p-4 border rounded-md bg-gray-50 min-h-[200px] max-h-[400px] overflow-y-auto">
        {messages.length > 0 ? (
          <div>
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-blue-600' : 'text-gray-800'}`}>
                <strong>{message.role === 'user' ? 'Jij: ' : `${selectedModelName}: `}</strong>
                <span>{message.content}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Resultaten worden hier weergegeven...</p>
        )}
      </div>
    </div>
  );
};

export default ContentGenerationSection;
