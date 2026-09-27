const steps = [
  {
    n: "01",
    title: "Tell us what you need",
    desc: "Social, sales, AI, website, or app — describe it in plain language. No technical jargon required.",
    className: "bg-sun text-white",
  },
  {
    n: "02",
    title: "We shape a clear scope",
    desc: "Your idea becomes a precise brief so vendors quote the same work — not guesswork.",
    className: "bg-sky text-white",
  },
  {
    n: "03",
    title: "Matched specialists",
    desc: "We connect you with qualified partners for that service lane — fairly and transparently.",
    className: "bg-pop text-white",
  },
  {
    n: "04",
    title: "You choose the best fit",
    desc: "Compare offers side by side. Pick the partner that feels right for you or your company.",
    className: "bg-mint text-white",
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-[1440px] border-t-2 border-ink/10 px-6 py-16 md:px-10 md:py-24"
    >
      <div className="mb-12 max-w-2xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-pop">
          How it works
        </p>
        <h2 className="font-display text-[clamp(1.9rem,4.5vw,3.25rem)] uppercase leading-[0.95] text-ink">
          From idea to matched partner{" "}
          <span className="text-pop">in four steps</span>
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div
            key={s.n}
            className={`relative overflow-hidden rounded-3xl p-7 shadow-[0_10px_0_0_rgba(0,0,0,0.12)] ${s.className}`}
          >
            <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-white/10" />
            <span className="font-display text-5xl opacity-35">{s.n}</span>
            <h3 className="mb-2 mt-3 font-display text-xl uppercase tracking-wide">
              {s.title}
            </h3>
            <p className="leading-relaxed text-white/90">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
