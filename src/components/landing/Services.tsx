import workflowImg from "@/assets/services/workflow-automation.png"
import salesImg from "@/assets/services/sales-growth.jpg"
import aiImg from "@/assets/services/ai-solutions.jpg"
import businessImg from "@/assets/services/business-systems.jpg"
import cloudImg from "@/assets/services/cloud-infra.jpg"
import connectImg from "@/assets/services/connect-services.png"
import { useLanguage } from "@/i18n/LanguageContext"
import type { TranslationKey } from "@/i18n/translations"

type BlockDef = {
  id: string
  img: string
  reverse?: boolean
  accent: string
  badge: string
  eyebrow: TranslationKey
  title: TranslationKey
  desc: TranslationKey
  p1: TranslationKey
  p2: TranslationKey
  p3: TranslationKey
}

const blocks: BlockDef[] = [
  {
    id: "social",
    img: workflowImg,
    accent: "from-sun to-rose-500",
    badge: "bg-sun",
    eyebrow: "s1_eyebrow",
    title: "s1_title",
    desc: "s1_desc",
    p1: "s1_p1",
    p2: "s1_p2",
    p3: "s1_p3",
  },
  {
    id: "sales",
    img: salesImg,
    reverse: true,
    accent: "from-sky to-pop",
    badge: "bg-sky",
    eyebrow: "s2_eyebrow",
    title: "s2_title",
    desc: "s2_desc",
    p1: "s2_p1",
    p2: "s2_p2",
    p3: "s2_p3",
  },
  {
    id: "ai",
    img: aiImg,
    accent: "from-pop to-vio",
    badge: "bg-pop",
    eyebrow: "s3_eyebrow",
    title: "s3_title",
    desc: "s3_desc",
    p1: "s3_p1",
    p2: "s3_p2",
    p3: "s3_p3",
  },
  {
    id: "systems",
    img: businessImg,
    reverse: true,
    accent: "from-mint to-pop",
    badge: "bg-mint",
    eyebrow: "s4_eyebrow",
    title: "s4_title",
    desc: "s4_desc",
    p1: "s4_p1",
    p2: "s4_p2",
    p3: "s4_p3",
  },
  {
    id: "cloud",
    img: cloudImg,
    accent: "from-sky to-sun",
    badge: "bg-sky",
    eyebrow: "s5_eyebrow",
    title: "s5_title",
    desc: "s5_desc",
    p1: "s5_p1",
    p2: "s5_p2",
    p3: "s5_p3",
  },
  {
    id: "connect",
    img: connectImg,
    reverse: true,
    accent: "from-pop to-mint",
    badge: "bg-pop",
    eyebrow: "s6_eyebrow",
    title: "s6_title",
    desc: "s6_desc",
    p1: "s6_p1",
    p2: "s6_p2",
    p3: "s6_p3",
  },
]

export function Services() {
  const { t, isRtl } = useLanguage()

  return (
    <section id="services" className="relative border-t-2 border-ink/10">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-pop">
            {t("services_eyebrow")}
          </p>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3.25rem)] leading-[0.95] text-ink md:uppercase">
            {t("services_title_1")}{" "}
            <span className="text-sun">{t("services_title_2")}</span>
          </h2>
          <p className="mt-4 text-lg text-ink/70">{t("services_intro")}</p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {blocks.map((b) => (
            <article
              key={b.id}
              id={b.id}
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                b.reverse ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative">
                <div
                  className={`absolute -inset-3 rounded-[2rem] bg-gradient-to-br ${b.accent} opacity-30 blur-2xl`}
                />
                <div className="relative overflow-hidden rounded-3xl border-2 border-ink/10 bg-ink shadow-[0_16px_0_0_rgba(0,0,0,0.12)]">
                  <img
                    src={b.img}
                    alt={t(b.title)}
                    className="h-auto w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              <div>
                <span
                  className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide text-white ${b.badge}`}
                >
                  {t(b.eyebrow)}
                </span>
                <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight text-ink md:uppercase">
                  {t(b.title)}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-ink/70 md:text-lg">
                  {t(b.desc)}
                </p>
                <ul className="mt-6 space-y-3">
                  {[b.p1, b.p2, b.p3].map((key) => (
                    <li key={key} className="flex items-center gap-3 font-medium text-ink">
                      <span className={`size-2.5 shrink-0 rounded-full ${b.badge}`} />
                      {t(key)}
                    </li>
                  ))}
                </ul>
                <a
                  href="/request"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-pop underline decoration-2 underline-offset-4 hover:text-sky"
                >
                  {t("services_request")}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
