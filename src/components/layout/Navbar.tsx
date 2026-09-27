import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { user, signOut } = useAuth()

  const isActive = (path: string) => location.pathname === path

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className={`text-sm font-bold transition-colors hover:text-pop ${
        isActive(to) ? "text-pop underline decoration-2 underline-offset-4" : "text-ink/70"
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-ink/10 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block size-3 rounded-full bg-pop" />
          <span className="font-display text-xl uppercase tracking-tight text-ink">
            REVWA
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLink("/", "Home")}
          {navLink("/request", "Get Started")}
          {navLink("/quote-audit", "Quote Audit")}
          <a
            href="#services"
            className="text-sm font-bold text-ink/70 transition-colors hover:text-pop"
          >
            Services
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-bold text-ink/70 transition-colors hover:text-pop"
          >
            How it works
          </a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/buyer">Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/request">Start free →</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border-2 border-ink/10 p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t-2 border-ink/10 bg-paper px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLink("/", "Home")}
            {navLink("/request", "Get Started")}
            {navLink("/quote-audit", "Quote Audit")}
            <a
              href="#services"
              onClick={() => setOpen(false)}
              className="text-sm font-bold text-ink/70"
            >
              Services
            </a>
            <a
              href="#how-it-works"
              onClick={() => setOpen(false)}
              className="text-sm font-bold text-ink/70"
            >
              How it works
            </a>
            <div className="flex flex-wrap items-center gap-3 border-t-2 border-ink/10 pt-4">
              <ThemeToggle />
              {user ? (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/buyer" onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => signOut()}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/login" onClick={() => setOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/request" onClick={() => setOpen(false)}>
                      Start free →
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
