import { useState } from "react"
import { Link } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSearch, ArrowRight } from "lucide-react"

export default function QuoteAudit() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper font-body text-ink">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16 md:px-10">
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-ink/10 bg-card px-4 py-1.5 text-sm font-medium text-ink/70">
            <FileSearch className="h-4 w-4 text-pop" />
            Quote audit
          </div>
          <h1 className="font-display text-[clamp(1.8rem,4vw,2.75rem)] uppercase leading-tight">
            Audit an existing <span className="text-pop">quote</span>
          </h1>
          <p className="mt-3 max-w-lg text-ink/70">
            Upload or paste a vendor quote. We&apos;ll flag vague scope, inflated pricing, and missing requirements.
          </p>
        </div>

        {submitted ? (
          <Card className="border-pop/30 bg-pop/5">
            <CardHeader>
              <CardTitle className="text-xl normal-case tracking-normal">Request received</CardTitle>
              <CardDescription>
                Our team will review your quote and get back within 1–2 business days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/">Back home →</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl normal-case tracking-normal">Quote details</CardTitle>
              <CardDescription>Share what you have — PDF link, text, or summary.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Acme Corp" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input id="email" type="email" placeholder="you@company.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor name</Label>
                  <Input id="vendor" placeholder="Vendor / provider name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="details">Quote summary or paste</Label>
                  <Textarea
                    id="details"
                    rows={6}
                    placeholder="Paste key line items, total, scope notes…"
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Submit for audit
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
