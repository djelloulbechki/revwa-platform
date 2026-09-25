import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./ThemeToggle"
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, signOut, loading } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-heading text-2xl font-bold tracking-tight text-primary">
            REVWA
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </Link>
          <Link to="/quote-audit" className="text-muted-foreground hover:text-foreground transition-colors">
            Quote Audit
          </Link>
          <Link to="/request" className="text-muted-foreground hover:text-foreground transition-colors">
            Start Request
          </Link>
          {user && (
            <>
              <Link to="/buyer" className="text-muted-foreground hover:text-foreground transition-colors">
                My Requests
              </Link>
              <Link to="/vendor" className="text-muted-foreground hover:text-foreground transition-colors">
                Vendor Portal
              </Link>
              <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                Admin
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!loading && (
            <>
              {user ? (
                <>
                  <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                    <Link to="/buyer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden sm:inline-flex">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" className="hidden sm:inline-flex">
                    <Link to="/login">Sign in</Link>
                  </Button>
                  <Button asChild className="hidden sm:inline-flex">
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          <Link to="/#how-it-works" className="block text-sm" onClick={() => setOpen(false)}>How it works</Link>
          <Link to="/quote-audit" className="block text-sm" onClick={() => setOpen(false)}>Quote Audit</Link>
          <Link to="/request" className="block text-sm" onClick={() => setOpen(false)}>Start Request</Link>
          {user && (
            <>
              <Link to="/buyer" className="block text-sm" onClick={() => setOpen(false)}>My Requests</Link>
              <Link to="/vendor" className="block text-sm" onClick={() => setOpen(false)}>Vendor Portal</Link>
              <Link to="/admin" className="block text-sm" onClick={() => setOpen(false)}>Admin</Link>
            </>
          )}
          <div className="flex gap-2 pt-2">
            {user ? (
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { handleSignOut(); setOpen(false) }}>
                Sign out
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to="/login" onClick={() => setOpen(false)}>Sign in</Link>
                </Button>
                <Button asChild size="sm" className="flex-1">
                  <Link to="/signup" onClick={() => setOpen(false)}>Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}