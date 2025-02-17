
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/components/auth/AuthProvider"
import { useProfile } from "@/hooks/useProfile"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { UserProfile } from "@/types/auth"

const Admin = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile } = useProfile()
  const queryClient = useQueryClient()

  // Redirect if not admin
  if (profile && profile.role !== 'admin') {
    navigate('/')
    return null
  }

  const { data: pendingUsers, isLoading } = useQuery({
    queryKey: ['pending-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'pending')
      
      if (error) throw error
      return data as UserProfile[]
    },
    enabled: !!profile && profile.role === 'admin'
  })

  const updateUserStatus = useMutation({
    mutationFn: async ({ userId, status }: { userId: string, status: 'active' | 'suspended' }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-users'] })
    }
  })

  if (!user) {
    navigate('/')
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage user approvals</p>
          </div>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </header>

        <div className="grid gap-4">
          {pendingUsers?.length === 0 ? (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">No pending approvals</p>
            </Card>
          ) : (
            pendingUsers?.map((pendingUser) => (
              <Card key={pendingUser.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {pendingUser.first_name
                        ? `${pendingUser.first_name} ${pendingUser.last_name}`
                        : pendingUser.email}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Requested: {new Date(pendingUser.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        updateUserStatus.mutate({
                          userId: pendingUser.id,
                          status: 'active',
                        })
                      }
                      variant="default"
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() =>
                        updateUserStatus.mutate({
                          userId: pendingUser.id,
                          status: 'suspended',
                        })
                      }
                      variant="destructive"
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin
