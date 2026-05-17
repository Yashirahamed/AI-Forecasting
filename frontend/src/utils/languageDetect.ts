/**
 * Detect browser/system preferred language and map to supported app locale
 */
const SUPPORTED_LOCALES = ['en', 'ta', 'hi', 'te', 'kn'] as const
type SupportedLocale = typeof SUPPORTED_LOCALES[number]

export const detectLanguage = (): SupportedLocale => {
  // 1. Check saved preference
  const saved = localStorage.getItem('weathercast-lang') as SupportedLocale | null
  if (saved && SUPPORTED_LOCALES.includes(saved)) return saved

  // 2. Check browser language
  const browserLang = navigator.language.toLowerCase().split('-')[0]
  if (SUPPORTED_LOCALES.includes(browserLang as SupportedLocale)) {
    return browserLang as SupportedLocale
  }

  return 'en'
}

export const saveLanguagePreference = (locale: SupportedLocale): void => {
  localStorage.setItem('weathercast-lang', locale)
}

export const LANGUAGE_OPTIONS: Array<{ code: SupportedLocale; label: string; flag: string }> = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
]
