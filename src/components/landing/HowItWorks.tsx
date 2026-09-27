const steps = [
  {
    n: "01",
    title: "Tell us what you need",
    desc: "Describe your project in text or voice. No technical jargon required.",
    shell:
      "bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500",
    glass:
      "bg-white/15 backdrop-blur-xl border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]",
  },
  {
    n: "02",
    title: "We create a clear scope",
    desc: "Our team turns your needs into a precise technical requirements document.",
    shell:
      "bg-gradient-to-br from-violet-800 via-purple-600 to-fuchsia-600",
    glass:
      "bg-white/10 backdrop-blur-xl border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]",
  },
  {
    n: "03",
    title: "Anonymous RFQ",
    desc: "We send the scoped request to qualified vendors without revealing your identity.",
    shell:
      "bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-400",
    glass:
      "bg-white/15 backdrop-blur-xl border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]",
  },
  {
    n: "04",
    title: "Choose the best offer",
    desc: "Compare shortlisted proposals side-by-side and pick the right partner.",
    shell:
      "bg-gradient-to-br from-fuchsia-600 via-pink-500 to-rose-400",
    glass:
      "bg-white/15 backdrop-blur-xl border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]",
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
          <div
            key={s.n}
            className={`group relative overflow-hidden rounded-3xl p-[1px] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.25)] ${s.shell}`}
          >
            {/* agate shine */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
            <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />

            <div className={`relative rounded-[1.4rem] p-7 text-white ${s.glass}`}>
              <span className="font-display text-5xl text-white/40">{s.n}</span>
              <h3 className="mb-2 mt-3 font-display text-xl uppercase tracking-wide">
                {s.title}
              </h3>
              <p className="leading-relaxed text-white/90">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
