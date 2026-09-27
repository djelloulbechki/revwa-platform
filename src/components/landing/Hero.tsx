import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Users, Building2 } from "lucide-react"
import heroVisual from "@/assets/services/workflow-automation.png"
import { useLanguage } from "@/i18n/LanguageContext"

export function Hero() {
  const { t, isRtl } = useLanguage()

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-pop/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-40 size-64 rounded-full bg-sun/20 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-6 py-14 md:px-10 md:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-ink/10 bg-card px-4 py-1.5 text-sm font-bold text-ink/70 shadow-sm">
              <Sparkles className="h-4 w-4 text-pop" />
              {t("hero_badge")}
            </div>

            <h1 className="font-display text-[clamp(2.4rem,6vw,4.25rem)] leading-[0.95] tracking-tight text-ink md:uppercase">
              {t("hero_title_1")}{" "}
              <span className="text-gradient">{t("hero_title_2")}</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
              {t("hero_desc")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="xl">
                <Link to="/request">
                  {t("hero_cta_primary")}
                  <ArrowRight className={`h-5 w-5 ${isRtl ? "mr-1 rotate-180" : "ml-1"}`} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <a href="#services">{t("hero_cta_secondary")}</a>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-sun px-4 py-2 text-sm font-bold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.12)]">
                <Users className="h-4 w-4" /> {t("hero_chip_individuals")}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-sky px-4 py-2 text-sm font-bold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.12)]">
                <Building2 className="h-4 w-4" /> {t("hero_chip_companies")}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-pop px-4 py-2 text-sm font-bold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.12)]">
                <Sparkles className="h-4 w-4" /> {t("hero_chip_free")}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-pop/40 via-sun/30 to-mint/20 opacity-60 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border-2 border-ink/10 bg-ink shadow-[0_16px_0_0_rgba(0,0,0,0.15)]">
              <img
                src={heroVisual}
                alt={t("hero_img_alt")}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
