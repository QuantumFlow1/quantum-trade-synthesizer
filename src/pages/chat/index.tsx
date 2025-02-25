
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
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">Grok AI Assistent</h1>
      <GrokChat />
    </div>
  )
}
