import { generatePageMetadata } from '@/lib/metadata';
import { ChatContent } from '@/components/chat/chat-content';

export const metadata = generatePageMetadata({
  title: 'RAG + 3D Chat',
  description:
    'Upload documents, ask questions, get answers grounded in your data with Three.js visualization.',
  slug: 'rag-chat'
});

export default function ChatPage() {
  return <ChatContent />;
}
