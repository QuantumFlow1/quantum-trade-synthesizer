
import React, { useRef, useEffect, useState } from 'react';
import { Bot, User, Star, StarOff, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

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
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('chatMessageFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : {};
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    console.log("ChatMessages component received messages:", messages);
    
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('chatMessageFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Handle toggling a message as favorite
  const handleToggleFavorite = (messageId: string) => {
    const newFavorites = { 
      ...favorites, 
      [messageId]: !favorites[messageId] 
    };
    setFavorites(newFavorites);
    
    // Call the onFavorite prop if provided
    if (onFavorite) {
      onFavorite(messageId, !favorites[messageId]);
    }

    toast({
      title: favorites[messageId] ? "Removed from favorites" : "Added to favorites",
      description: favorites[messageId] 
        ? "Message removed from your favorites" 
        : "Message added to your favorites",
      duration: 2000,
    });
  };

  // Handle deleting a message
  const handleDelete = (messageId: string) => {
    // Call the onDelete prop if provided
    if (onDelete) {
      onDelete(messageId);
    } else {
      // Default implementation using localStorage
      const savedMessages = localStorage.getItem('chatMessages');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        const updatedMessages = parsedMessages.filter((msg: ChatMessage) => msg.id !== messageId);
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        
        // Force a re-render by using a toast notification
        toast({
          title: "Message deleted",
          description: "The message has been removed",
          duration: 2000,
        });
      }
    }
  };

  // Start editing a message
  const handleStartEdit = (message: ChatMessage) => {
    setEditingMessageId(message.id);
    setEditingContent(message.content);
  };

  // Save edited message
  const handleSaveEdit = () => {
    if (editingMessageId && editingContent.trim()) {
      // Call the onEdit prop if provided
      if (onEdit) {
        onEdit(editingMessageId, editingContent);
      } else {
        // Default implementation using localStorage
        const savedMessages = localStorage.getItem('chatMessages');
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages);
          const updatedMessages = parsedMessages.map((msg: ChatMessage) => 
            msg.id === editingMessageId ? { ...msg, content: editingContent } : msg
          );
          localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
          
          // Force a re-render with a toast notification
          toast({
            title: "Message updated",
            description: "Your changes have been saved",
            duration: 2000,
          });
        }
      }
      
      // Reset editing state
      setEditingMessageId(null);
      setEditingContent('');
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  // Make sure we're handling empty/undefined messages array properly
  if (!messages || messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
        <Bot className="w-16 h-16 mb-6 opacity-20 animate-float" />
        <p className="text-lg fade-in">Begin een gesprek met AI.</p>
        <p className="text-sm mt-2 slide-up">Stel een vraag in het tekstvak hieronder.</p>
      </div>
    );
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
              <div className="flex items-start">
                <div className={`mr-3 mt-1 ${message.role === 'user' ? 'text-white' : 'text-indigo-600'}`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  {editingMessageId === message.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full p-2 bg-background border rounded-md text-foreground"
                        rows={4}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleCancelEdit}
                          className="text-xs"
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={handleSaveEdit}
                          className="text-xs"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-line">{message.content || "Error: Empty message content"}</p>
                  )}
                  <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {timestamp.toLocaleTimeString()} - {timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {/* Message actions */}
              {editingMessageId !== message.id && (
                <div className={`flex justify-end mt-2 space-x-1 ${
                  message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'
                }`}>
                  <button 
                    onClick={() => handleToggleFavorite(message.id)}
                    className="p-1 rounded-full hover:bg-opacity-10 hover:bg-white transition-colors"
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorite ? (
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </button>
                  <button 
                    onClick={() => handleStartEdit(message)}
                    className="p-1 rounded-full hover:bg-opacity-10 hover:bg-white transition-colors"
                    aria-label="Edit message"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(message.id)}
                    className="p-1 rounded-full hover:bg-opacity-10 hover:bg-white transition-colors"
                    aria-label="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
