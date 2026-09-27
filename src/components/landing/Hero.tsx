import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Users, Building2 } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* soft ambient orbs */}
      <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-pop/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-40 size-64 rounded-full bg-sun/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 size-48 rounded-full bg-mint/15 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-ink/10 bg-card px-4 py-1.5 text-sm font-bold text-ink/70 shadow-sm">
            <Sparkles className="h-4 w-4 text-pop" />
            For freelancers, startups & growing companies
          </div>

          <h1 className="font-display text-[clamp(2.5rem,7vw,4.75rem)] uppercase leading-[0.92] tracking-tight text-ink">
            All the tech you need.{" "}
            <span className="text-gradient">Matched fairly.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/70 md:text-xl">
            Social automation, sales workflows, AI, websites, and apps —
            one place to request what you need and get matched with the right
            specialists. Clear scope. Fair quotes. No jargon.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="xl">
              <Link to="/request">
                Start free request
                <ArrowRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <a href="#services">See services</a>
            </Button>
          </div>

          {/* audience chips — design says "for everyone" */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-sun px-4 py-2 text-sm font-bold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.12)]">
              <Users className="h-4 w-4" /> Individuals
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-sky px-4 py-2 text-sm font-bold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.12)]">
              <Building2 className="h-4 w-4" /> Companies
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-pop px-4 py-2 text-sm font-bold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.12)]">
              <Sparkles className="h-4 w-4" /> First match free
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
