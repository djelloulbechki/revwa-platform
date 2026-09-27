import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
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
import { Loader2, Building2 } from "lucide-react"

type Row = {
  organization_id: string
  onboarding_status: string
  specialties: string[] | null
  contact_email: string | null
  organizations: { name: string; country_code: string | null; website: string | null } | null
}

export default function AdminVendors() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState("")

  const load = async () => {
    setLoading(true)
    setError("")
    const { data, error: err } = await supabase
      .from("vendor_profiles")
      .select(
        "organization_id, onboarding_status, specialties, contact_email, organizations(name, country_code, website)"
      )
      .order("updated_at", { ascending: false })
    if (err) setError(err.message)
    else setRows((data as unknown as Row[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const setStatus = async (
    orgId: string,
    status: "under_review" | "approved" | "qualified" | "rejected"
  ) => {
    setBusy(orgId + status)
    const { data, error: err } = await supabase.rpc("set_vendor_onboarding_status", {
      p_organization_id: orgId,
      p_status: status,
      p_notes: null,
    })
    setBusy(null)
    if (err) {
      setError(err.message)
      return
    }
    if (data && (data as any).ok === false) {
      setError((data as any).reason || "Update failed — need platform admin role")
      return
    }
    await load()
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper font-body text-ink">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 md:px-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-pop">Admin</p>
            <h1 className="font-display text-3xl md:uppercase">Vendor review</h1>
            <p className="mt-1 text-ink/60">
              under_review → approved → qualified (bidding)
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/scoping">Scoping</Link>
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border-2 border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-pop" />
          </div>
        ) : rows.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-ink/60">
              No vendor profiles yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {rows.map((r) => (
              <Card key={r.organization_id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                  <div className="flex gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-pop/10 text-pop">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg normal-case tracking-normal">
                        {r.organizations?.name ?? "Company"}
                      </CardTitle>
                      <CardDescription>
                        {r.organizations?.country_code ?? "—"}
                        {r.contact_email ? ` · ${r.contact_email}` : ""}
                        {r.organizations?.website ? ` · ${r.organizations.website}` : ""}
                      </CardDescription>
                      {r.specialties && r.specialties.length > 0 && (
                        <p className="mt-1 text-xs text-ink/50">
                          {r.specialties.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary">{r.onboarding_status}</Badge>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy !== null}
                    onClick={() => setStatus(r.organization_id, "under_review")}
                  >
                    Under review
                  </Button>
                  <Button
                    size="sm"
                    disabled={busy !== null}
                    onClick={() => setStatus(r.organization_id, "approved")}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    className="bg-mint hover:bg-mint/90"
                    disabled={busy !== null}
                    onClick={() => setStatus(r.organization_id, "qualified")}
                  >
                    Qualify (can bid)
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={busy !== null}
                    onClick={() => setStatus(r.organization_id, "rejected")}
                  >
                    Reject
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
