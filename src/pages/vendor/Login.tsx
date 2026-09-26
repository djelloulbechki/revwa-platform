import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Loader2, ArrowLeft } from "lucide-react"

export default function VendorLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (err) throw err
      navigate("/vendor")
    } catch (err: any) {
      setError(err.message || "Sign in failed")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: "google" | "linkedin_oidc") => {
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/vendor` },
    })
    if (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-md">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/vendor/join">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Partner home
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Partner sign in</CardTitle>
            <CardDescription>
              For invited digital service providers already on REVWA.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm p-3">
                {error}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={() => handleOAuth("google")}
            >
              Continue with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={() => handleOAuth("linkedin_oidc")}
            >
              Continue with LinkedIn
            </Button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground">
              New partner?{" "}
              <Link to="/vendor/join" className="text-primary hover:underline">
                Enter invitation code
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
