
import React from 'react';
import { StarOff, Edit, Trash2, Star } from 'lucide-react';

interface MessageActionsProps {
  messageId: string;
  isFavorite: boolean;
  role: 'user' | 'assistant';
  onToggleFavorite: (messageId: string) => void;
  onStartEdit: () => void;
  onDelete: (messageId: string) => void;
}

export function MessageActions({
  messageId,
  isFavorite,
  role,
  onToggleFavorite,
  onStartEdit,
  onDelete
}: MessageActionsProps) {
  return (
    <div className={`flex justify-end mt-2 space-x-1 ${
      role === 'user' ? 'text-indigo-200' : 'text-gray-400'
    }`}>
      <button 
        onClick={() => onToggleFavorite(messageId)}
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
        onClick={onStartEdit}
        className="p-1 rounded-full hover:bg-opacity-10 hover:bg-white transition-colors"
        aria-label="Edit message"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button 
        onClick={() => onDelete(messageId)}
        className="p-1 rounded-full hover:bg-opacity-10 hover:bg-white transition-colors"
        aria-label="Delete message"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
