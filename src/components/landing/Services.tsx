import {
  Share2,
  TrendingUp,
  Bot,
  Globe,
  Smartphone,
  type LucideIcon,
} from "lucide-react"

type Service = {
  icon: LucideIcon
  title: string
  subtitle: string
  points: string[]
  shell: string
  badge: string
}

const services: Service[] = [
  {
    icon: Share2,
    title: "Social media automation",
    subtitle: "Post, engage, and grow without living in the apps",
    points: ["Content scheduling", "Inbox & replies", "Analytics loops"],
    shell: "bg-sun text-white",
    badge: "01",
  },
  {
    icon: TrendingUp,
    title: "Sales automation",
    subtitle: "From lead to close — fewer manual steps",
    points: ["CRM workflows", "Follow-ups", "Pipeline alerts"],
    shell: "bg-sky text-white",
    badge: "02",
  },
  {
    icon: Bot,
    title: "Artificial intelligence",
    subtitle: "AI assistants and smart tools that actually help",
    points: ["Chat & support bots", "Document AI", "Custom agents"],
    shell: "bg-pop text-white",
    badge: "03",
  },
  {
    icon: Globe,
    title: "Website building",
    subtitle: "Fast, clear sites that convert visitors",
    points: ["Landing pages", "Business sites", "E-commerce ready"],
    shell: "bg-mint text-white",
    badge: "04",
  },
  {
    icon: Smartphone,
    title: "App building",
    subtitle: "Mobile & web apps shaped around your users",
    points: ["MVP to scale", "iOS & Android", "Web apps"],
    shell: "bg-vio text-white",
    badge: "05",
  },
]

export function Services() {
  return (
    <section id="services" className="relative border-t-2 border-ink/10">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-pop">
            What you can request
          </p>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3.25rem)] uppercase leading-[0.95] text-ink">
            Five service lanes.{" "}
            <span className="text-sun">One fair match.</span>
          </h2>
          <p className="mt-4 text-lg text-ink/70">
            Pick what you need — we turn it into a clear scope and connect you
            with specialists. Designed so anyone can understand the offer at a glance.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.title}
              className={`group relative overflow-hidden rounded-3xl p-7 shadow-[0_10px_0_0_rgba(0,0,0,0.12)] transition-transform hover:-translate-y-1 ${s.shell}`}
            >
              {/* decorative circle */}
              <div className="pointer-events-none absolute -right-8 -top-8 size-36 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-10 -left-6 size-28 rounded-full bg-black/10" />

              <div className="relative">
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <s.icon className="h-7 w-7" strokeWidth={2.25} />
                  </div>
                  <span className="font-display text-3xl opacity-40">{s.badge}</span>
                </div>
                <h3 className="font-display text-xl uppercase leading-tight tracking-wide">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/90">
                  {s.subtitle}
                </p>
                <ul className="mt-5 space-y-2">
                  {s.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-center gap-2 text-sm font-medium text-white/95"
                    >
                      <span className="size-1.5 shrink-0 rounded-full bg-white" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}

          {/* CTA tile in the grid */}
          <article className="flex flex-col justify-between rounded-3xl border-2 border-dashed border-ink/20 bg-card p-7 shadow-[0_10px_0_0_rgba(0,0,0,0.06)] sm:col-span-2 lg:col-span-1">
            <div>
              <p className="font-display text-lg uppercase text-ink">
                Need something else?
              </p>
              <p className="mt-2 text-sm text-ink/60">
                Cloud, servers, custom automation — tell us in plain language.
                We still match you fairly.
              </p>
            </div>
            <a
              href="/request"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-pop underline decoration-2 underline-offset-4"
            >
              Describe your project →
            </a>
          </article>
        </div>
      </div>
    </section>
  )
}
