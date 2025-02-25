
import { GrokChat } from "@/components/chat/GrokChat"
import { useAuth } from "@/components/auth/AuthProvider"
import { Navigate } from "react-router-dom"

export default function ChatPage() {
  const { user } = useAuth()
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/" replace />
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Grok AI Chat</h1>
      <GrokChat />
    </div>
  )
}
