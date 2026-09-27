import workflowImg from "@/assets/services/workflow-automation.png"
import salesImg from "@/assets/services/sales-growth.jpg"
import aiImg from "@/assets/services/ai-solutions.jpg"
import businessImg from "@/assets/services/business-systems.jpg"
import cloudImg from "@/assets/services/cloud-infra.jpg"
import connectImg from "@/assets/services/connect-services.png"

type ServiceBlock = {
  id: string
  eyebrow: string
  title: string
  desc: string
  points: string[]
  img: string
  reverse?: boolean
  accent: string
  badge: string
}

const blocks: ServiceBlock[] = [
  {
    id: "social",
    eyebrow: "01 · Social & workflows",
    title: "Social media automation",
    desc: "Connect Instagram, WhatsApp, TikTok, LinkedIn and more into one smooth flow — so posting and replies stop eating your day.",
    points: ["Cross-platform workflows", "Fewer manual steps", "Built for creators & teams"],
    img: workflowImg,
    accent: "from-sun to-rose-500",
    badge: "bg-sun",
  },
  {
    id: "sales",
    eyebrow: "02 · Growth",
    title: "Sales & marketing automation",
    desc: "Lead gen, SEO, support, and sales growth — structured so the right partner can execute without vague briefs.",
    points: ["Sales pipelines", "Lead gen & marketing", "Support & SEO"],
    img: salesImg,
    reverse: true,
    accent: "from-sky to-pop",
    badge: "bg-sky",
  },
  {
    id: "ai",
    eyebrow: "03 · Intelligence",
    title: "AI solutions",
    desc: "Chatbots, voice AI, document AI, and analytics — matched to specialists who ship usable systems, not demos.",
    points: ["AI chatbots", "Voice & document AI", "Analytics that help"],
    img: aiImg,
    accent: "from-pop to-vio",
    badge: "bg-pop",
  },
  {
    id: "systems",
    eyebrow: "04 · Operations",
    title: "Business systems",
    desc: "ERP, CRM, HR, finance, inventory, booking — the systems that run the company, scoped clearly before anyone quotes.",
    points: ["CRM & finance", "HR & inventory", "Booking & helpdesk"],
    img: businessImg,
    reverse: true,
    accent: "from-mint to-pop",
    badge: "bg-mint",
  },
  {
    id: "cloud",
    eyebrow: "05 · Infrastructure",
    title: "Cloud & infrastructure",
    desc: "Servers, DevOps, databases, backup — reliable foundations when you need more than a landing page.",
    points: ["Cloud & servers", "DevOps & databases", "Backup & security"],
    img: cloudImg,
    accent: "from-sky to-sun",
    badge: "bg-sky",
  },
  {
    id: "connect",
    eyebrow: "06 · Integrations",
    title: "APIs & connected services",
    desc: "Payments, webhooks, platforms — wire your tools together so data flows without spreadsheet chaos.",
    points: ["API hubs", "Payment gateways", "Webhook data flow"],
    img: connectImg,
    reverse: true,
    accent: "from-pop to-mint",
    badge: "bg-pop",
  },
]

export function Services() {
  return (
    <section id="services" className="relative border-t-2 border-ink/10">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-pop">
            Services you can request
          </p>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3.25rem)] uppercase leading-[0.95] text-ink">
            See it. Understand it.{" "}
            <span className="text-sun">Request it.</span>
          </h2>
          <p className="mt-4 text-lg text-ink/70">
            From social automation to cloud — each lane is visual on purpose, so anyone
            (solo or company) knows what REVWA can match for them.
          </p>
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
              {/* Visual */}
              <div className="relative">
                <div
                  className={`absolute -inset-3 rounded-[2rem] bg-gradient-to-br ${b.accent} opacity-30 blur-2xl`}
                />
                <div className="relative overflow-hidden rounded-3xl border-2 border-ink/10 bg-ink shadow-[0_16px_0_0_rgba(0,0,0,0.12)]">
                  <img
                    src={b.img}
                    alt={b.title}
                    className="h-auto w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Copy */}
              <div>
                <span
                  className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white ${b.badge}`}
                >
                  {b.eyebrow}
                </span>
                <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] uppercase leading-tight text-ink">
                  {b.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-ink/70 md:text-lg">
                  {b.desc}
                </p>
                <ul className="mt-6 space-y-3">
                  {b.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 font-medium text-ink">
                      <span className={`size-2.5 rounded-full ${b.badge}`} />
                      {p}
                    </li>
                  ))}
                </ul>
                <a
                  href="/request"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-pop underline decoration-2 underline-offset-4 hover:text-sky"
                >
                  Request this service →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
