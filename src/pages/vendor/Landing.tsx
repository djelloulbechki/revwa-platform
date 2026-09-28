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
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import {
  Shield,
  Target,
  Scale,
  KeyRound,
  Loader2,
  ArrowRight,
  Building2,
  CheckCircle2,
} from "lucide-react"

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "IN", name: "India" },
  { code: "EG", name: "Egypt" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "QA", name: "Qatar" },
  { code: "BH", name: "Bahrain" },
  { code: "KW", name: "Kuwait" },
  { code: "OM", name: "Oman" },
]

export default function VendorLanding() {
  const navigate = useNavigate()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const trimmed = code.trim()
    if (!trimmed) {
      setError("Please enter your invitation code.")
      return
    }

    setLoading(true)
    try {
      const { data, error: rpcErr } = await supabase.rpc("validate_vendor_invite", {
        p_code: trimmed,
      })

      if (rpcErr) throw rpcErr

      const result = data as {
        valid?: boolean
        reason?: string
        invite_id?: string
        company_hint?: string | null
      }

      if (!result?.valid) {
        setError(
          "This invitation code is not valid or has expired. To join REVWA as a digital services partner, contact us at ai@revwa.com."
        )
        setLoading(false)
        return
      }

      // Pass invite to signup via sessionStorage
      localStorage.setItem(
        "revwa_vendor_invite",
        JSON.stringify({
          code: trimmed,
          invite_id: result.invite_id,
          company_hint: result.company_hint || null,
        })
      )
      navigate("/vendor/signup")
    } catch (err: any) {
      console.error(err)
      setError(
        err?.message ||
          "Could not verify the code. Please try again or email ai@revwa.com."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper font-body text-ink">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-pop/10 via-transparent to-sun/5 pointer-events-none" />
          <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-16 md:py-24 max-w-4xl relative">
            <div className="text-center space-y-5">
              <Badge variant="outline" className="border-pop/40 text-pop">
                Invite-only partner network
              </Badge>
              <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight">
                For digital service providers
              </h1>
              <p className="text-ink/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                REVWA connects vetted software and digital agencies with buyers who
                already have a clear scope — so you receive{" "}
                <span className="text-foreground font-medium">qualified leads</span>,
                not tire-kickers. Access is by invitation to keep quality high for
                everyone.
              </p>
            </div>

            {/* Value props */}
            <div className="mt-12 grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Target,
                  title: "Qualified demand",
                  desc: "Buyers arrive with defined needs, budgets, and scope — not vague RFPs.",
                },
                {
                  icon: Scale,
                  title: "Fair competition",
                  desc: "Anonymous RFQs. Win on merit, price, and delivery — not relationships alone.",
                },
                {
                  icon: Shield,
                  title: "Trusted network",
                  desc: "Invite-only partners across 10 markets. Credibility first.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border-2 border-ink/10 bg-card p-5 text-left shadow-[0_6px_0_0_rgba(0,0,0,0.08)]"
                >
                  <item.icon className="h-6 w-6 text-pop mb-3" />
                  <h3 className="font-display font-semibold">{item.title}</h3>
                  <p className="text-sm text-ink/60 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Markets */}
        <section className="mx-auto max-w-[1440px] px-6 md:px-10 py-12 max-w-4xl">
          <h2 className="font-display text-lg font-semibold text-center mb-4">
            Active partner markets
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {COUNTRIES.map((c) => (
              <Badge key={c.code} variant="secondary" className="px-3 py-1">
                {c.name}
              </Badge>
            ))}
          </div>
        </section>

        {/* Invite gate */}
        <section className="mx-auto max-w-[1440px] px-6 md:px-10 pb-20 max-w-md">
          <Card className="border-pop/25">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-pop/10 text-pop">
                <KeyRound className="h-6 w-6" />
              </div>
              <CardTitle className="font-display text-xl">Partner access</CardTitle>
              <CardDescription>
                Enter the invitation code provided by REVWA to create your vendor
                account. Already a partner? Sign in below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={handleValidate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-code">Invitation code</Label>
                  <Input
                    id="invite-code"
                    placeholder="e.g. REVWA-PARTNER-XXXX"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono tracking-wide uppercase"
                    autoComplete="off"
                  />
                </div>

                {error && (
                  <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/10 text-destructive text-sm p-3 leading-relaxed">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4" />
                  )}
                  Continue to partner signup
                </Button>
              </form>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-ink/60">or</span>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link to="/vendor/login">I already have a partner account — Sign in</Link>
              </Button>

              <p className="text-center text-xs text-ink/60 leading-relaxed pt-2">
                Don’t have an invitation code? Apply to join our partner network:{" "}
                <a
                  href="mailto:ai@revwa.com?subject=Vendor%20partner%20application"
                  className="text-pop font-medium hover:underline"
                >
                  ai@revwa.com
                </a>
              </p>
            </CardContent>
          </Card>

          <ul className="mt-8 space-y-2 text-sm text-ink/60 max-w-md mx-auto">
            {[
              "Companies only — agencies, studios, and digital service firms",
              "Clear scopes and serious buyers, not open-ended browsing",
              "Transparent engagement terms preferred on both sides",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-pop shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-ink/60">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5" />
            REVWA Partner Network
          </span>
          <span className="hidden sm:inline">·</span>
          <Link to="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </div>
      </footer>
    </div>
  )
}
