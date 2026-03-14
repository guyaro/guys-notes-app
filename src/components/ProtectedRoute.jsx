import { Navigate } from "react-router-dom"
import { useAuth } from "@/lib/auth"

export function ProtectedRoute({ children }) {
  const { user, isOwner, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isOwner) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">Access Denied</p>
        <p className="text-sm">Signed in as {user.email} — only the owner can access this page.</p>
      </div>
    )
  }

  return children
}
