
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Shield, ShieldAlert, Loader2 } from "lucide-react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"

export const LoginComponent = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'viewer' | 'trader' | 'admin' | 'super_admin' | 'lov_trader'>('viewer')
  const [formError, setFormError] = useState<string | null>(null)
  const { signIn } = useAuth()
  const { toast } = useToast()

  const validateForm = () => {
    if (!email || !email.includes('@')) {
      setFormError('Please enter a valid email address')
      return false
    }
    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters')
      return false
    }
    setFormError(null)
    return true
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsLoading(true)
    try {
      console.log('Attempting to register with email:', email)
      console.log('Selected role:', selectedRole)
      
      // First create the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (authError) throw authError
      console.log('User created:', authData)

      if (authData.user) {
        // Add entry to profiles table with role
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            role: selectedRole,
            status: 'active'
          })
          .eq('id', authData.user.id)
          
        if (profileError) {
          console.error('Error setting user profile role:', profileError)
          throw profileError
        }
        
        console.log('User role added to profile:', selectedRole)
      }
      
      toast({
        title: "Registration Successful",
        description: "You can now login with your account",
      })
      setIsRegistering(false)
    } catch (error: any) {
      console.error('Signup error:', error)
      setFormError(error.message || "Registration failed")
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md space-y-6 p-8 bg-card rounded-lg shadow-lg border">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">{isRegistering ? 'Register' : 'Login'}</h1>
          <p className="text-muted-foreground">
            {isRegistering ? 'Create a new account' : 'Log in with your email'}
          </p>
        </div>
        
        {formError && (
          <Alert variant="destructive" className="my-4">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={isRegistering ? handleSignUp : handleEmailLogin} className="space-y-4">
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
          
          {isRegistering && (
            <Select
              value={selectedRole}
              onValueChange={(value: 'viewer' | 'trader' | 'admin' | 'super_admin' | 'lov_trader') => setSelectedRole(value)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
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
                <SelectItem value="lov_trader">
                  <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Lov Trader
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isRegistering ? "Registering..." : "Logging in..."}
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                {isRegistering ? "Register" : "Login"}
              </>
            )}
          </Button>
        </form>

        <Button
          variant="ghost"
          className="w-full"
          onClick={() => {
            setIsRegistering(!isRegistering)
            setFormError(null)
          }}
          disabled={isLoading}
        >
          {isRegistering 
            ? "Already have an account? Login here" 
            : "No account? Register here"}
        </Button>
      </div>
    </div>
  )
}
