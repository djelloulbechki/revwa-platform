import { Navbar } from "@/components/layout/Navbar"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { CTA } from "@/components/landing/CTA"

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <CTA />
      </main>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} REVWA — Independent B2B Tech Procurement Desk
        </div>
      </footer>
    </div>
  )
}
