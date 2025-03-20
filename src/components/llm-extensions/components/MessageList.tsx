
import React from 'react';
import { Message } from '../types/chatTypes';
import { ChatSettings } from './ChatSettings';
import { ChatEmpty } from './ChatEmpty';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: Message[];
  showSettings: boolean;
  apiKey: string;
  setApiKey: (key: string) => void;
  saveApiKey: (key: string) => void;
}

export function MessageList({
  messages,
  showSettings,
  apiKey,
  setApiKey,
  saveApiKey
}: MessageListProps) {
  if (showSettings) {
    return (
      <ChatSettings
        type="openai"
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
    <div className="space-y-4 w-full">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
}
