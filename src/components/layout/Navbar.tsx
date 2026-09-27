import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { Menu, X, Languages } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/i18n/LanguageContext"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { user, signOut } = useAuth()
  const { t, toggleLang, lang } = useLanguage()

  const isActive = (path: string) => location.pathname === path
  const isHome = location.pathname === "/"

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

  const LangButton = ({ className = "" }: { className?: string }) => (
    <button
      type="button"
      onClick={toggleLang}
      className={`inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-card px-3.5 py-1.5 text-sm font-bold text-ink shadow-sm transition-all hover:border-pop hover:text-pop ${className}`}
      aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
    >
      <Languages className="h-4 w-4 text-pop" />
      <span>{t("lang_switch")}</span>
    </button>
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

        <div className="hidden items-center gap-6 lg:flex">
          {navLink("/", t("nav_home"))}
          {isHome ? (
            <>
              <a
                href="#services"
                className="text-sm font-bold text-ink/70 transition-colors hover:text-pop"
              >
                {t("nav_services")}
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-bold text-ink/70 transition-colors hover:text-pop"
              >
                {t("nav_how")}
              </a>
            </>
          ) : (
            <>
              <Link
                to="/#services"
                className="text-sm font-bold text-ink/70 transition-colors hover:text-pop"
              >
                {t("nav_services")}
              </Link>
              <Link
                to="/#how-it-works"
                className="text-sm font-bold text-ink/70 transition-colors hover:text-pop"
              >
                {t("nav_how")}
              </Link>
            </>
          )}
          {navLink("/request", t("nav_get_started"))}
          {navLink("/quote-audit", t("nav_quote_audit"))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LangButton />
          <ThemeToggle />
          {user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/buyer">{t("nav_dashboard")}</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                {t("nav_sign_out")}
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/login">{t("nav_sign_in")}</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/request">{t("nav_get_started")}</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LangButton className="px-2.5 py-1 text-xs" />
          <button
            type="button"
            className="rounded-full border-2 border-ink/10 p-2 text-ink"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t-2 border-ink/10 bg-paper px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLink("/", t("nav_home"))}
            <a
              href="#services"
              onClick={() => setOpen(false)}
              className="text-sm font-bold text-ink/70"
            >
              {t("nav_services")}
            </a>
            <a
              href="#how-it-works"
              onClick={() => setOpen(false)}
              className="text-sm font-bold text-ink/70"
            >
              {t("nav_how")}
            </a>
            {navLink("/request", t("nav_get_started"))}
            {navLink("/quote-audit", t("nav_quote_audit"))}
            <div className="flex flex-wrap gap-2 border-t-2 border-ink/10 pt-3">
              <ThemeToggle />
              {user ? (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/buyer" onClick={() => setOpen(false)}>
                      {t("nav_dashboard")}
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      signOut()
                      setOpen(false)
                    }}
                  >
                    {t("nav_sign_out")}
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/login" onClick={() => setOpen(false)}>
                      {t("nav_sign_in")}
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/request" onClick={() => setOpen(false)}>
                      {t("nav_get_started")}
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
