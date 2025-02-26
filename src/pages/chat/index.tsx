
import { GrokChat } from "@/components/chat/GrokChat"
import { useAuth } from "@/components/auth/AuthProvider"
import { Navigate } from "react-router-dom"
import { useGrokChat } from "@/components/chat/useGrokChat"

export default function ChatPage() {
  const { user } = useAuth()
  const { grokSettings } = useGrokChat()
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/" replace />
  }
  
  return (
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">
        {grokSettings.selectedModel === 'openai' ? 'GPT-4o' : 'Grok AI'} Assistent
      </h1>
      <GrokChat />
    </div>
  )
}

