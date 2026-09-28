import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function OAuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState("")

  useEffect(() => {
    let mounted = true

    const resolveDestination = async () => {
      try {
        // OAuth may return with a short-lived session that Supabase restores
        // asynchronously. getSession() reads the restored browser session.
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        const user = sessionData.session?.user
        if (!user) throw new Error("OAuth sign-in completed, but no authenticated session was found.")

        // Preserve the vendor activation flow if the user came from vendor signup.
        if (localStorage.getItem("revwa_vendor_pending_org")) {
          navigate("/vendor/onboarding-complete", { replace: true })
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle()

        if (profileError) throw profileError

        if (!mounted) return

        if (profile?.role === "platform_admin") {
          navigate("/admin", { replace: true })
        } else if (profile?.role === "vendor_admin") {
          navigate("/vendor", { replace: true })
        } else {
          navigate("/buyer", { replace: true })
        }
      } catch (err: any) {
        if (!mounted) return
        setError(err?.message || "Unable to complete sign in.")
      }
    }

    resolveDestination()

    return () => {
      mounted = false
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6 font-body text-ink">
      <div className="w-full max-w-md text-center">
        {error ? (
          <>
            <h1 className="font-display text-2xl font-semibold">Sign in failed</h1>
            <p className="mt-3 text-sm text-ink/60">{error}</p>
            <button
              type="button"
              className="mt-6 font-bold text-pop underline decoration-2 underline-offset-4"
              onClick={() => navigate("/login", { replace: true })}
            >
              Return to sign in
            </button>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            <p className="mt-4 text-sm text-ink/60">Completing secure sign in…</p>
          </>
        )}
      </div>
    </div>
  )
}
