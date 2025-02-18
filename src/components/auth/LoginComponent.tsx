
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg border">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">{isRegistering ? 'Registreren' : 'Login'}</h1>
          <p className="text-muted-foreground">
            {isRegistering ? 'Maak een nieuw account aan' : 'Log in met je email'}
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
              : (isRegistering ? "Registreren" : "Login")}
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
      </div>
    </div>
  )
}
