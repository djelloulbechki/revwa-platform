import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import {
  Briefcase,
  Clock,
  FileText,
  Loader2,
  Mail,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Hourglass,
  Ban,
  ArrowRight,
} from "lucide-react"

type VendorContext = {
  is_vendor: boolean
  organization_id?: string
  organization_name?: string
  onboarding_status?: "under_review" | "approved" | "qualified" | "rejected"
  vendor_tier?: string
  specialties?: string[]
  review_notes?: string | null
}

type Opportunity = {
  id: string
  title: string
  budget: string
  deadline: string
  status: string
}

export default function VendorDashboard() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [ctx, setCtx] = useState<VendorContext | null>(null)
  const [loading, setLoading] = useState(true)
  const [opps, setOpps] = useState<Opportunity[]>([])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      navigate("/vendor/login", { replace: true })
      return
    }

    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase.rpc("get_my_vendor_context")
        if (error) throw error
        const parsed = data as VendorContext
        if (!parsed?.is_vendor) {
          // Not a vendor member — send to join gate
          navigate("/vendor/join", { replace: true })
          return
        }
        if (!cancelled) setCtx(parsed)

        // Only load RFQ list when qualified
        if (parsed.onboarding_status === "qualified") {
          // Best-effort: open RFQs if table exists; else keep empty
          try {
            const { data: rfqs } = await supabase
              .from("project_requests")
              .select("id, title, budget_max, deadline_at, status")
              .eq("status", "open_for_quotes")
              .limit(10)
            if (rfqs && !cancelled) {
              setOpps(
                rfqs.map((r: any) => ({
                  id: r.id?.slice(0, 8) ?? "—",
                  title: r.title ?? "Opportunity",
                  budget: r.budget_max ? `Up to ${r.budget_max}` : "TBD",
                  deadline: r.deadline_at
                    ? new Date(r.deadline_at).toLocaleDateString()
                    : "—",
                  status: "new",
                }))
              )
            }
          } catch {
            /* schema may differ — UI still works */
          }
        }
      } catch (err) {
        console.warn("[vendor dashboard]", err)
        if (!cancelled) {
          setCtx({ is_vendor: false })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user, authLoading, navigate])

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen flex-col bg-paper font-body text-ink">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-pop" />
        </div>
      </div>
    )
  }

  const status = ctx?.onboarding_status ?? "under_review"

  return (
    <div className="flex min-h-screen flex-col bg-paper font-body text-ink">
      <Navbar />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-10 md:px-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-pop">
              Partner portal
            </p>
            <h1 className="font-display text-3xl text-ink md:uppercase">
              {ctx?.organization_name ?? "Vendor"}
            </h1>
            <p className="mt-1 text-ink/60">
              Most work happens offline with REVWA — this portal stays light on purpose.
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        {status === "under_review" && <UnderReviewPanel notes={ctx?.review_notes} />}
        {status === "rejected" && <RejectedPanel notes={ctx?.review_notes} />}
        {status === "approved" && <ApprovedPanel name={ctx?.organization_name} />}
        {status === "qualified" && (
          <QualifiedPanel opportunities={opps} specialties={ctx?.specialties} />
        )}
      </main>
    </div>
  )
}

function StatusBadge({
  status,
}: {
  status: "under_review" | "approved" | "qualified" | "rejected"
}) {
  const map = {
    under_review: {
      label: "Under review",
      className: "bg-sun text-white border-transparent",
      icon: Hourglass,
    },
    approved: {
      label: "Approved",
      className: "bg-pop text-white border-transparent",
      icon: CheckCircle2,
    },
    qualified: {
      label: "Qualified · can bid",
      className: "bg-mint text-white border-transparent",
      icon: ShieldCheck,
    },
    rejected: {
      label: "Not approved",
      className: "bg-destructive text-white border-transparent",
      icon: Ban,
    },
  } as const
  const m = map[status]
  return (
    <Badge className={`gap-1.5 px-3 py-1 text-sm ${m.className}`}>
      <m.icon className="h-3.5 w-3.5" />
      {m.label}
    </Badge>
  )
}

