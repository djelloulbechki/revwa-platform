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
      const {
        data: { user },
      } = await supabase.auth.getUser()
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
          invite?: { code?: string; invite_id?: string }
        }

        const specs = (pending.specialties || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)

        const code =
          pending.invite?.code ||
          (() => {
            try {
              return JSON.parse(sessionStorage.getItem("revwa_vendor_invite") || "{}").code
            } catch {
              return null
            }
          })()

        if (!code) {
          throw new Error("Your vendor invitation is missing. Please restart from the invitation link.")
        }

        const { data, error } = await supabase.rpc("create_vendor_organization", {
          p_company_name: pending.companyName,
          p_country_code: pending.country,
          p_website: pending.website || null,
          p_description: pending.about || null,
          p_specialties: specs,
          p_contact_email: user.email ?? null,
          p_invite_code: code,
          p_full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        })

        if (error) throw error
        if (!data?.ok || !data.organization_id) {
          throw new Error("Vendor organization setup could not be completed.")
        }
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper">
      <Loader2 className="h-8 w-8 animate-spin text-pop" />
      <p className="text-sm text-ink/60">{msg}</p>
    </div>
  )
}
