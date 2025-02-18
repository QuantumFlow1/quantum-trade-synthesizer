
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Mail } from "lucide-react"
import { useAuth } from './AuthProvider'
import { useToast } from "@/hooks/use-toast"
import { supabase } from '@/lib/supabase'

export const LoginComponent = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const { signIn, signOut, userProfile } = useAuth()
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
            role: 'admin', // Alle nieuwe gebruikers krijgen admin rol
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

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-card rounded-lg shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">{isRegistering ? 'Registreren' : 'Login'}</h1>
        <p className="text-muted-foreground">
          {isRegistering ? 'Maak een nieuw account aan' : 'Kies een login methode'}
        </p>
      </div>
      
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

      <Button
        variant="ghost"
        className="w-full"
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering 
          ? "Al een account? Login hier" 
          : "Nog geen account? Registreer hier"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Of ga verder met
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" disabled className="opacity-50">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>
        <Button variant="outline" disabled className="opacity-50">
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
    </div>
  )
}