function UnderReviewPanel({ notes }: { notes?: string | null }) {
  return (
    <div className="space-y-6">
      <Card className="border-sun/30 bg-sun/5">
        <CardHeader>
          <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-sun/20 text-sun">
            <Hourglass className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl normal-case tracking-normal">
            Your application is under review
          </CardTitle>
          <CardDescription className="text-base text-ink/70">
            A REVWA project manager is checking your company details and documents.
            You don&apos;t need to stay on this page — we&apos;ll email you when status
            changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm text-ink/80">
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sun" />
              Invitation code accepted and account created
            </li>
            <li className="flex gap-2">
              <Hourglass className="mt-0.5 h-4 w-4 shrink-0 text-sun" />
              Profile &amp; files in review
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-ink/40" />
              Approval unlocks a simple partner home
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-ink/40" />
              Qualification unlocks bidding on RFQs
            </li>
          </ul>
          {notes && (
            <p className="rounded-2xl border-2 border-ink/10 bg-card p-4 text-sm text-ink/70">
              <span className="font-bold text-ink">Note from REVWA: </span>
              {notes}
            </p>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild variant="outline">
              <a href="mailto:ai@revwa.com">
                <Mail className="mr-2 h-4 w-4" />
                Contact REVWA
              </a>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/">Back to homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RejectedPanel({ notes }: { notes?: string | null }) {
  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-2xl normal-case tracking-normal">
          Application not approved
        </CardTitle>
        <CardDescription>
          {notes ||
            "Your partner application was not approved at this time. Contact REVWA if you have questions."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline">
          <a href="mailto:ai@revwa.com">Contact support</a>
        </Button>
      </CardContent>
    </Card>
  )
}

function ApprovedPanel({ name }: { name?: string }) {
  return (
    <div className="space-y-6">
      <Card className="border-pop/25 bg-pop/5">
        <CardHeader>
          <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-pop/15 text-pop">
            <Sparkles className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl normal-case tracking-normal">
            You&apos;re approved{name ? `, ${name}` : ""}
          </CardTitle>
          <CardDescription className="text-base text-ink/70">
            REVWA will reach out with relevant work. You are not required to live in
            this dashboard — keep an eye on email from{" "}
            <strong className="text-ink">ai@revwa.com</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <MiniStat icon={Mail} label="Primary channel" value="Email / calls" />
          <MiniStat icon={Briefcase} label="Assignments" value="Via REVWA team" />
          <MiniStat icon={ShieldCheck} label="Next stage" value="Qualification" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl normal-case tracking-normal">
            What happens next?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-ink/75">
          <p>
            • Our team matches scoped projects to partners manually when you&apos;re a
            good fit.
          </p>
          <p>
            • After a track record on the platform, you may be{" "}
            <strong>qualified</strong> to bid directly on open RFQs here.
          </p>
          <p>• Update documents anytime by emailing the project manager assigned to you.</p>
          <div className="flex flex-wrap gap-3 pt-4">
            <Button asChild>
              <a href="mailto:ai@revwa.com">
                Email REVWA
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Leave portal</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function QualifiedPanel({
  opportunities,
  specialties,
}: {
  opportunities: Opportunity[]
  specialties?: string[]
}) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Open RFQs", value: String(opportunities.length || "—"), icon: Briefcase },
          { label: "Your tier", value: "Qualified", icon: ShieldCheck },
          { label: "Specialties", value: String(specialties?.length ?? 0), icon: FileText },
          { label: "Support", value: "ai@revwa.com", icon: Mail },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pop/10 text-pop">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold leading-tight">{stat.value}</p>
                <p className="text-xs text-ink/60">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="normal-case tracking-normal">Open opportunities</CardTitle>
          <CardDescription>
            Qualified partners can review matched RFQs and submit bids. Work can still
            arrive offline from REVWA.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {opportunities.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-ink/15 p-8 text-center text-sm text-ink/60">
              No open RFQs matched right now. We&apos;ll notify you by email when
              something fits.
            </p>
          ) : (
            opportunities.map((opp) => (
              <div
                key={opp.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border-2 border-ink/10 bg-card p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-mono text-xs text-ink/50">{opp.id}</span>
                    {opp.status === "new" && <Badge variant="success">New</Badge>}
                  </div>
                  <h3 className="font-bold">{opp.title}</h3>
                  <p className="mt-0.5 text-sm text-ink/60">
                    Budget: {opp.budget} · Deadline: {opp.deadline}
                  </p>
                </div>
                <Button>View &amp; bid</Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <p className="text-center text-sm text-ink/50">
        Portal is optional — most coordination stays with your REVWA contact.
      </p>
    </div>
  )
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border-2 border-ink/10 bg-card p-4">
      <Icon className="mb-2 h-5 w-5 text-pop" />
      <p className="text-xs font-bold uppercase tracking-wide text-ink/50">{label}</p>
      <p className="mt-1 font-bold text-ink">{value}</p>
    </div>
  )
}
