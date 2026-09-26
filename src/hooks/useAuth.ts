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
        const { data: { session } } = await supabase.auth.getSession()
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  /** Start or reuse anonymous session (browser-scoped). */
  const signInAnonymously = async () => {
    try {
      const { data: existing } = await supabase.auth.getSession()
      if (existing.session?.user) {
        return { data: existing, error: null as null }
      }
      const { data, error } = await supabase.auth.signInAnonymously()
      return { data, error }
    } catch (err: any) {
      return { data: null, error: err }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
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

  /** Link Google or LinkedIn to current (often anonymous) user. Keeps same user id. */
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

  /**
   * Upgrade anonymous user with email + password.
   * Prefer same contact_email so user does not re-type it.
   */
  const activateWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        email: email.trim(),
        password,
        data: { contact_email: email.trim() },
      })
      if (!error) {
        await supabase
          .from("profiles")
          .update({
            contact_email: email.trim(),
            activation_status: "activated",
            email: email.trim(),
          })
          .eq("id", data.user?.id)
      }
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
    activateWithEmail,
    signOut,
  }
}
