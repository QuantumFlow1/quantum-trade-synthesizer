
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from '@/lib/supabase'
import { useToast } from "@/hooks/use-toast"
import { validateAuthForm } from './utils/form-validation'
import { RoleSelector } from './RoleSelector'
import { UserRole } from '@/types/auth'

interface RegisterFormProps {
  onToggleMode: () => void;
}

export const RegisterForm = ({ onToggleMode }: RegisterFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>('viewer')
  const [formError, setFormError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validateAuthForm(email, password)
    if (!validation.valid) {
      setFormError(validation.message || "Invalid form data")
      return
    }
    
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
      onToggleMode() // Switch back to login mode
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
    <>
      {formError && (
        <Alert variant="destructive" className="my-4">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSignUp} className="space-y-4">
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
        
        <RoleSelector 
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          disabled={isLoading}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Register
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
        Already have an account? Login here
      </Button>
    </>
  )
}
