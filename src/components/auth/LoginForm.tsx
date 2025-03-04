
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
      
      // Check if user profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
        
      if (profileError) {
        console.error('Error fetching profile after login:', profileError)
        // If profile doesn't exist, create one with default role based on email
        const role = email === 'arturgabrielian4@gmail.com' ? 'super_admin' : 'admin'
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            email: email,
            role: role,
            status: 'active'
          }])
        
        if (insertError) {
          console.error('Error creating profile:', insertError)
        } else {
          console.log('Created profile for user with role:', role)
        }
      } else {
        console.log('User profile after login:', profileData)
      }
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      })
      
      // Force a page reload to ensure all auth states are updated
      window.location.href = '/'
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

  // Admin login shortcut for testing
  const handleAdminLogin = async () => {
    setEmail("admin@example.com")
    setPassword("admin123")
    
    // Wait for state to update, then submit
    setTimeout(() => {
      document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
    }, 100)
  }
  
  // Super admin login shortcut
  const handleSuperAdminLogin = async () => {
    setEmail("arturgabrielian4@gmail.com")
    setPassword("admin123")
    
    // Wait for state to update, then submit
    setTimeout(() => {
      document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
    }, 100)
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
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleAdminLogin}
          disabled={isLoading}
        >
          Quick Admin Login
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="w-full bg-amber-100 hover:bg-amber-200"
          onClick={handleSuperAdminLogin}
          disabled={isLoading}
        >
          Login as arturgabrielian4@gmail.com
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
