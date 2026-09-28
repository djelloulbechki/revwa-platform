import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { AlertCircle, ArrowLeft, FileText, Loader2, Search } from "lucide-react"

type RequestRow = {
  id: string; title: string | null; description_text: string | null; status: string
  contact_email: string | null; main_pain_points: string[] | null; company_size: string | null
  budget_min: number | null; budget_max: number | null; currency: string | null
  submitted_at: string | null; created_at: string; priority: number | null; timeline: string | null
  current_systems: string[] | null; success_metrics: string[] | null
}

const statuses = ["submitted", "under_review", "scoping", "rfq_sent", "proposals_received", "shortlisted", "negotiation", "won", "lost", "cancelled", "archived"]

const label = (s: string) => s.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())

export default function AdminRequests() {
  const { id } = useParams()
  const { user, loading: authLoading } = useAuth()
  const [rows, setRows] = useState<RequestRow[]>([])
  const [selected, setSelected] = useState<RequestRow | null>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [objectives, setObjectives] = useState("")
  const [requirements, setRequirements] = useState("")
  const [outOfScope, setOutOfScope] = useState("")
  const [message, setMessage] = useState("")

  const load = async () => {
    if (!user) return
    setLoading(true); setError("")
    const { data, error: err } = await supabase.from("project_requests")
      .select("id, title, description_text, status, contact_email, main_pain_points, company_size, budget_min, budget_max, currency, submitted_at, created_at, priority, timeline, current_systems, success_metrics")
      .is("deleted_at", null).order("created_at", { ascending: false }).limit(100)
    if (err) { setError(err.message); setRows([]); setSelected(null) }
    else {
      const next = (data as RequestRow[]) || []
      setRows(next)
      const wanted = id ? next.find((r) => r.id === id) : null
      setSelected(wanted || next[0] || null)
    }
    setLoading(false)
  }

  useEffect(() => { if (!authLoading && user) load() }, [authLoading, user, id])

  useEffect(() => {
    if (!selected) return
    setObjectives(""); setRequirements(""); setOutOfScope(""); setMessage("")
  }, [selected?.id])

  const filtered = rows.filter((r) => {
    const q = search.trim().toLowerCase(); if (!q) return true
    return `${r.title || ""} ${r.contact_email || ""} ${r.description_text || ""}`.toLowerCase().includes(q)
  })

  const updateStatus = async (status: string) => {
    if (!selected) return
    setSaving(true); setError("")
    const { error: err } = await supabase.from("project_requests").update({ status }).eq("id", selected.id)
    if (err) setError(err.message)
    else { setSelected({ ...selected, status }); setRows((p) => p.map((r) => r.id === selected.id ? { ...r, status } : r)); setMessage(`Status updated to ${label(status)}.`) }
    setSaving(false)
  }

  const saveScope = async () => {
    if (!selected || !user) return
    setSaving(true); setError("")
    const { error: scopeErr } = await supabase.from("scope_documents").upsert({
      request_id: selected.id,
      title: selected.title || "Scope document",
      objectives: objectives.split("\n").map((s) => s.trim()).filter(Boolean),
      functional_requirements: requirements.split("\n").map((s) => s.trim()).filter(Boolean).map((text) => ({ text })),
      out_of_scope: outOfScope.split("\n").map((s) => s.trim()).filter(Boolean),
      created_by: user.id,
      version: 1,
    }, { onConflict: "request_id" })
    if (scopeErr) { setError(scopeErr.message); setSaving(false); return }
    await updateStatus("scoping")
    setMessage("Scope saved and request moved to Scoping.")
    setSaving(false)
  }

  return <div className="flex min-h-screen flex-col bg-paper font-body text-ink"><Navbar />
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-10 md:px-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-pop">Admin · Operations</p><h1 className="font-display text-4xl font-bold">Work Requests</h1><p className="mt-2 text-ink/60">Review buyer intake, move requests through the pipeline and prepare scope documents.</p></div>
        <Button asChild variant="outline"><Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Overview</Link></Button>
      </div>
      {error && <div className="mb-5 flex gap-2 rounded-2xl border-2 border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
      {loading || authLoading ? <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-pop" /></div> :
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-2"><CardHeader><CardTitle>Request queue</CardTitle><CardDescription>{rows.length} requests</CardDescription><div className="relative pt-2"><Search className="absolute left-3 top-5 h-4 w-4 text-ink/40" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, email or description" className="pl-9" /></div></CardHeader><CardContent className="space-y-2">
            {filtered.length === 0 ? <p className="py-8 text-center text-sm text-ink/50">No requests found.</p> : filtered.map((r) => <Link key={r.id} to={`/admin/requests/${r.id}`} className={`block rounded-2xl border-2 p-3 transition ${selected?.id === r.id ? "border-primary bg-pop/5" : "border-ink/10 hover:border-primary/30"}`}><div className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold">{r.title || "Untitled request"}</span><Badge variant="outline" className="shrink-0 text-[10px]">{label(r.status)}</Badge></div><p className="mt-1 truncate text-xs text-ink/50">{r.contact_email || "No email"} · {new Date(r.created_at).toLocaleDateString()}</p></Link>)}
          </CardContent></Card>

          <div className="space-y-5 lg:col-span-3">{!selected ? <Card><CardContent className="py-20 text-center text-ink/50">Select a request.</CardContent></Card> : <>
            <Card><CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />{selected.title || "Untitled work request"}</CardTitle><CardDescription>{selected.contact_email || "No contact email"} · Created {new Date(selected.created_at).toLocaleString()}</CardDescription></div><Badge>{label(selected.status)}</Badge></div></CardHeader><CardContent className="space-y-5 text-sm">
              <div><p className="mb-2 font-semibold">Request description</p><p className="whitespace-pre-wrap text-ink/75">{selected.description_text || "—"}</p></div>
              <InfoGrid selected={selected} />
              {selected.main_pain_points?.length ? <TagGroup title="Pain points" values={selected.main_pain_points} /> : null}
              {selected.current_systems?.length ? <TagGroup title="Current systems" values={selected.current_systems} /> : null}
              {selected.success_metrics?.length ? <TagGroup title="Success metrics" values={selected.success_metrics} /> : null}
              <div className="border-t-2 border-ink/10 pt-4"><p className="mb-2 font-semibold">Move request</p><div className="flex flex-wrap gap-2">{statuses.slice(0, 8).map((s) => <Button key={s} size="sm" variant={selected.status === s ? "default" : "outline"} disabled={saving} onClick={() => updateStatus(s)}>{label(s)}</Button>)}</div></div>
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Draft scope</CardTitle><CardDescription>Create or update the scope document for this request.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Objectives</Label><Textarea value={objectives} onChange={(e) => setObjectives(e.target.value)} placeholder="One objective per line" /></div><div className="space-y-2"><Label>Functional requirements</Label><Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="One requirement per line" /></div><div className="space-y-2"><Label>Out of scope</Label><Textarea value={outOfScope} onChange={(e) => setOutOfScope(e.target.value)} placeholder="One item per line" /></div>{message && <p className="text-sm text-ink/60">{message}</p>}<Button onClick={saveScope} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save scope & move to Scoping</Button></CardContent></Card>
          </>}</div>
        </div>}
    </main>
  </div>
}

function InfoGrid({ selected }: { selected: RequestRow }) { return <div className="grid gap-3 sm:grid-cols-2"><Info label="Company size" value={selected.company_size} /><Info label="Timeline" value={selected.timeline} /><Info label="Budget" value={selected.budget_min || selected.budget_max ? `${selected.budget_min ?? "?"} – ${selected.budget_max ?? "?"} ${selected.currency || "USD"}` : null} /><Info label="Priority" value={selected.priority ? `${selected.priority}/5` : null} /></div> }
function Info({ label, value }: { label: string; value: string | number | null | undefined }) { return <div className="rounded-2xl bg-ink/5 p-3"><p className="text-xs text-ink/50">{label}</p><p className="mt-1 font-medium">{value || "—"}</p></div> }
function TagGroup({ title, values }: { title: string; values: string[] }) { return <div><p className="mb-2 font-semibold">{title}</p><div className="flex flex-wrap gap-1.5">{values.map((v) => <Badge key={v} variant="secondary">{v}</Badge>)}</div></div> }
