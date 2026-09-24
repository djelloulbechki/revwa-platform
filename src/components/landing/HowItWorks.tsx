import { MessageSquare, FileText, Send, Trophy } from "lucide-react"

const steps = [
  {
    icon: MessageSquare,
    title: "1. Tell us what you need",
    desc: "Describe your project in text or voice. No technical jargon required.",
  },
  {
    icon: FileText,
    title: "2. We create a clear scope",
    desc: "Our team turns your needs into a precise technical requirements document.",
  },
  {
    icon: Send,
    title: "3. Anonymous RFQ",
    desc: "We send the scoped request to qualified vendors without revealing your identity.",
  },
  {
    icon: Trophy,
    title: "4. Choose the best offer",
    desc: "Compare shortlisted proposals side-by-side and pick the right partner.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">How REVWA works</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            From messy ideas to clear, competitive proposals — in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="rounded-2xl border bg-card p-6 h-full hover:shadow-glow transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
