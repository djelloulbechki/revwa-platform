import { User, Building2, Check } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageContext"

export function Audience() {
  const { t } = useLanguage()

  const individuals = [
    t("audience_ind_1"),
    t("audience_ind_2"),
    t("audience_ind_3"),
    t("audience_ind_4"),
  ]
  const companies = [
    t("audience_co_1"),
    t("audience_co_2"),
    t("audience_co_3"),
    t("audience_co_4"),
  ]

  return (
    <section className="border-t-2 border-ink/10 bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-sun">
            {t("audience_eyebrow")}
          </p>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3.25rem)] leading-[0.95] md:uppercase">
            {t("audience_title_1")}{" "}
            <span className="text-sun">{t("audience_title_2")}</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-sun p-8 text-white shadow-[0_12px_0_0_rgba(0,0,0,0.2)] md:p-10">
            <div className="pointer-events-none absolute -right-10 top-0 size-40 rounded-full bg-white/15" />
            <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-white/20">
              <User className="h-7 w-7" />
            </div>
            <h3 className="font-display text-2xl md:uppercase">{t("audience_ind_title")}</h3>
            <p className="mt-2 text-white/90">{t("audience_ind_desc")}</p>
            <ul className="mt-6 space-y-3">
              {individuals.map((item) => (
                <li key={item} className="flex items-center gap-3 font-medium">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/25">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-pop p-8 text-white shadow-[0_12px_0_0_rgba(0,0,0,0.2)] md:p-10">
            <div className="pointer-events-none absolute -right-10 top-0 size-40 rounded-full bg-white/10" />
            <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-white/20">
              <Building2 className="h-7 w-7" />
            </div>
            <h3 className="font-display text-2xl md:uppercase">{t("audience_co_title")}</h3>
            <p className="mt-2 text-white/90">{t("audience_co_desc")}</p>
            <ul className="mt-6 space-y-3">
              {companies.map((item) => (
                <li key={item} className="flex items-center gap-3 font-medium">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/25">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
