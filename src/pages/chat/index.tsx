
import React from 'react';
import { GrokChat } from '@/components/chat/GrokChat';

export default function ChatPage() {
  console.log('ChatPage rendering');
  return (
    <div className="container py-8 flex justify-center">
      <GrokChat />
    </div>
  );
}
