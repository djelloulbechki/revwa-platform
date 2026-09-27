import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 pb-20 pt-8 md:px-10">
      <div className="relative overflow-hidden rounded-4xl p-[1px] bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 shadow-[0_20px_60px_-15px_rgba(120,40,200,0.45)]">
        <div className="relative overflow-hidden rounded-[calc(2.5rem-1px)] bg-[hsl(268_42%_7%)] px-8 py-16 text-center text-paper md:px-16">
          {/* glass orbs */}
          <span className="absolute left-8 top-6 size-5 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 opacity-90 shadow-[0_0_20px_rgba(255,100,50,0.6)]" />
          <span className="absolute bottom-8 right-10 size-7 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 opacity-90 shadow-[0_0_24px_rgba(180,80,255,0.55)]" />
          <span className="absolute right-1/4 top-10 size-3 rounded-full bg-white/40 backdrop-blur-sm" />
          <span className="absolute left-1/3 bottom-12 size-4 rounded-full bg-gradient-to-br from-pink-400 to-violet-500 opacity-80" />

          {/* soft agate wash */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(140,80,255,0.25),transparent_50%),radial-gradient(ellipse_at_20%_80%,rgba(255,100,60,0.15),transparent_45%)]" />

          <h2 className="relative z-10 font-display text-[clamp(2rem,6vw,4rem)] uppercase leading-[0.95]">
            Ready for a{" "}
            <span className="bg-gradient-to-r from-orange-300 via-fuchsia-300 to-violet-300 bg-clip-text text-transparent">
              fair
            </span>{" "}
            tech deal?
          </h2>
          <p className="relative z-10 mx-auto mt-5 max-w-md text-paper/70">
            First deal is free for buyers. No commitment. Clear scope. Real competition.
          </p>
          <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="xl">
              <Link to="/request">
                Start Free Request
                <ArrowRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="xl"
              className="border-paper/80 bg-white/5 text-paper backdrop-blur-sm hover:bg-paper hover:text-ink"
            >
              <Link to="/quote-audit">Audit a quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
