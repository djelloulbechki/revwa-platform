import { useParams, Link } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Users, CheckCircle } from "lucide-react"

const mockProposals = [
  { id: "p1", vendor: "Vendor A", price: "$18,500", duration: "45 days", rank: 1, recommended: true },
  { id: "p2", vendor: "Vendor B", price: "$21,200", duration: "38 days", rank: 2, recommended: false },
  { id: "p3", vendor: "Vendor C", price: "$16,900", duration: "60 days", rank: 3, recommended: false },
]

export default function RequestDetails() {
  const { id } = useParams()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-5xl">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to="/buyer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge>Shortlisted</Badge>
              <span className="text-sm text-muted-foreground">ID: {id}</span>
            </div>
            <h1 className="font-heading text-3xl font-bold">Custom CRM for Sales Team</h1>
            <p className="text-muted-foreground mt-1">Created on Sep 20, 2026 · Budget $15k–25k</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Scope Document
              </CardTitle>
              <CardDescription>Technical requirements prepared by REVWA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Objectives</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Replace current spreadsheet-based sales tracking</li>
                  <li>Integrate with existing email and calendar</li>
                  <li>Provide real-time pipeline visibility for managers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Key Requirements</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Contact & deal management</li>
                  <li>Custom pipelines and stages</li>
                  <li>Role-based access (sales, managers, admin)</li>
                  <li>Mobile-responsive web app</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Out of Scope</h4>
                <p className="text-muted-foreground">Marketing automation, full ERP modules, native mobile apps.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-muted space-y-6 ml-2">
                {[
                  { label: "Submitted", done: true },
                  { label: "Scope created", done: true },
                  { label: "RFQ sent", done: true },
                  { label: "Proposals received", done: true },
                  { label: "Shortlisted", done: true },
                  { label: "Final selection", done: false },
                ].map((step, i) => (
                  <li key={i} className="ml-4">
                    <span className={`absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full ${step.done ? "bg-primary" : "bg-muted"}`} />
                    <p className={`text-sm ${step.done ? "font-medium" : "text-muted-foreground"}`}>{step.label}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Shortlisted Proposals
            </CardTitle>
            <CardDescription>Top 3 proposals selected by REVWA for your review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockProposals.map((p) => (
              <div
                key={p.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border ${
                  p.recommended ? "border-primary/40 bg-primary/5" : "bg-card"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">#{p.rank} — {p.vendor}</span>
                    {p.recommended && (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle className="h-3 w-3" /> Recommended
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {p.price} · Estimated {p.duration}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm">Select</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
