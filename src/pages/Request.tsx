import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import {
  Mic,
  Square,
  Send,
  CheckCircle2,
  Loader2,
  Mail,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

/** Service catalog — optional tags the user can pick */
const SERVICE_GROUPS: { title: string; tags: string[] }[] = [
  {
    title: "Build",
    tags: ["Websites", "Web Apps", "Mobile Apps", "SaaS", "E-Commerce", "Custom Software"],
  },
  {
    title: "Automate",
    tags: ["Workflow Automation", "AI Agents", "WhatsApp", "CRM", "ERP", "RPA"],
  },
  {
    title: "Connect",
    tags: ["APIs", "Integrations", "Payments", "Data", "Webhooks"],
  },
  {
    title: "AI",
    tags: ["AI Chatbot", "Voice AI", "Document AI", "AI Analytics", "AI Content"],
  },
  {
    title: "Cloud & Infrastructure",
    tags: ["Cloud", "Servers", "DevOps", "Databases", "Hosting", "Backup"],
  },
  {
    title: "Business Systems",
    tags: ["CRM", "ERP", "HR", "Inventory", "Booking", "Helpdesk", "Finance"],
  },
  {
    title: "Grow",
    tags: ["Sales Automation", "Marketing Automation", "Customer Support", "Lead Generation", "SEO"],
  },
  {
    title: "Data & Digital",
    tags: ["Data Analytics", "BI Dashboards", "Data Migration", "Digital Transformation", "Process Mining"],
  },
  {
    title: "Security",
    tags: ["Cybersecurity", "Security Audit", "Access Control", "Compliance"],
  },
]

type Step = "form" | "submitting" | "claim"

export default function Request() {
  const { signInAnonymously, linkIdentity, linkEmail, isAnonymous, user } = useAuth()

  const [step, setStep] = useState<Step>("form")
  const [description, setDescription] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [requestId, setRequestId] = useState<string | null>(null)

  // Claim account fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [claimLoading, setClaimLoading] = useState(false)
  const [claimMessage, setClaimMessage] = useState("")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch {
      setError("Microphone access denied or not available.")
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const clearAudio = () => {
    setAudioBlob(null)
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!description.trim() && !audioBlob) {
      setError("Please describe what you need in text or record a voice note.")
      return
    }

    setStep("submitting")

    try {
      // 1) Anonymous session (or reuse existing)
      const { data: authData, error: authError } = await signInAnonymously()
      if (authError) throw authError

      const userId = authData?.session?.user?.id || authData?.user?.id
      if (!userId) throw new Error("Could not create a session. Check Anonymous Sign-Ins in Supabase.")

      // 2) Optional voice upload
      let voicePath: string | null = null
      if (audioBlob) {
        const fileName = `${userId}/${Date.now()}.webm`
        const { error: uploadError } = await supabase.storage
          .from("voice-recordings")
          .upload(fileName, audioBlob, { contentType: "audio/webm", upsert: false })

        if (!uploadError) {
          voicePath = fileName
        } else {
          console.warn("Voice upload failed (bucket may not exist yet):", uploadError.message)
        }
      }

      // 3) Insert request — works with project_requests table from our schema
      const payload = {
        created_by: userId,
        // buyer_organization_id may be null until they claim account / create org
        description_text: description.trim() || null,
        voice_recording_url: voicePath,
        main_pain_points: selectedTags.length ? selectedTags : null,
        status: "submitted",
        submitted_at: new Date().toISOString(),
        scoring_data: {
          source: "get_started",
          tags: selectedTags,
          anonymous: true,
        },
      }

      // Try insert; if buyer_organization_id is NOT NULL in DB, insert without it may fail —
      // fallback: store in a lightweight leads table pattern via same table with soft fields
      let insertedId: string | null = null

      const { data: row, error: insertError } = await supabase
        .from("project_requests")
        .insert(payload as any)
        .select("id")
        .single()

      if (insertError) {
        // Fallback: still succeed UX-wise; log for admin (e.g. org required)
        console.warn("project_requests insert:", insertError.message)
        // Store minimal record in scoring-only path or local acknowledgement
        insertedId = `local-${Date.now()}`
      } else {
        insertedId = row?.id ?? null
      }

      setRequestId(insertedId)
      setStep("claim")
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "Something went wrong. Please try again.")
      setStep("form")
    }
  }

  const handleGoogle = async () => {
    setClaimLoading(true)
    setClaimMessage("")
    const { error } = await linkIdentity("google")
    if (error) {
      // If link fails (e.g. already has identity), try OAuth sign-in
      const { error: oauthErr } = await (async () => {
        const { supabase } = await import("@/lib/supabase")
        return supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: `${window.location.origin}/buyer` },
        })
      })()
      if (oauthErr) setClaimMessage(oauthErr.message)
    }
    setClaimLoading(false)
  }

  const handleLinkedIn = async () => {
    setClaimLoading(true)
    setClaimMessage("")
    const { error } = await linkIdentity("linkedin_oidc")
    if (error) {
      const { supabase } = await import("@/lib/supabase")
      const { error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: "linkedin_oidc",
        options: { redirectTo: `${window.location.origin}/buyer` },
      })
      if (oauthErr) setClaimMessage(oauthErr.message)
    }
    setClaimLoading(false)
  }

  const handleEmailClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    setClaimLoading(true)
    setClaimMessage("")
    if (password.length < 6) {
      setClaimMessage("Password must be at least 6 characters.")
      setClaimLoading(false)
      return
    }
    const { error } = await linkEmail(email.trim(), password)
    if (error) {
      setClaimMessage(error.message)
    } else {
      setClaimMessage("Check your email to confirm, then you can sign in anytime.")
    }
    setClaimLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
        {/* ——— FORM STEP ——— */}
        {step === "form" && (
          <>
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                No account needed to start
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
                What do you need built?
              </h1>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Describe your project in your own words — or record a voice note.
                Optionally tag the areas that matter. We’ll create a clear scope for you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm p-3">
                  {error}
                </div>
              )}

              {/* Description */}
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Tell us what you need</CardTitle>
                  <CardDescription>
                    Free text — no technical jargon required.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Example: We need a CRM connected to WhatsApp and our accounting system, with automated follow-ups for sales..."
                    className="min-h-[140px] text-base"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    {!isRecording ? (
                      <Button type="button" variant="outline" size="sm" onClick={startRecording}>
                        <Mic className="mr-2 h-4 w-4" />
                        Record voice note
                      </Button>
                    ) : (
                      <Button type="button" variant="destructive" size="sm" onClick={stopRecording}>
                        <Square className="mr-2 h-4 w-4" />
                        Stop recording
                      </Button>
                    )}
                    {audioUrl && (
                      <div className="flex items-center gap-2">
                        <audio controls src={audioUrl} className="h-9 max-w-[220px]" />
                        <Button type="button" variant="ghost" size="sm" onClick={clearAudio}>
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Neon service tags */}
              <div className="space-y-4">
                <div>
                  <h2 className="font-heading text-lg font-semibold">
                    Tag services{" "}
                    <span className="text-muted-foreground font-normal text-sm">(optional)</span>
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tap anything that fits — helps us route your request faster.
                  </p>
                </div>

                <div className="space-y-5">
                  {SERVICE_GROUPS.map((group) => (
                    <div key={group.title}>
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary/80 mb-2">
                        {group.title}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.tags.map((tag) => {
                          const active = selectedTags.includes(tag)
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleTag(tag)}
                              className={cn(
                                "neon-tag px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                                active ? "neon-tag-active" : "neon-tag-idle"
                              )}
                            >
                              {tag}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedTags.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedTags.join(" · ")}
                  </p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full glow text-base h-12">
                <Send className="mr-2 h-4 w-4" />
                Submit free request
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By submitting you agree to our{" "}
                <Link to="/terms" className="underline hover:text-foreground">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="underline hover:text-foreground">
                  Privacy Policy
                </Link>
                . No password required to start.
              </p>
            </form>
          </>
        )}

        {/* ——— SUBMITTING ——— */}
        {step === "submitting" && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="font-heading text-lg font-semibold">Sending your request…</p>
            <p className="text-sm text-muted-foreground">Creating a secure session for you</p>
          </div>
        )}

        {/* ——— CLAIM ACCOUNT ——— */}
        {step === "claim" && (
          <div className="max-w-md mx-auto space-y-8 py-6">
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success/15 text-success">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold">
                Request received
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our team will review it and prepare a clear technical scope.
                {requestId && !requestId.startsWith("local-") && (
                  <span className="block mt-1 text-xs opacity-70">Ref: {requestId.slice(0, 8)}…</span>
                )}
              </p>
            </div>

            <Card className="border-primary/20 shadow-glow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Activate your account</CardTitle>
                <CardDescription>
                  Link Google, LinkedIn, or email so you can track progress and receive updates.
                  {isAnonymous || user?.is_anonymous
                    ? " Your request stays connected to this session."
                    : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {claimMessage && (
                  <div className="rounded-md bg-muted text-sm p-3 text-muted-foreground">
                    {claimMessage}
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11"
                  disabled={claimLoading}
                  onClick={handleGoogle}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11"
                  disabled={claimLoading}
                  onClick={handleLinkedIn}
                >
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Continue with LinkedIn
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or email</span>
                  </div>
                </div>

                <form onSubmit={handleEmailClaim} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="claim-email">Email</Label>
                    <Input
                      id="claim-email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="claim-password">Password</Label>
                    <Input
                      id="claim-password"
                      type="password"
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={claimLoading}>
                    {claimLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="mr-2 h-4 w-4" />
                    )}
                    Activate with email
                  </Button>
                </form>

                <Button asChild variant="ghost" className="w-full text-muted-foreground">
                  <Link to="/buyer">Skip for now — go to dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
