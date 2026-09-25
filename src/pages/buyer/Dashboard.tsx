import { Link } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react"

const mockRequests = [
  {
    id: "req-001",
    title: "Custom CRM for Sales Team",
    status: "scoping",
    created: "2026-09-20",
    budget: "$15k–25k",
  },
  {
    id: "req-002",
    title: "Odoo ERP Implementation",
    status: "rfq_sent",
    created: "2026-09-18",
    budget: "$20k–35k",
  },
  {
    id: "req-003",
    title: "Mobile App (React Native)",
    status: "shortlisted",
    created: "2026-09-10",
    budget: "$28k–40k",
  },
  {
    id: "req-004",
    title: "Website Redesign + SEO",
    status: "won",
    created: "2026-08-22",
    budget: "$8k–12k",
  },
]

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "success" | "outline" | "destructive" }> = {
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
}

export default function BuyerDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">My Requests</h1>
            <p className="text-muted-foreground mt-1">Track and manage your tech procurement requests</p>
          </div>
          <Button asChild className="glow">
            <Link to="/request">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockRequests.length}</p>
                <p className="text-xs text-muted-foreground">Total Requests</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Requests</CardTitle>
            <CardDescription>Click any request to view details and proposals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockRequests.map((req) => {
              const status = statusMap[req.status] || { label: req.status, variant: "outline" as const }
              return (
                <Link
                  key={req.id}
                  to={`/buyer/requests/${req.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border bg-card hover:bg-muted/40 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <span className="text-xs text-muted-foreground">{req.created}</span>
                    </div>
                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                      {req.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Budget: {req.budget}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </Link>
              )
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
