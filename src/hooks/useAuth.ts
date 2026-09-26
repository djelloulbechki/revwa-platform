import { useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!mounted) return
        setSession(session)
        setUser(session?.user ?? null)
      } catch (err) {
        console.warn("[REVWA] Auth init failed:", err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signInAnonymously = async () => {
    try {
      // If already signed in (anonymous or not), reuse session
      const { data: existing } = await supabase.auth.getSession()
      if (existing.session?.user) {
        return { data: existing, error: null }
      }
      const { data, error } = await supabase.auth.signInAnonymously()
      return { data, error }
    } catch (err: any) {
      return { data: null, error: err }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    } catch (err: any) {
      return { data: null, error: err }
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      return { data, error }
    } catch (err: any) {
      return { data: null, error: err }
    }
  }

  /** Link Google / LinkedIn to the current (often anonymous) user */
  const linkIdentity = async (provider: "google" | "linkedin_oidc") => {
    try {
      const { data, error } = await supabase.auth.linkIdentity({
        provider,
        options: {
          redirectTo: `${window.location.origin}/buyer`,
        },
      })
      return { data, error }
    } catch (err: any) {
      return { data: null, error: err }
    }
  }

  /** OAuth sign-in (also works if user is not anonymous yet) */
  const signInWithOAuth = async (provider: "google" | "linkedin_oidc") => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/buyer`,
        },
      })
      return { data, error }
    } catch (err: any) {
      return { data: null, error: err }
    }
  }

  /** Upgrade anonymous user by attaching email + password */
  const linkEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        email,
        password,
      })
      return { data, error }
    } catch (err: any) {
      return { data: null, error: err }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (err: any) {
      return { error: err }
    }
  }

  const isAnonymous = Boolean(user?.is_anonymous)

  return {
    user,
    session,
    loading,
    isAnonymous,
    signInAnonymously,
    signIn,
    signUp,
    linkIdentity,
    signInWithOAuth,
    linkEmail,
    signOut,
  }
}
