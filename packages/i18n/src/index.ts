export { default as en } from './locales/en.json' with { type: 'json' };
export { default as fr } from './locales/fr.json' with { type: 'json' };
export { default as es } from './locales/es.json' with { type: 'json' };
export { default as it } from './locales/it.json' with { type: 'json' };

export const supportedLanguages = ['en', 'fr', 'es', 'it'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  fr: 'Francais',
  es: 'Espanol',
  it: 'Italiano',
};
