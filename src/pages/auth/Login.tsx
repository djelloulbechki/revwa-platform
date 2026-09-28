import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/i18n/LanguageContext"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn, signInWithOAuth } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleOAuth = async (provider: "google" | "linkedin_oidc") => {
    setError("")
    setLoading(true)
    const { error: oauthError } = await signInWithOAuth(provider)
    if (oauthError) {
      setError(oauthError.message)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      // Route by the server-side profile role instead of assuming every
      // authenticated user is a buyer.
      const userId = (await supabase.auth.getUser()).data.user?.id
      if (!userId) {
        setError("Signed in, but no authenticated user was returned.")
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle()

      if (profileError) {
        setError(profileError.message)
        return
      }

      if (profile?.role === "platform_admin") {
        navigate("/admin")
      } else if (profile?.role === "vendor_admin") {
        navigate("/vendor")
      } else {
        navigate("/buyer")
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper font-body text-ink">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 size-3 rounded-full bg-pop shadow-[0_0_10px_hsl(var(--primary-glow)/0.6)]" />
            <CardTitle>{t("login_title")}</CardTitle>
            <CardDescription>{t("login_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
                disabled={loading}
                onClick={() => handleOAuth("google")}
              >
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
                disabled={loading}
                onClick={() => handleOAuth("linkedin_oidc")}
              >
                Continue with LinkedIn
              </Button>
            </div>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-ink/50">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{t("login_email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("login_password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("login_submit")}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-ink/60">
              {t("login_no_account")}{" "}
              <Link
                to="/signup"
                className="font-bold text-pop underline decoration-2 underline-offset-4"
              >
                {t("login_signup_link")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
