
import { useState, useEffect, useCallback } from 'react';
import { Message } from '../../types/chatTypes';
import { toast } from '@/hooks/use-toast';

export function useClaudeMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  
  // Load saved messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('claudeChatMessages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed)) {
          setMessages(parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        } else {
          console.error('Saved Claude messages is not an array:', parsed);
          localStorage.removeItem('claudeChatMessages');
        }
      } catch (e) {
        console.error('Error parsing saved Claude messages:', e);
        // If parsing fails, clear the corrupted messages
        localStorage.removeItem('claudeChatMessages');
      }
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('claudeChatMessages', JSON.stringify(messages));
      } catch (e) {
        console.error('Error saving Claude messages:', e);
      }
    }
  }, [messages]);

  // Generate a unique ID for messages
  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('claudeChatMessages');
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
      duration: 3000,
    });
  }, []);

  return { 
    messages, 
    setMessages, 
    inputMessage, 
    setInputMessage, 
    generateId, 
    clearChat 
  };
}
