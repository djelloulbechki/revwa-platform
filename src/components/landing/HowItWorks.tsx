import { useLanguage } from "@/i18n/LanguageContext"
import type { TranslationKey } from "@/i18n/translations"

const steps: { n: string; title: TranslationKey; desc: TranslationKey; className: string }[] = [
  { n: "01", title: "how_1_title", desc: "how_1_desc", className: "bg-sun text-white" },
  { n: "02", title: "how_2_title", desc: "how_2_desc", className: "bg-sky text-white" },
  { n: "03", title: "how_3_title", desc: "how_3_desc", className: "bg-pop text-white" },
  { n: "04", title: "how_4_title", desc: "how_4_desc", className: "bg-mint text-white" },
]

export function HowItWorks() {
  const { t } = useLanguage()

  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-[1440px] border-t-2 border-ink/10 px-6 py-16 md:px-10 md:py-24"
    >
      <div className="mb-12 max-w-2xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-pop">
          {t("how_eyebrow")}
        </p>
        <h2 className="font-display text-[clamp(1.9rem,4.5vw,3.25rem)] leading-[0.95] text-ink md:uppercase">
          {t("how_title_1")}{" "}
          <span className="text-pop">{t("how_title_2")}</span>
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div
            key={s.n}
            className={`relative overflow-hidden rounded-3xl p-7 shadow-[0_10px_0_0_rgba(0,0,0,0.12)] ${s.className}`}
          >
            <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-white/10" />
            <span className="font-display text-5xl opacity-35">{s.n}</span>
            <h3 className="mb-2 mt-3 font-display text-xl leading-tight md:uppercase">
              {t(s.title)}
            </h3>
            <p className="leading-relaxed text-white/90">{t(s.desc)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
