import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { translations, type Lang, type TranslationKey } from "./translations"

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  t: (key: TranslationKey) => string
  dir: "ltr" | "rtl"
  isRtl: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = "revwa_lang"

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "en"
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === "ar" || saved === "en") return saved
  const nav = navigator.language?.toLowerCase() ?? ""
  if (nav.startsWith("ar")) return "ar"
  return "en"
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "ar" : "en")
  }, [lang, setLang])

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = lang === "ar" ? "rtl" : "ltr"
    root.classList.toggle("lang-ar", lang === "ar")
    root.classList.toggle("lang-en", lang === "en")
  }, [lang])

  const t = useCallback(
    (key: TranslationKey) => {
      return translations[lang][key] ?? translations.en[key] ?? key
    },
    [lang]
  )

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      t,
      dir: (lang === "ar" ? "rtl" : "ltr") as "ltr" | "rtl",
      isRtl: lang === "ar",
    }),
    [lang, setLang, toggleLang, t]
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
