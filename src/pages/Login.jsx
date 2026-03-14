import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { LogIn } from "lucide-react"

export default function Login() {
  const { isOwner, loading, signIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && isOwner) {
      navigate("/admin", { replace: true })
    }
  }, [isOwner, loading, navigate])

  return (
    <div className="flex items-center justify-center py-20">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Sign in to manage courses and notes</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={signIn} className="w-full" size="lg">
            <LogIn className="h-5 w-5" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
