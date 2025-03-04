
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from '@/lib/supabase'
import { useToast } from "@/hooks/use-toast"
import { validateAuthForm } from './utils/form-validation'

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm = ({ onToggleMode }: LoginFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validateAuthForm(email, password)
    if (!validation.valid) {
      setFormError(validation.message || "Invalid form data")
      return
    }
    
    setIsLoading(true)
    try {
      console.log('Attempting login with email:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      console.log('Login successful:', data)
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      })
    } catch (error: any) {
      console.error('Login error:', error)
      setFormError(error.message || "Check your email and password")
      toast({
        title: "Login Failed",
        description: error.message || "Check your email and password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {formError && (
        <Alert variant="destructive" className="my-4">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setFormError(null)
          }}
          disabled={isLoading}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setFormError(null)
          }}
          disabled={isLoading}
          required
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Login
            </>
          )}
        </Button>
      </form>

      <Button
        variant="ghost"
        className="w-full"
        onClick={onToggleMode}
        disabled={isLoading}
      >
        No account? Register here
      </Button>
    </>
  )
}
