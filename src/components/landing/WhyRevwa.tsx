import { EyeOff, FileCheck2, HeartHandshake, Zap } from "lucide-react"

const reasons = [
  {
    icon: FileCheck2,
    title: "Clear scope first",
    desc: "Everyone quotes the same brief — fewer surprises later.",
    color: "text-sun",
    bg: "bg-sun/10",
  },
  {
    icon: EyeOff,
    title: "Fair matching",
    desc: "Anonymous where it matters so offers compete on value.",
    color: "text-pop",
    bg: "bg-pop/10",
  },
  {
    icon: HeartHandshake,
    title: "Human + platform",
    desc: "Not a cold marketplace — guidance when you need it.",
    color: "text-mint",
    bg: "bg-mint/10",
  },
  {
    icon: Zap,
    title: "Start simple",
    desc: "First request is free for buyers. Cancel nothing.",
    color: "text-vio",
    bg: "bg-vio/10",
  },
]

export function WhyRevwa() {
  return (
    <section className="border-t-2 border-ink/10">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-pop">
            Why REVWA
          </p>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3.25rem)] uppercase leading-[0.95] text-ink">
            Designed to feel{" "}
            <span className="text-gradient">open, not exclusive</span>
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
              <h3 className="font-display text-lg uppercase">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
