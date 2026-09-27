import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, FileSearch, Scale } from "lucide-react"

const features = [
  {
    icon: Scale,
    title: "Fair Pricing",
    desc: "Anonymous RFQs force real competition",
    // orange agate glass
    shell:
      "bg-gradient-to-br from-orange-400/90 via-orange-500/80 to-rose-500/70",
    glass:
      "bg-white/15 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(255,90,0,0.25),inset_0_1px_0_rgba(255,255,255,0.4)]",
  },
  {
    icon: FileSearch,
    title: "Clear Scope",
    desc: "Professional tech requirements documents",
    // deep royal purple glass
    shell:
      "bg-gradient-to-br from-violet-700/95 via-purple-600/85 to-fuchsia-600/70",
    glass:
      "bg-white/10 backdrop-blur-xl border border-white/25 shadow-[0_8px_32px_rgba(90,30,180,0.35),inset_0_1px_0_rgba(255,255,255,0.35)]",
  },
  {
    icon: Shield,
    title: "Zero Commitment",
    desc: "First deal completely free for buyers",
    // vivid violet glass
    shell:
      "bg-gradient-to-br from-indigo-500/90 via-violet-500/85 to-purple-400/75",
    glass:
      "bg-white/15 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(120,80,255,0.3),inset_0_1px_0_rgba(255,255,255,0.45)]",
  },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="w-full lg:w-1/2">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-ink/10 bg-card/80 px-4 py-1.5 text-sm font-medium text-ink/70 backdrop-blur-sm">
              <span className="size-2 rounded-full bg-pop shadow-[0_0_8px_hsl(var(--primary-glow)/0.8)]" />
              Independent B2B Tech Matching
            </div>

            <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] uppercase leading-[0.95] tracking-tight text-ink">
              Fair tech deals.{" "}
              <span className="text-gradient">Clear scope.</span>{" "}
              No surprises.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
              REVWA connects companies with the right cloud, automation, and AI
              vendors — with precise scopes, anonymous RFQs, and real competition.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="xl">
                <Link to="/request">
                  Start Free Request
                  <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/quote-audit">
                  <FileSearch className="mr-1 h-5 w-5" />
                  Audit Existing Quote
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                <span className="size-8 rounded-full border-2 border-paper bg-gradient-to-br from-orange-400 to-rose-500 shadow-md" />
                <span className="size-8 rounded-full border-2 border-paper bg-gradient-to-br from-violet-700 to-fuchsia-500 shadow-md" />
                <span className="size-8 rounded-full border-2 border-paper bg-gradient-to-br from-indigo-500 to-violet-400 shadow-md" />
              </div>
              <p className="text-sm font-medium text-ink/60">
                First deal free for buyers
              </p>
            </div>
          </div>

          <div className="grid w-full gap-5 sm:grid-cols-3 lg:w-1/2 lg:grid-cols-1 xl:grid-cols-3">
            {features.map((item) => (
              <div
                key={item.title}
                className={`group relative overflow-hidden rounded-3xl p-[1px] ${item.shell}`}
              >
                {/* shine sweep */}
                <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 group-hover:left-full group-hover:opacity-100" />
                <div className={`relative rounded-[1.4rem] p-6 text-white ${item.glass}`}>
                  <item.icon className="mb-3 h-8 w-8 drop-shadow-sm" />
                  <h3 className="font-display text-lg uppercase tracking-wide drop-shadow-sm">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/90">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
