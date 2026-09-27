import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 pb-20 pt-8 md:px-10">
      <div className="relative overflow-hidden rounded-4xl bg-ink px-8 py-16 text-center text-paper md:px-16 md:py-20">
        <span className="absolute left-8 top-6 size-4 rounded-full bg-sun shadow-[0_0_14px_hsl(var(--sun)/0.7)]" />
        <span className="absolute bottom-8 right-10 size-6 rounded-full bg-pop shadow-[0_0_16px_hsl(var(--primary-glow)/0.7)]" />
        <span className="absolute right-1/4 top-12 size-3 rounded-full bg-mint" />
        <span className="absolute left-1/3 bottom-12 size-3 rounded-full bg-vio" />

        <h2 className="relative z-10 font-display text-[clamp(2rem,6vw,4rem)] uppercase leading-[0.95]">
          Ready when you are —{" "}
          <span className="bg-gradient-to-r from-sun via-pop to-vio bg-clip-text text-transparent">
            solo or team
          </span>
        </h2>
        <p className="relative z-10 mx-auto mt-5 max-w-md text-paper/70">
          Tell us what you need in everyday language. We handle the scope and the match.
        </p>
        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="xl">
            <Link to="/request">
              Start free request
              <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="xl"
            className="border-paper text-paper hover:bg-paper hover:text-ink"
          >
            <a href="#services">Browse services</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
