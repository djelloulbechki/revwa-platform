import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, FileSearch, Scale } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="w-full lg:w-1/2">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-ink/10 bg-card px-4 py-1.5 text-sm font-medium text-ink/70">
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
                <span className="size-8 rounded-full border-2 border-paper bg-pop shadow-[0_0_10px_hsl(var(--primary-glow)/0.5)]" />
                <span className="size-8 rounded-full border-2 border-paper bg-sun" />
                <span className="size-8 rounded-full border-2 border-paper bg-mint" />
              </div>
              <p className="text-sm font-medium text-ink/60">
                First deal free for buyers
              </p>
            </div>
          </div>

          {/* Feature cards — each a different bold color */}
          <div className="grid w-full gap-4 sm:grid-cols-3 lg:w-1/2 lg:grid-cols-1 xl:grid-cols-3">
            {[
              {
                icon: Scale,
                title: "Fair Pricing",
                desc: "Anonymous RFQs force real competition",
                bg: "bg-sun text-white",
                body: "text-white/90",
              },
              {
                icon: FileSearch,
                title: "Clear Scope",
                desc: "Professional tech requirements documents",
                bg: "bg-sky text-white",
                body: "text-white/90",
              },
              {
                icon: Shield,
                title: "Zero Commitment",
                desc: "First deal completely free for buyers",
                bg: "bg-pop text-white",
                body: "text-white/90",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-3xl p-6 shadow-[0_8px_0_0_rgba(0,0,0,0.12)] ${item.bg}`}
              >
                <item.icon className="mb-3 h-8 w-8 opacity-95" />
                <h3 className="font-display text-lg uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className={`mt-1 text-sm leading-relaxed ${item.body}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
