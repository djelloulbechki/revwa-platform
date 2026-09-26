import { MessageSquare, FileText, Send, Trophy } from "lucide-react"

const steps = [
  {
    n: "01",
    title: "Tell us what you need",
    desc: "Describe your project in text or voice. No technical jargon required.",
    className: "bg-sky text-white",
    bodyClass: "text-white/85",
  },
  {
    n: "02",
    title: "We create a clear scope",
    desc: "Our team turns your needs into a precise technical requirements document.",
    className: "bg-sun text-ink",
    bodyClass: "text-ink/80",
  },
  {
    n: "03",
    title: "Anonymous RFQ",
    desc: "We send the scoped request to qualified vendors without revealing your identity.",
    className: "bg-mint text-ink",
    bodyClass: "text-ink/80",
  },
  {
    n: "04",
    title: "Choose the best offer",
    desc: "Compare shortlisted proposals side-by-side and pick the right partner.",
    className: "bg-vio text-white",
    bodyClass: "text-white/85",
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-[1440px] border-t-2 border-ink/10 px-6 py-16 md:px-10 md:py-20"
    >
      <h2 className="mb-10 font-display text-[clamp(1.8rem,4vw,3rem)] uppercase text-ink">
        How <span className="text-pop">REVWA</span> works
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className={`rounded-3xl p-7 ${s.className}`}>
            <span className="font-display text-5xl opacity-40">{s.n}</span>
            <h3 className="mb-2 mt-3 font-display text-xl uppercase">{s.title}</h3>
            <p className={`leading-relaxed ${s.bodyClass}`}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
