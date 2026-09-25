import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Send, CheckCircle, Clock, AlertCircle } from "lucide-react"

const pendingRequests = [
  {
    id: "req-101",
    title: "Warehouse Management System",
    company: "Logistics Co.",
    size: "51-200",
    budget: "$30k–50k",
    submitted: "2 hours ago",
    priority: 1,
  },
  {
    id: "req-102",
    title: "HR Portal + Payroll Integration",
    company: "Retail Group",
    size: "201-500",
    budget: "$18k–28k",
    submitted: "5 hours ago",
    priority: 2,
  },
  {
    id: "req-103",
    title: "AI Chatbot for Customer Support",
    company: "Fintech Startup",
    size: "11-50",
    budget: "$8k–15k",
    submitted: "1 day ago",
    priority: 3,
  },
]

export default function AdminScoping() {
  const [selected, setSelected] = useState(pendingRequests[0])
  const [objectives, setObjectives] = useState("")
  const [requirements, setRequirements] = useState("")
  const [outOfScope, setOutOfScope] = useState("")

  const handleCreateScope = () => {
    alert("Scope document created and ready for RFQ distribution.")
  }

  const handleSendRFQ = () => {
    alert("Anonymous RFQ sent to matched vendors.")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">Admin — Scoping Desk</h1>
          <p className="text-muted-foreground mt-1">
            Review intakes, create technical scopes, and distribute RFQs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Queue */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Pending Queue</CardTitle>
              <CardDescription>{pendingRequests.length} requests awaiting scope</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingRequests.map((req) => (
                <button
                  key={req.id}
                  onClick={() => setSelected(req)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    selected.id === req.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant={req.priority === 1 ? "destructive" : "outline"}>
                      P{req.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{req.submitted}</span>
                  </div>
                  <h3 className="font-semibold text-sm truncate">{req.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {req.company} · {req.size}
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Right: Scoping Workspace */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{selected.title}</CardTitle>
                  <CardDescription>
                    {selected.company} · {selected.budget} · {selected.size}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="shrink-0">
                  <Clock className="mr-1 h-3 w-3" />
                  Awaiting Scope
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="scope">
                <TabsList className="mb-4">
                  <TabsTrigger value="scope">Create Scope</TabsTrigger>
                  <TabsTrigger value="intake">Original Intake</TabsTrigger>
                </TabsList>

                <TabsContent value="scope" className="space-y-5">
                  <div className="space-y-2">
                    <Label>Objectives</Label>
                    <Textarea
                      placeholder="What success looks like for the client..."
                      value={objectives}
                      onChange={(e) => setObjectives(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Functional Requirements</Label>
                    <Textarea
                      placeholder="- Feature 1&#10;- Feature 2&#10;- Integration with X..."
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Out of Scope</Label>
                    <Textarea
                      placeholder="What is explicitly excluded..."
                      value={outOfScope}
                      onChange={(e) => setOutOfScope(e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Est. Timeline (days)</Label>
                      <Input type="number" placeholder="45" />
                    </div>
                    <div className="space-y-2">
                      <Label>Suggested Budget Range</Label>
                      <Input placeholder="$20k – $30k" />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button onClick={handleCreateScope} className="flex-1">
                      <FileText className="mr-2 h-4 w-4" />
                      Save Scope Document
                    </Button>
                    <Button onClick={handleSendRFQ} variant="secondary" className="flex-1">
                      <Send className="mr-2 h-4 w-4" />
                      Send Anonymous RFQ
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="intake">
                  <div className="rounded-xl border bg-muted/30 p-5 space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="text-muted-foreground mt-1">
                        We need a system to manage our warehouse inventory, track inbound/outbound shipments, and integrate with our existing accounting software. Currently using Excel and paper forms which causes frequent errors.
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Current systems:</span>
                      <p className="text-muted-foreground mt-1">Excel, QuickBooks, WhatsApp groups</p>
                    </div>
                    <div>
                      <span className="font-medium">Success metrics:</span>
                      <p className="text-muted-foreground mt-1">Reduce stock discrepancies by 80%, cut order processing time in half</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Awaiting Scope</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xl font-bold">5</p>
                <p className="text-xs text-muted-foreground">RFQs Open</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Closed this month</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
