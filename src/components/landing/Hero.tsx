import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, FileSearch, Scale } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-8">
          <Shield className="h-4 w-4 text-primary" />
          Independent B2B Tech Procurement
        </div>

        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
          Fair tech deals.{" "}
          <span className="text-gradient">Clear scope.</span>{" "}
          No surprises.
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          REVWA protects companies from overpriced quotes and vague requirements. 
          We turn your needs into precise technical scopes and match you with the right vendors — anonymously and fairly.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="glow text-base px-8">
            <Link to="/request">
              Start Free Request
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base px-8">
            <Link to="/quote-audit">
              <FileSearch className="mr-2 h-5 w-5" />
              Audit Existing Quote
            </Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Scale, title: "Fair Pricing", desc: "Anonymous RFQs force real competition" },
            { icon: FileSearch, title: "Clear Scope", desc: "Professional tech requirements documents" },
            { icon: Shield, title: "Zero Commitment", desc: "First deal completely free for buyers" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border bg-card/50 p-6 text-left">
              <item.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
