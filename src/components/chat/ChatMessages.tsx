
import React, { useRef, useEffect } from 'react';
import { EmptyChat } from './components/EmptyChat';
import { MessageContent } from './components/MessageContent';
import { MessageEditor } from './components/MessageEditor';
import { MessageActions } from './components/MessageActions';
import { useChatMessages } from './hooks/useChatMessages';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isFavorite?: boolean;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  onFavorite?: (messageId: string, isFavorite: boolean) => void;
}

export function ChatMessages({ 
  messages, 
  onEdit, 
  onDelete,
  onFavorite 
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
  } = useChatMessages(messages, onEdit, onDelete, onFavorite);

  // Scroll to bottom when messages change
  useEffect(() => {
    console.log("ChatMessages component received messages:", messages);
    
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Make sure we're handling empty/undefined messages array properly
  if (!messages || messages.length === 0) {
    return <EmptyChat />;
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        if (!message || !message.id) {
          console.error("Invalid message object:", message);
          return null;
        }
        
        // Make sure timestamp is a Date object
        const timestamp = message.timestamp instanceof Date 
          ? message.timestamp 
          : new Date(message.timestamp);
          
        console.log(`Rendering message: ${message.id}, role: ${message.role}, content length:`, message.content?.length);
        
        // Check if this message is a favorite
        const isFavorite = favorites[message.id] || false;
        
        return (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4 chat-message staggered-item`}
            data-message-id={message.id}
            data-message-role={message.role}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div 
              className={`rounded-lg px-5 py-3 max-w-[85%] flex flex-col ${
                message.role === 'user' 
                  ? 'bg-indigo-600 text-white border-0 hover-lift' 
                  : 'bg-secondary border-0 shadow-sm hover-lift'
              }`}
            >
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
                    timestamp={timestamp}
                  />
                  
                  <MessageActions
                    messageId={message.id}
                    isFavorite={isFavorite}
                    role={message.role}
                    onToggleFavorite={handleToggleFavorite}
                    onStartEdit={() => handleStartEdit(message)}
                    onDelete={handleDelete}
                  />
                </>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
