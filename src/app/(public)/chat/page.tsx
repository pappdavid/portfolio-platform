import { Metadata } from 'next';
import { ChatContent } from '@/components/chat/chat-content';

export const metadata: Metadata = {
  title: 'RAG + 3D Chat',
  description:
    'Chat with your docs, render 3D outputs. Retrieval-augmented generation with visual context.'
};

export default function ChatPage() {
  return <ChatContent />;
}
