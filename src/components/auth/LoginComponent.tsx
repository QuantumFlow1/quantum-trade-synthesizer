
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Shield, ShieldAlert } from "lucide-react"
import { useAuth } from './AuthProvider'
import { useToast } from "@/hooks/use-toast"
import { supabase } from '@/lib/supabase'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const LoginComponent = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'viewer' | 'trader' | 'admin' | 'super_admin'>('viewer')
  const [language, setLanguage] = useState<'nl' | 'en' | 'ru' | 'hy'>('nl')
  const { signIn } = useAuth()
  const { toast } = useToast()

  const getLanguageLabel = (code: string) => {
    const labels: Record<string, string> = {
      nl: 'Nederlands',
      en: 'English',
      ru: 'Русский',
      hy: 'Հայերեն'
    }
    return labels[code] || code
  }

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
        // Update het profiel met de geselecteerde taal
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ preferred_language: language })
          .eq('id', authData.user.id)

        if (updateError) throw updateError

        // Voeg de gebruikersrol toe
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
          
          {isRegistering && (
            <>
              <Select
                value={selectedRole}
                onValueChange={(value: 'viewer' | 'trader' | 'admin' | 'super_admin') => setSelectedRole(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecteer een rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Viewer
                    </div>
                  </SelectItem>
                  <SelectItem value="trader">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Trader
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="super_admin">
                    <div className="flex items-center">
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      Super Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={language}
                onValueChange={(value: 'nl' | 'en' | 'ru' | 'hy') => setLanguage(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecteer een taal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nl">{getLanguageLabel('nl')}</SelectItem>
                  <SelectItem value="en">{getLanguageLabel('en')}</SelectItem>
                  <SelectItem value="ru">{getLanguageLabel('ru')}</SelectItem>
                  <SelectItem value="hy">{getLanguageLabel('hy')}</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

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
