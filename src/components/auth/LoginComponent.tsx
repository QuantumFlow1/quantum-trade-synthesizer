
import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

export const LoginComponent = () => {
  const [isRegistering, setIsRegistering] = useState(false)
  const { signIn } = useAuth()

  const toggleMode = () => {
    setIsRegistering(!isRegistering)
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
        
        {isRegistering ? (
          <RegisterForm onToggleMode={toggleMode} />
        ) : (
          <LoginForm onToggleMode={toggleMode} />
        )}
      </div>
    </div>
  )
}
