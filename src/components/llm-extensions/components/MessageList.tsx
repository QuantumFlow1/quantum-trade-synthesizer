
import React, { useRef, useEffect } from 'react';
import { Message } from '../types/chatTypes';
import { MessageItem } from './MessageItem';
import { ChatEmpty } from './ChatEmpty';
import { ChatSettings } from './ChatSettings';

interface MessageListProps {
  messages: Message[];
  showSettings: boolean;
  apiKey: string;
  setApiKey: (key: string) => void;
  saveApiKey: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  showSettings,
  apiKey,
  setApiKey,
  saveApiKey
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (showSettings) {
    return (
      <ChatSettings 
        apiKey={apiKey}
        setApiKey={setApiKey}
        saveApiKey={saveApiKey}
      />
    );
  }

  if (messages.length === 0) {
    return <ChatEmpty />;
  }

  return (
    <>
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </>
  );
};
