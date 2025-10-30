import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import trTR from 'src/i18n/tr-TR'

// Create i18n instance
export const i18n = createI18n({
  locale: 'tr-TR', // Default language (Turkish)
  fallbackLocale: 'tr-TR', // Fallback language (Turkish)
  globalInjection: true,
  legacy: false, // Use Composition API
  sync: true, // Sync translations with locale changes
  silentTranslationWarn: true, // Suppress warnings for missing translations
  messages: {
    'tr-TR': trTR
  }
})

export default defineBoot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n)
})
