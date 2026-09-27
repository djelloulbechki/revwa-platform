import { useState } from "react"
import { Link } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSearch, ArrowRight } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageContext"

export default function QuoteAudit() {
  const [submitted, setSubmitted] = useState(false)
  const { t, isRtl } = useLanguage()

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
            {t("qa_badge")}
          </div>
          <h1 className="font-display text-[clamp(1.8rem,4vw,2.75rem)] leading-tight md:uppercase">
            {t("qa_title_1")} <span className="text-pop">{t("qa_title_2")}</span>
          </h1>
          <p className="mt-3 max-w-lg text-ink/70">{t("qa_desc")}</p>
        </div>

        {submitted ? (
          <Card className="border-pop/30 bg-pop/5">
            <CardHeader>
              <CardTitle className="text-xl normal-case tracking-normal">
                {t("qa_received")}
              </CardTitle>
              <CardDescription>{t("qa_received_desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/">{t("qa_back")}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl normal-case tracking-normal">
                {t("qa_form_title")}
              </CardTitle>
              <CardDescription>{t("qa_form_desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="company">{t("qa_company")}</Label>
                  <Input id="company" placeholder="Acme Corp" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("qa_email")}</Label>
                  <Input id="email" type="email" placeholder="you@company.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">{t("qa_vendor")}</Label>
                  <Input id="vendor" placeholder="Vendor / provider name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="details">{t("qa_details")}</Label>
                  <Textarea id="details" rows={6} required />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  {t("qa_submit")}
                  <ArrowRight className={`h-4 w-4 ${isRtl ? "mr-1 rotate-180" : "ml-1"}`} />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
