import { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileText, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"

type ProjectRequest = {
  id: string
  title: string | null
  description_text: string | null
  status: string
  contact_email: string | null
  main_pain_points: string[] | null
  company_size: string | null
  budget_min: number | null
  budget_max: number | null
  currency: string | null
  submitted_at: string | null
  created_at: string
  priority: number | null
}

export default function AdminScoping() {
  const { user, loading: authLoading } = useAuth()
  const [list, setList] = useState<ProjectRequest[]>([])
  const [selected, setSelected] = useState<ProjectRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [objectives, setObjectives] = useState("")
  const [requirements, setRequirements] = useState("")
  const [outOfScope, setOutOfScope] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState("")

  useEffect(() => {
    if (authLoading) return
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError("")
      // Platform admin or any authenticated user with RLS allowing select
      const { data, error: qErr } = await supabase
        .from("project_requests")
        .select(
          "id, title, description_text, status, contact_email, main_pain_points, company_size, budget_min, budget_max, currency, submitted_at, created_at, priority"
        )
        .in("status", ["submitted", "under_review", "scoping"])
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(50)

      if (cancelled) return

      if (qErr) {
        setError(qErr.message)
        setList([])
      } else {
        const rows = (data as ProjectRequest[]) || []
        setList(rows)
        setSelected(rows[0] || null)
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [authLoading, user])

  const handleCreateScope = async () => {
    if (!selected || !user) return
    setSaving(true)
    setSaveMsg("")
    try {
      const { error: scopeErr } = await supabase.from("scope_documents").upsert(
        {
          request_id: selected.id,
          title: selected.title || "Scope document",
          objectives: objectives
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          functional_requirements: requirements
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((t) => ({ text: t })),
          out_of_scope: outOfScope
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          created_by: user.id,
          version: 1,
        },
        { onConflict: "request_id" }
      )

      if (scopeErr) throw scopeErr

      await supabase
        .from("project_requests")
        .update({ status: "scoping" })
        .eq("id", selected.id)

      setSaveMsg("Scope saved. Status → scoping.")
      setSelected({ ...selected, status: "scoping" })
      setList((prev) =>
        prev.map((r) => (r.id === selected.id ? { ...r, status: "scoping" } : r))
      )
    } catch (e: any) {
      setSaveMsg(e.message || "Failed to save scope")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">Admin · Scoping</h1>
          <p className="text-muted-foreground mt-1">
            Review submitted requests and draft scope documents
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm p-3 flex gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p>{error}</p>
              <p className="text-xs mt-1 opacity-80">
                You may need platform_admin role or broader RLS to list all requests.
              </p>
            </div>
          </div>
        )}

        {loading || authLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-2">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                Queue ({list.length})
              </p>
              {list.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-sm text-muted-foreground">
                    No submitted requests in queue.
                  </CardContent>
                </Card>
              ) : (
                list.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelected(r)}
                    className={`w-full text-left rounded-xl border p-3 transition-colors ${
                      selected?.id === r.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm truncate">
                        {r.title || r.description_text?.slice(0, 40) || "Request"}
                      </span>
                      <Badge variant="outline" className="shrink-0 text-[10px]">
                        {r.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {r.contact_email || "—"} ·{" "}
                      {new Date(r.submitted_at || r.created_at).toLocaleDateString()}
                    </p>
                  </button>
                ))
              )}
            </div>

            <div className="lg:col-span-3">
              {!selected ? (
                <Card>
                  <CardContent className="py-16 text-center text-muted-foreground">
                    Select a request
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Intake
                      </CardTitle>
                      <CardDescription>{selected.contact_email}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p className="whitespace-pre-wrap">
                        {selected.description_text || "—"}
                      </p>
                      {selected.main_pain_points && selected.main_pain_points.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {selected.main_pain_points.map((t) => (
                            <Badge key={t} variant="secondary">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Draft scope</CardTitle>
                      <CardDescription>
                        One line per item. Saves to scope_documents.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Objectives</Label>
                        <Textarea
                          value={objectives}
                          onChange={(e) => setObjectives(e.target.value)}
                          placeholder="One objective per line"
                          className="min-h-[80px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Functional requirements</Label>
                        <Textarea
                          value={requirements}
                          onChange={(e) => setRequirements(e.target.value)}
                          placeholder="One requirement per line"
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Out of scope</Label>
                        <Textarea
                          value={outOfScope}
                          onChange={(e) => setOutOfScope(e.target.value)}
                          placeholder="One item per line"
                          className="min-h-[60px]"
                        />
                      </div>
                      {saveMsg && (
                        <p className="text-sm text-muted-foreground">{saveMsg}</p>
                      )}
                      <Button onClick={handleCreateScope} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save scope document
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
