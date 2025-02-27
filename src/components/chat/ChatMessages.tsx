
import React from 'react';
import { ChatMessage } from './types/chat';
import { useChatMessages } from './hooks/useChatMessages';
import { MessageContent } from './components/MessageContent';
import { MessageActions } from './components/MessageActions';
import { MessageEditor } from './components/MessageEditor';
import { EmptyChat } from './components/EmptyChat';

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  console.log('ChatMessages component rendering with messages:', messages);
  
  const {
    editingMessageId,
    editingContent,
    setEditingContent,
    favorites,
    handleToggleFavorite,
    handleDelete,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit
  } = useChatMessages(messages);

  // Show empty state if no messages
  if (!messages || messages.length === 0) {
    console.log('No messages, showing empty state');
    return <EmptyChat />;
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div key={message.id} className="p-4 rounded-lg bg-background/50 backdrop-blur-sm">
          {editingMessageId === message.id ? (
            <MessageEditor
              editingContent={editingContent}
              setEditingContent={setEditingContent}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <>
              <MessageContent
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
              
              <MessageActions
                messageId={message.id}
                isFavorite={!!favorites[message.id]}
                role={message.role}
                onToggleFavorite={handleToggleFavorite}
                onStartEdit={() => handleStartEdit(message)}
                onDelete={handleDelete}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
