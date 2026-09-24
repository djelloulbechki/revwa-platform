import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[hsl(var(--primary-deep))] p-10 md:p-16 text-center text-white">
          <h2 className="font-heading text-3xl md:text-5xl font-bold relative z-10">
            Ready for a fair tech deal?
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto relative z-10">
            First project is completely free. No credit card. No commitment.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Button asChild size="lg" variant="secondary" className="text-base px-8">
              <Link to="/request">
                Start Free Request
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base px-8 border-white/30 text-white hover:bg-white/10 hover:text-white">
              <Link to="/quote-audit">
                Audit a Quote for Free
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
