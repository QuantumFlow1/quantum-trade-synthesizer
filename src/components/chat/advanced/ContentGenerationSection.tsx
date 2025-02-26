
import React from 'react';
import { ContentGenerationSectionProps } from './types';
import { getModelDisplayName } from './utils';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ContentGenerationSection: React.FC<ContentGenerationSectionProps> = ({
  inputMessage,
  setInputMessage,
  messages,
  selectedModelName,
  onSendMessage,
  isGenerating = false
}) => {
  // Get the display name for the selected model
  const modelDisplayName = getModelDisplayName(selectedModelName);

  return (
    <div className="flex-1 p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-4">Content Generation</h2>
      
      {/* Messages display area */}
      <MessageList 
        messages={messages} 
        selectedModelName={selectedModelName} 
      />
      
      {/* Input area */}
      <MessageInput 
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        onSendMessage={onSendMessage}
        isGenerating={isGenerating}
        modelDisplayName={modelDisplayName}
      />
    </div>
  );
};

export default ContentGenerationSection;
