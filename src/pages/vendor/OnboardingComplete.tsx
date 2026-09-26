import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

/** After OAuth redirect: create org from sessionStorage pending payload */
export default function VendorOnboardingComplete() {
  const navigate = useNavigate()
  const [msg, setMsg] = useState("Finishing partner setup…")

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate("/vendor/login", { replace: true })
        return
      }

      const raw = sessionStorage.getItem("revwa_vendor_pending_org")
      if (!raw) {
        navigate("/vendor", { replace: true })
        return
      }

      try {
        const pending = JSON.parse(raw) as {
          companyName: string
          country: string
          website?: string
          specialties?: string
          about?: string
        }

        // Skip if already a vendor member
        const { data: existing } = await supabase
          .from("organization_members")
          .select("id")
          .eq("user_id", user.id)
          .limit(1)

        if (existing && existing.length > 0) {
          sessionStorage.removeItem("revwa_vendor_pending_org")
          sessionStorage.removeItem("revwa_vendor_invite")
          navigate("/vendor", { replace: true })
          return
        }

        const { data: org, error: orgErr } = await supabase
          .from("organizations")
          .insert({
            name: pending.companyName,
            type: "vendor",
            country_code: pending.country,
            website: pending.website || null,
            description: pending.about || null,
          })
          .select("id")
          .single()

        if (orgErr) throw orgErr

        await supabase.from("organization_members").insert({
          organization_id: org.id,
          user_id: user.id,
          role: "vendor_admin",
          is_primary: true,
        })

        const specs = (pending.specialties || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)

        await supabase.from("vendor_profiles").insert({
          organization_id: org.id,
          specialties: specs,
          vendor_tier: "simple",
        })

        await supabase.from("profiles").upsert(
          {
            id: user.id,
            email: user.email,
            activation_status: "activated",
            role: "vendor_admin",
          },
          { onConflict: "id" }
        )

        sessionStorage.removeItem("revwa_vendor_pending_org")
        sessionStorage.removeItem("revwa_vendor_invite")
        if (!cancelled) navigate("/vendor", { replace: true })
      } catch (e: any) {
        console.error(e)
        if (!cancelled) setMsg(e.message || "Setup failed. Contact ai@revwa.com")
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{msg}</p>
    </div>
  )
}
