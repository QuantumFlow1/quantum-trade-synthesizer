
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import { useAuth } from './AuthProvider'
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const LoginComponent = () => {
  // Login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // Signup state
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSigningUp, setIsSigningUp] = useState(false)
  
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      await signIn.email(email, password)
      toast({
        title: "Successfully logged in",
        description: "Welcome back!",
      })
    } catch (error: any) {
      console.error('Login error:', error)
      let errorMessage = "Please check your email and password"
      
      if (error.message?.includes('credentials')) {
        errorMessage = "Invalid email or password. Please try again."
      } else if (error.message?.includes('verified')) {
        errorMessage = "Please verify your email address before logging in."
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!signupEmail || !signupPassword || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }
    
    if (signupPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      })
      return
    }

    if (signupPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }
    
    setIsSigningUp(true)
    try {
      await signUp(signupEmail, signupPassword)
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account",
      })
      // Clear signup form
      setSignupEmail('')
      setSignupPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      console.error('Signup error:', error)
      let errorMessage = "Please try again"
      
      if (error.message?.includes('email')) {
        errorMessage = "This email is already registered. Please try logging in instead."
      }
      
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSigningUp(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-card rounded-lg shadow-lg">
      <Tabs defaultValue="login" className="space-y-6">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Enter your credentials to login</p>
          </div>
          
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Mail className="mr-2 h-4 w-4" />
              {isLoading ? "Logging in..." : "Login with Email"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup" className="space-y-4">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-muted-foreground">Sign up for a new account</p>
          </div>
          
          <form onSubmit={handleSignUp} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isSigningUp}>
              <Mail className="mr-2 h-4 w-4" />
              {isSigningUp ? "Creating Account..." : "Sign Up with Email"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
