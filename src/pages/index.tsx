import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/AuthProvider"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { LLMExtensions } from "@/components/llm-extensions/LLMExtensions"

export default function Index() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      toast({
        title: "Welcome Back!",
        description: "You're now logged in.",
      })
    }
  }, [user, toast])

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to Your AI App</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Link to="/ollama-chat" className="block">
          <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all">
            <h2 className="text-xl font-semibold mb-2">Ollama Chat</h2>
            <p className="text-muted-foreground mb-4">
              Chat with your local Ollama LLMs (llama3, gemma3, etc.)
            </p>
            <Button>Open Ollama Chat</Button>
          </div>
        </Link>
        
        <Link to="/chat" className="block">
          <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all">
            <h2 className="text-xl font-semibold mb-2">AI Chat</h2>
            <p className="text-muted-foreground mb-4">
              Interact with Grok AI and other models for assistance.
            </p>
            <Button>Open AI Chat</Button>
          </div>
        </Link>

        <Link to="/dashboard" className="block">
          <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all">
            <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
            <p className="text-muted-foreground mb-4">
              Explore market data, analytics, and AI tools.
            </p>
            <Button>Go to Dashboard</Button>
          </div>
        </Link>

        {!user && (
          <Link to="/login" className="block">
            <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all">
              <h2 className="text-xl font-semibold mb-2">Login</h2>
              <p className="text-muted-foreground mb-4">
                Access your account and personalized settings.
              </p>
              <Button>Login</Button>
            </div>
          </Link>
        )}

        {!user && (
          <Link to="/register" className="block">
            <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all">
              <h2 className="text-xl font-semibold mb-2">Register</h2>
              <p className="text-muted-foreground mb-4">
                Create a new account to start using the app.
              </p>
              <Button>Register</Button>
            </div>
          </Link>
        )}

        {user && (
          <div className="block">
            <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all">
              <h2 className="text-xl font-semibold mb-2">Logout</h2>
              <p className="text-muted-foreground mb-4">
                Safely sign out of your account.
              </p>
              <Button onClick={() => navigate("/logout")}>Logout</Button>
            </div>
          </div>
        )}
      </div>

      {user && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-4">AI Extensions</h2>
          <LLMExtensions />
        </div>
      )}
    </div>
  )
}
