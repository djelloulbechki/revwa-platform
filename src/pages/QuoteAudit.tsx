import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileSearch } from "lucide-react"

export default function QuoteAudit() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Quote submitted for free audit! (Connect Supabase)")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 text-primary mb-4">
            <FileSearch className="h-7 w-7" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Free Quote Audit</h1>
          <p className="mt-2 text-muted-foreground">
            Already have a quote? Upload it and we’ll tell you if it’s fair — for free.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload existing quote</CardTitle>
            <CardDescription>
              PDF, image, or just paste the text. Completely confidential.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Quote file (optional)</Label>
                <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click or drag PDF / image here</p>
                  <Input type="file" className="hidden" accept=".pdf,image/*" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Or paste quote text</Label>
                <Textarea placeholder="Paste the quote details here..." className="min-h-[120px]" />
              </div>

              <div className="space-y-2">
                <Label>Quoted amount (if known)</Label>
                <Input type="number" placeholder="e.g. 18000" />
              </div>

              <div className="space-y-2">
                <Label>Brief project description</Label>
                <Textarea placeholder="What is this quote for?" className="min-h-[80px]" />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Get Free Audit
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
