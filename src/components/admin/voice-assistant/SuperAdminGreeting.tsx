
import { FC } from 'react'

type SuperAdminGreetingProps = {
  userName?: string
}

export const SuperAdminGreeting: FC<SuperAdminGreetingProps> = ({ userName }) => {
  const greeting = userName 
    ? `Welcome, ${userName}!` 
    : 'Welcome to the Super Admin Voice Assistant'
  
  return (
    <div className="mb-4 text-center text-sm text-muted-foreground">
      {greeting} This interface allows you to interact with and test the EdriziAI voice assistant.
    </div>
  )
}
