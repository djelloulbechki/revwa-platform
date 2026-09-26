import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Clock, CheckCircle2, Loader2, ArrowRight, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"

type ProjectRequest = {
  id: string
  title: string | null
  description_text: string | null
  status: string
  contact_email: string | null
  main_pain_points: string[] | null
  budget_min: number | null
  budget_max: number | null
  currency: string | null
  submitted_at: string | null
  created_at: string
}

const statusMap: Record<
  string,
  { label: string; variant: "default" | "secondary" | "success" | "outline" | "destructive" }
> = {
  draft: { label: "Draft", variant: "secondary" },
  submitted: { label: "Submitted", variant: "outline" },
  under_review: { label: "Under Review", variant: "outline" },
  scoping: { label: "Scoping", variant: "default" },
  rfq_sent: { label: "RFQ Sent", variant: "default" },
  proposals_received: { label: "Proposals In", variant: "default" },
  shortlisted: { label: "Shortlisted", variant: "success" },
  negotiation: { label: "Negotiation", variant: "success" },
  won: { label: "Won", variant: "success" },
  lost: { label: "Lost", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "secondary" },
  archived: { label: "Archived", variant: "secondary" },
}

function formatBudget(r: ProjectRequest) {
  if (r.budget_min == null && r.budget_max == null) return "—"
  const cur = r.currency || "USD"
  if (r.budget_min != null && r.budget_max != null)
    return `${cur} ${r.budget_min.toLocaleString()}–${r.budget_max.toLocaleString()}`
  if (r.budget_min != null) return `From ${cur} ${r.budget_min.toLocaleString()}`
  return `Up to ${cur} ${r.budget_max!.toLocaleString()}`
}

function displayTitle(r: ProjectRequest) {
  if (r.title?.trim()) return r.title
  if (r.description_text?.trim()) {
    const t = r.description_text.trim()
    return t.length > 60 ? t.slice(0, 60) + "…" : t
  }
  return "Untitled request"
}

export default function BuyerDashboard() {
  const { user, loading: authLoading } = useAuth()
  const [requests, setRequests] = useState<ProjectRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setLoading(false)
      setRequests([])
      return
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError("")
      const { data, error: qErr } = await supabase
        .from("project_requests")
        .select(
          "id, title, description_text, status, contact_email, main_pain_points, budget_min, budget_max, currency, submitted_at, created_at"
        )
        .eq("created_by", user.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })

      if (cancelled) return

      if (qErr) {
        console.error(qErr)
        setError(qErr.message)
        setRequests([])
      } else {
        setRequests((data as ProjectRequest[]) || [])
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [user, authLoading])

  const active = requests.filter((r) =>
    !["won", "lost", "cancelled", "archived"].includes(r.status)
  ).length
  const completed = requests.filter((r) =>
    ["won", "lost", "cancelled", "archived"].includes(r.status)
  ).length

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">My Requests</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your tech procurement requests
            </p>
          </div>
          <Button asChild className="glow">
            <Link to="/request">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        </div>

        {!user && !authLoading && (
          <Card className="mb-8 border-dashed">
            <CardContent className="py-8 text-center space-y-3">
              <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                Sign in to see your requests, or submit a new one to create your workspace.
              </p>
              <div className="flex justify-center gap-3">
                <Button asChild variant="outline">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/request">Get Started</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-3xl font-heading">{requests.length}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" /> All requests
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>In progress</CardDescription>
              <CardTitle className="text-3xl font-heading">{active}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" /> Active pipeline
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Closed</CardDescription>
              <CardTitle className="text-3xl font-heading">{completed}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Won / lost / archived
            </CardContent>
          </Card>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm p-3">
            {error}
            <p className="mt-1 text-xs opacity-80">
              Check RLS policies and that migration 002 was applied.
            </p>
          </div>
        )}

        {loading || authLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : requests.length === 0 && user ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center space-y-3">
              <p className="text-muted-foreground">No requests yet for this account.</p>
              <Button asChild>
                <Link to="/request">Submit your first request</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => {
              const st = statusMap[r.status] || {
                label: r.status,
                variant: "outline" as const,
              }
              return (
                <Card key={r.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading font-semibold truncate">
                          {displayTitle(r)}
                        </h3>
                        <Badge variant={st.variant}>{st.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {r.submitted_at || r.created_at
                          ? new Date(r.submitted_at || r.created_at).toLocaleString()
                          : ""}
                        {r.contact_email ? ` · ${r.contact_email}` : ""}
                        {` · ${formatBudget(r)}`}
                      </p>
                      {r.main_pain_points && r.main_pain_points.length > 0 && (
                        <p className="text-xs text-muted-foreground truncate">
                          {r.main_pain_points.slice(0, 5).join(" · ")}
                        </p>
                      )}
                    </div>
                    <Button asChild variant="ghost" size="sm" className="shrink-0">
                      <Link to={`/buyer/requests/${r.id}`}>
                        View
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
