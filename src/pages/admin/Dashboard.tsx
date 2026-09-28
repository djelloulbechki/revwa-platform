import { useEffect, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"

type RequestRow = {
  id: string
  title: string | null
  status: string
  priority: number | null
  contact_email: string | null
  created_at: string
}

type VendorRow = {
  organization_id: string
  onboarding_status: string
  organizations: { name: string; country_code: string | null } | null
}

const requestStatuses = ["submitted", "under_review", "scoping", "rfq_sent", "proposals_received"]

function statusLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function statusClass(value: string) {
  if (value === "submitted" || value === "under_review") return "bg-amber-100 text-amber-900"
  if (value === "scoping") return "bg-blue-100 text-blue-900"
  if (value === "qualified" || value === "approved") return "bg-emerald-100 text-emerald-900"
  if (value === "rejected") return "bg-red-100 text-red-900"
  return "bg-ink/5 text-ink"
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth()
  const [requests, setRequests] = useState<RequestRow[]>([])
  const [vendors, setVendors] = useState<VendorRow[]>([])
  const [requestTotal, setRequestTotal] = useState(0)
  const [vendorTotal, setVendorTotal] = useState(0)
  const [requestQueueTotal, setRequestQueueTotal] = useState(0)
  const [vendorReviewTotal, setVendorReviewTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async () => {
    if (!user) return
    setLoading(true)
    setError("")

    const [requestCount, vendorCount, queueCount, reviewCount, recentRequests, recentVendors] = await Promise.all([
      supabase.from("project_requests").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabase.from("vendor_profiles").select("organization_id", { count: "exact", head: true }),
      supabase.from("project_requests").select("id", { count: "exact", head: true }).is("deleted_at", null).in("status", ["submitted", "under_review"]),
      supabase.from("vendor_profiles").select("organization_id", { count: "exact", head: true }).eq("onboarding_status", "under_review"),
      supabase
        .from("project_requests")
        .select("id, title, status, priority, contact_email, created_at")
        .is("deleted_at", null)
        .in("status", requestStatuses)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("vendor_profiles")
        .select("organization_id, onboarding_status, organizations(name, country_code)")
        .order("updated_at", { ascending: false })
        .limit(6),
    ])

    const firstError = requestCount.error || vendorCount.error || queueCount.error || reviewCount.error || recentRequests.error || recentVendors.error
    if (firstError) setError(firstError.message)
    setRequestTotal(requestCount.count ?? 0)
    setVendorTotal(vendorCount.count ?? 0)
    setRequestQueueTotal(queueCount.count ?? 0)
    setVendorReviewTotal(reviewCount.count ?? 0)
    setRequests((recentRequests.data as RequestRow[]) || [])
    setVendors((recentVendors.data as unknown as VendorRow[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    if (!authLoading && user) load()
  }, [authLoading, user])

  return (
    <div className="flex min-h-screen flex-col bg-paper font-body text-ink">
      <Navbar />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-10 md:px-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-pop">REVWA Platform</p>
            <h1 className="font-display text-4xl font-bold">Admin overview</h1>
            <p className="mt-2 max-w-2xl text-ink/60">
              Monitor work requests, partner applications, scoping and the commercial pipeline from one place.
            </p>
          </div>
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="mb-6 flex gap-2 rounded-2xl border-2 border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading || authLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-pop" /></div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard title="Work requests" value={requestTotal} icon={<BriefcaseBusiness className="h-5 w-5" />} href="/admin/requests" />
              <StatCard title="Partner companies" value={vendorTotal} icon={<Building2 className="h-5 w-5" />} href="/admin/vendors" />
              <StatCard title="Requests in queue" value={requestQueueTotal} icon={<Clock3 className="h-5 w-5" />} href="/admin/requests" />
              <StatCard title="Partners under review" value={vendorReviewTotal} icon={<ShieldCheck className="h-5 w-5" />} href="/admin/vendors" />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-5">
              <Card className="lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Recent work requests</CardTitle>
                  <Button asChild variant="outline" size="sm"><Link to="/admin/requests">View all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {requests.length === 0 ? <Empty text="No active work requests." /> : requests.map((r) => (
                    <Link key={r.id} to={`/admin/requests/${r.id}`} className="block rounded-2xl border-2 border-ink/10 p-4 transition hover:border-primary/30 hover:bg-pop/5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{r.title || "Untitled work request"}</p>
                          <p className="mt-1 truncate text-xs text-ink/55">{r.contact_email || "No contact email"} · {new Date(r.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge className={statusClass(r.status)}>{statusLabel(r.status)}</Badge>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Partner applications</CardTitle>
                  <Button asChild variant="outline" size="sm"><Link to="/admin/vendors">View all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {vendors.length === 0 ? <Empty text="No partner applications." /> : vendors.map((v) => (
                    <div key={v.organization_id} className="rounded-2xl border-2 border-ink/10 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{v.organizations?.name || "Company"}</p>
                          <p className="mt-1 text-xs text-ink/55">{v.organizations?.country_code || "Country not provided"}</p>
                        </div>
                        <Badge className={statusClass(v.onboarding_status)}>{statusLabel(v.onboarding_status)}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <QuickLink href="/admin/requests" icon={<BriefcaseBusiness />} title="Work Requests" text="Review intake, update status and create scope documents." />
              <QuickLink href="/admin/vendors" icon={<Building2 />} title="Partners" text="Review companies, approve or qualify vendors." />
              <QuickLink href="/admin/scoping" icon={<CheckCircle2 />} title="Scoping" text="Continue detailed scope work on active requests." />
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function StatCard({ title, value, icon, href }: { title: string; value: number; icon: ReactNode; href: string }) {
  return <Link to={href} className="group rounded-3xl border-2 border-ink/10 bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30">
    <div className="flex items-center justify-between"><span className="rounded-xl bg-pop/10 p-2 text-pop">{icon}</span><ArrowRight className="h-4 w-4 text-ink/30 transition group-hover:text-pop" /></div>
    <p className="mt-5 text-sm text-ink/55">{title}</p><p className="mt-1 text-3xl font-bold">{value}</p>
  </Link>
}

function QuickLink({ href, icon, title, text }: { href: string; icon: ReactNode; title: string; text: string }) {
  return <Link to={href} className="rounded-3xl border-2 border-ink/10 bg-card p-5 transition hover:border-primary/30"><div className="mb-3 text-pop">{icon}</div><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-ink/55">{text}</p></Link>
}

function Empty({ text }: { text: string }) { return <div className="rounded-2xl border-2 border-dashed border-ink/10 p-8 text-center text-sm text-ink/50">{text}</div> }
