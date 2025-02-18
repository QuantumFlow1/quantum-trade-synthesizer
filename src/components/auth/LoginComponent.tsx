
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Mail, Chrome } from "lucide-react"
import { useAuth } from './AuthProvider'
import { useToast } from "@/hooks/use-toast"
import { supabase } from '@/lib/supabase'

export const LoginComponent = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const { signIn } = useAuth()
  const { toast } = useToast()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signIn.email(email, password)
      toast({
        title: "Succesvol ingelogd",
        description: "Welkom terug!",
      })
    } catch (error: any) {
      console.error('Login error:', error)
      toast({
        title: "Login mislukt",
        description: error.message || "Controleer uw email en wachtwoord",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin',
          }
        }
      })
      if (error) throw error
      
      toast({
        title: "Registratie succesvol",
        description: "Je kunt nu inloggen met je account",
      })
      setIsRegistering(false)
    } catch (error: any) {
      console.error('Signup error:', error)
      toast({
        title: "Registratie mislukt",
        description: error.message || "Probeer het opnieuw",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    try {
      console.log("Starting GitHub login...")
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin,
          scopes: 'read:user user:email'
        }
      })
      if (error) {
        console.error("GitHub login error:", error)
        throw error
      }
    } catch (error: any) {
      console.error("GitHub login failed:", error)
      toast({
        title: "GitHub login mislukt",
        description: error.message || "Probeer het later opnieuw",
        variant: "destructive",
      })
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signIn.google()
      if (error) throw error
    } catch (error: any) {
      console.error('Google login error:', error)
      toast({
        title: "Google login mislukt",
        description: error.message || "Probeer het later opnieuw",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg border">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">{isRegistering ? 'Registreren' : 'Login'}</h1>
          <p className="text-muted-foreground">
            {isRegistering ? 'Maak een nieuw account aan' : 'Kies een login methode'}
          </p>
        </div>
        
        <div className="grid gap-6">
          <form onSubmit={isRegistering ? handleSignUp : handleEmailLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Wachtwoord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Mail className="mr-2 h-4 w-4" />
              {isLoading 
                ? "Even geduld..." 
                : (isRegistering ? "Registreren" : "Login met Email")}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Of
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            <Button variant="outline" onClick={handleGoogleLogin} className="w-full">
              <Chrome className="mr-2 h-4 w-4" />
              Login met Google
            </Button>

            <Button variant="outline" onClick={handleGithubLogin} className="w-full">
              <Github className="mr-2 h-4 w-4" />
              Login met GitHub
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering 
              ? "Al een account? Login hier" 
              : "Nog geen account? Registreer hier"}
          </Button>
        </div>
      </div>
    </div>
  )
}
