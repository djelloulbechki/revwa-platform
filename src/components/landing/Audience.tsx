import { User, Building2, Check } from "lucide-react"

const individuals = [
  "Freelancers & solo founders",
  "Creators who need automation",
  "First website or app idea",
  "No tech team required",
]

const companies = [
  "Startups & SMEs",
  "Sales & marketing teams",
  "Ops that need AI workflows",
  "Clear scopes for vendors",
]

export function Audience() {
  return (
    <section className="border-t-2 border-ink/10 bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-sun">
            Built for people, not just enterprises
          </p>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3.25rem)] uppercase leading-[0.95]">
            Whether you&apos;re one person{" "}
            <span className="text-sun">or a whole team</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Individuals */}
          <div className="relative overflow-hidden rounded-3xl bg-sun p-8 text-white shadow-[0_12px_0_0_rgba(0,0,0,0.2)] md:p-10">
            <div className="pointer-events-none absolute -right-10 top-0 size-40 rounded-full bg-white/15" />
            <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-white/20">
              <User className="h-7 w-7" />
            </div>
            <h3 className="font-display text-2xl uppercase">Individuals</h3>
            <p className="mt-2 text-white/90">
              Simple requests. Human guidance. No enterprise sales theater.
            </p>
            <ul className="mt-6 space-y-3">
              {individuals.map((item) => (
                <li key={item} className="flex items-center gap-3 font-medium">
                  <span className="flex size-6 items-center justify-center rounded-full bg-white/25">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Companies */}
          <div className="relative overflow-hidden rounded-3xl bg-pop p-8 text-white shadow-[0_12px_0_0_rgba(0,0,0,0.2)] md:p-10">
            <div className="pointer-events-none absolute -right-10 top-0 size-40 rounded-full bg-white/10" />
            <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-white/20">
              <Building2 className="h-7 w-7" />
            </div>
            <h3 className="font-display text-2xl uppercase">Companies</h3>
            <p className="mt-2 text-white/90">
              Structured scopes, anonymous RFQs, and comparable offers.
            </p>
            <ul className="mt-6 space-y-3">
              {companies.map((item) => (
                <li key={item} className="flex items-center gap-3 font-medium">
                  <span className="flex size-6 items-center justify-center rounded-full bg-white/25">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
