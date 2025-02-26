
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ChatMessage } from '../types/chat';

export function useChatMessages(messages: ChatMessage[], onEdit?: (messageId: string, newContent: string) => void, onDelete?: (messageId: string) => void, onFavorite?: (messageId: string, isFavorite: boolean) => void) {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('chatMessageFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : {};
  });

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

  return {
    editingMessageId,
    editingContent,
    setEditingContent,
    favorites,
    handleToggleFavorite,
    handleDelete,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit
  };
}
