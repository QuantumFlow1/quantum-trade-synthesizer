
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useAuth } from './AuthProvider'
import { useToast } from "@/hooks/use-toast"
import { supabase } from '@/lib/supabase'
import { PreferredLanguage, UserRole } from '@/types/auth'
import { AuthForm } from './AuthForm'

export const LoginComponent = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>('viewer')
  const [language, setLanguage] = useState<PreferredLanguage>('nl')
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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (authError) throw authError

      if (authData.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ preferred_language: language })
          .eq('id', authData.user.id)

        if (updateError) throw updateError

        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: selectedRole
          })

        if (roleError) throw roleError
      }
      
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
        
        <AuthForm
          isRegistering={isRegistering}
          isLoading={isLoading}
          onSubmit={isRegistering ? handleSignUp : handleEmailLogin}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          language={language}
          setLanguage={setLanguage}
        />

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
