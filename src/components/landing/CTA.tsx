import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 pb-20 pt-8 md:px-10">
      <div className="relative overflow-hidden rounded-4xl bg-ink px-8 py-16 text-center text-paper md:px-16 dark:bg-[hsl(268_42%_7%)]">
        <span className="absolute left-8 top-6 size-4 rounded-full bg-pop shadow-[0_0_12px_hsl(var(--primary-glow)/0.8)]" />
        <span className="absolute bottom-8 right-10 size-6 rounded-full bg-sun" />
        <span className="absolute right-1/4 top-10 size-3 rounded-full bg-mint" />
        <span className="absolute left-1/3 bottom-10 size-3 rounded-full bg-[hsl(var(--primary-glow))] shadow-[0_0_10px_hsl(var(--primary-glow)/0.7)]" />

        <h2 className="relative z-10 font-display text-[clamp(2rem,6vw,4rem)] uppercase leading-[0.95]">
          Ready for a{" "}
          <span className="bg-gradient-to-r from-pop to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
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
            className="border-paper text-paper hover:bg-paper hover:text-ink"
          >
            <Link to="/quote-audit">Audit a quote</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
