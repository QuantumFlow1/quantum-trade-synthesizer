
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
  
  // Validate messages to ensure they're in the correct format
  const validatedMessages = messages.map(msg => ({
    role: msg.role || 'user',
    content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content) || ''
  }));
  
  console.log("ContentGenerationSection rendering with validated messages:", validatedMessages);

  return (
    <div className="flex-1 p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-4">Content Generation</h2>
      
      {/* Debug info */}
      <div className="text-xs text-gray-500 mb-2">
        Messages in state: {validatedMessages.length}
      </div>
      
      {/* Messages display area */}
      <MessageList 
        messages={validatedMessages} 
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
