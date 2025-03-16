
import React, { useRef, useEffect } from 'react';
import { OllamaMessage } from '../types/ollamaTypes';

export function useOllamaChatTab(messages: OllamaMessage[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return {
    messagesEndRef
  };
}
