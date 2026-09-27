import { Navbar } from "@/components/layout/Navbar"
import { Hero } from "@/components/landing/Hero"
import { Services } from "@/components/landing/Services"
import { Audience } from "@/components/landing/Audience"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { WhyRevwa } from "@/components/landing/WhyRevwa"
import { CTA } from "@/components/landing/CTA"
import { Link } from "react-router-dom"

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-paper font-body text-ink">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <Audience />
        <HowItWorks />
        <WhyRevwa />
        <CTA />
      </main>
      <footer className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-3 border-t-2 border-ink/10 px-6 py-10 text-sm text-ink/50 sm:flex-row md:px-10">
        <span className="font-display uppercase text-ink">REVWA</span>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/terms" className="hover:text-pop">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-pop">
            Privacy
          </Link>
          <span>© {new Date().getFullYear()} — Tech matched fairly</span>
        </div>
      </footer>
    </div>
  )
}
