import { EyeOff, FileCheck2, HeartHandshake, Zap } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageContext"
import type { TranslationKey } from "@/i18n/translations"

const reasons: {
  icon: typeof Zap
  title: TranslationKey
  desc: TranslationKey
  color: string
  bg: string
}[] = [
  {
    icon: FileCheck2,
    title: "why_1_title",
    desc: "why_1_desc",
    color: "text-sun",
    bg: "bg-sun/10",
  },
  {
    icon: EyeOff,
    title: "why_2_title",
    desc: "why_2_desc",
    color: "text-pop",
    bg: "bg-pop/10",
  },
  {
    icon: HeartHandshake,
    title: "why_3_title",
    desc: "why_3_desc",
    color: "text-mint",
    bg: "bg-mint/10",
  },
  {
    icon: Zap,
    title: "why_4_title",
    desc: "why_4_desc",
    color: "text-vio",
    bg: "bg-vio/10",
  },
]

export function WhyRevwa() {
  const { t } = useLanguage()

  return (
    <section className="border-t-2 border-ink/10">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-pop">
            {t("why_eyebrow")}
          </p>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3.25rem)] leading-[0.95] text-ink md:uppercase">
            {t("why_title_1")}{" "}
            <span className="text-gradient">{t("why_title_2")}</span>
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="rounded-3xl border-2 border-ink/10 bg-card p-6 shadow-[0_8px_0_0_rgba(0,0,0,0.06)]"
            >
              <div
                className={`mb-4 flex size-12 items-center justify-center rounded-2xl ${r.bg} ${r.color}`}
              >
                <r.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg md:uppercase">{t(r.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{t(r.desc)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
