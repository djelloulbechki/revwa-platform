import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { Loader2, Building2, ArrowLeft } from "lucide-react"

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

type InvitePayload = {
  code: string
  invite_id?: string
  company_hint?: string | null
}

export default function VendorSignup() {
  const navigate = useNavigate()
  const { signInWithOAuth, linkIdentity } = useAuth()
  const [invite, setInvite] = useState<InvitePayload | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [country, setCountry] = useState("SA")
  const [website, setWebsite] = useState("")
  const [specialties, setSpecialties] = useState("")
  const [about, setAbout] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const raw = sessionStorage.getItem("revwa_vendor_invite")
    if (!raw) {
      navigate("/vendor/join", { replace: true })
      return
    }
    try {
      const parsed = JSON.parse(raw) as InvitePayload
      setInvite(parsed)
      if (parsed.company_hint) setCompanyName(parsed.company_hint)
    } catch {
      navigate("/vendor/join", { replace: true })
    }
  }, [navigate])

  const createVendorOrg = async (userId: string) => {
    const { data: org, error: orgErr } = await supabase
      .from("organizations")
      .insert({
        name: companyName.trim(),
        type: "vendor",
        country_code: country,
        website: website.trim() || null,
        description: about.trim() || null,
        is_active: true,
      })
      .select("id")
      .single()

    if (orgErr) throw orgErr

    await supabase.from("organization_members").insert({
      organization_id: org.id,
      user_id: userId,
      role: "vendor_admin",
      is_primary: true,
    })

    const specs = specialties
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
        id: userId,
        full_name: fullName.trim() || null,
        email: email.trim() || null,
        activation_status: "activated",
        role: "vendor_admin",
      },
      { onConflict: "id" }
    )

    // Mark invite used (best-effort; admin RPC preferred later)
    if (invite?.invite_id) {
      await supabase.rpc("validate_vendor_invite", { p_code: invite.code })
      // increment via edge function later; for now leave admin-managed
    }
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!companyName.trim()) {
      setError("Company name is required.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    setLoading(true)
    try {
      const { data, error: signErr } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            vendor_invite: invite?.code,
            company_name: companyName.trim(),
          },
        },
      })
      if (signErr) throw signErr
      const userId = data.user?.id
      if (!userId) throw new Error("Signup succeeded but no user id returned.")

      await createVendorOrg(userId)
      sessionStorage.removeItem("revwa_vendor_invite")
      navigate("/vendor")
    } catch (err: any) {
      setError(err.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: "google" | "linkedin_oidc") => {
    if (!companyName.trim()) {
      setError("Please enter your company name before continuing with OAuth.")
      return
    }
    // Stash company form for after OAuth redirect
    sessionStorage.setItem(
      "revwa_vendor_pending_org",
      JSON.stringify({
        companyName: companyName.trim(),
        country,
        website: website.trim(),
        specialties: specialties.trim(),
        about: about.trim(),
        invite,
      })
    )
    setLoading(true)
    const { error: oErr } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/vendor/onboarding-complete`,
      },
    })
    if (oErr) {
      setError(oErr.message)
      setLoading(false)
    }
  }

  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-lg">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/vendor/join">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-primary mb-1">
              <Building2 className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Partner signup
              </span>
            </div>
            <CardTitle className="font-heading text-2xl">Create vendor account</CardTitle>
            <CardDescription>
              Invitation verified. Companies only — complete your firm details, then
              choose how to sign in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm p-3">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="company">Company name *</Label>
              <Input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                placeholder="Your agency or studio name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <select
                id="country"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website (optional)</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specs">Specialties (comma-separated)</Label>
              <Input
                id="specs"
                placeholder="Web apps, Automation, Mobile…"
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">Short about (optional)</Label>
              <Textarea
                id="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="What you deliver best"
                className="min-h-[80px]"
              />
            </div>

            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-medium">Account access</p>
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
            </div>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or email</span>
              </div>
            </div>

            <form onSubmit={handleEmailSignup} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="fullName">Your name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contact person"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create partner account
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
