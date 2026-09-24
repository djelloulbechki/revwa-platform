import { Navbar } from "@/components/layout/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, FileText, TrendingUp, Clock } from "lucide-react"

const mockOpportunities = [
  { id: "RFQ-2026-0847", title: "Custom Odoo Implementation", budget: "$12k–18k", deadline: "5 days", status: "new" },
  { id: "RFQ-2026-0832", title: "React Native Mobile App", budget: "$25k–35k", deadline: "8 days", status: "viewed" },
  { id: "RFQ-2026-0819", title: "RPA Process Automation", budget: "$8k–12k", deadline: "3 days", status: "new" },
]

export default function VendorDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">Vendor Portal</h1>
          <p className="text-muted-foreground mt-1">Qualified opportunities only. No public directory.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Open RFQs", value: "3", icon: Briefcase },
            { label: "Submitted", value: "7", icon: FileText },
            { label: "Win rate", value: "28%", icon: TrendingUp },
            { label: "Avg response", value: "1.4d", icon: Clock },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Open Opportunities</CardTitle>
            <CardDescription>Anonymous RFQs matched to your specialties</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockOpportunities.map((opp) => (
              <div key={opp.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">{opp.id}</span>
                    {opp.status === "new" && <Badge variant="success">New</Badge>}
                  </div>
                  <h3 className="font-semibold">{opp.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Budget: {opp.budget} · Deadline: {opp.deadline}
                  </p>
                </div>
                <Button>View & Bid</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
