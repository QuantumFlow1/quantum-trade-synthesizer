
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { UserProfile } from '@/types/auth'
import { Shield, Wallet, Clock } from 'lucide-react'

const UserProfileComponent = () => {
  const { user } = useAuth()
  const { toast } = useToast()

  if (!user) {
    return null
  }

  const handleStatusUpdate = () => {
    toast({
      title: "Status Update",
      description: "Your profile has been updated successfully.",
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Gebruikersprofiel</h2>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Trader Account</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Account Status</label>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm">Active</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Trading Limit
              </div>
            </label>
            <p className="text-muted-foreground">$50,000 USD</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Laatste Login
              </div>
            </label>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleStatusUpdate}>
          Update Profiel
        </Button>
        <Button 
          variant="default"
          onClick={() => {
            toast({
              title: "Verificatie Aangevraagd",
              description: "We zullen je account zo snel mogelijk verifiëren.",
            })
          }}
        >
          Vraag Verificatie Aan
        </Button>
      </CardFooter>
    </Card>
  )
}

export default UserProfileComponent
