import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"

type ProjectRequest = {
  id: string
  title: string | null
  description_text: string | null
  status: string
  contact_email: string | null
  main_pain_points: string[] | null
  voice_recording_url: string | null
  budget_min: number | null
  budget_max: number | null
  currency: string | null
  timeline: string | null
  submitted_at: string | null
  created_at: string
  scoring_data: Record<string, unknown> | null
}

const statusLabel: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  scoping: "Scoping",
  rfq_sent: "RFQ Sent",
  proposals_received: "Proposals Received",
  shortlisted: "Shortlisted",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
  cancelled: "Cancelled",
  archived: "Archived",
}

export default function RequestDetails() {
  const { id } = useParams<{ id: string }>()
  const { user, loading: authLoading } = useAuth()
  const [req, setReq] = useState<ProjectRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (authLoading || !id) return
    if (!user) {
      setLoading(false)
      return
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      const { data, error: qErr } = await supabase
        .from("project_requests")
        .select(
          "id, title, description_text, status, contact_email, main_pain_points, voice_recording_url, budget_min, budget_max, currency, timeline, submitted_at, created_at, scoring_data"
        )
        .eq("id", id)
        .eq("created_by", user.id)
        .maybeSingle()

      if (cancelled) return

      if (qErr) {
        setError(qErr.message)
        setReq(null)
      } else {
        setReq(data as ProjectRequest | null)
        if (!data) setError("Request not found or you don’t have access.")
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id, user, authLoading])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to="/buyer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to requests
          </Link>
        </Button>

        {loading || authLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error || !req ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              {error || "Request not found."}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold">
                  {req.title?.trim() ||
                    req.description_text?.trim()?.slice(0, 80) ||
                    "Request"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {req.submitted_at || req.created_at
                    ? new Date(req.submitted_at || req.created_at).toLocaleString()
                    : ""}
                  {req.contact_email ? ` · ${req.contact_email}` : ""}
                </p>
              </div>
              <Badge>{statusLabel[req.status] || req.status}</Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {req.description_text || "—"}
                </p>
              </CardContent>
            </Card>

            {req.main_pain_points && req.main_pain_points.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tagged services</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {req.main_pain_points.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Contact email</p>
                  <p>{req.contact_email || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Timeline</p>
                  <p>{req.timeline || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Budget</p>
                  <p>
                    {req.budget_min != null || req.budget_max != null
                      ? `${req.currency || "USD"} ${req.budget_min ?? "?"} – ${req.budget_max ?? "?"}`
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Voice note</p>
                  <p>{req.voice_recording_url ? "Uploaded" : "None"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
