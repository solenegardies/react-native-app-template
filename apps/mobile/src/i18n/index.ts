import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from '@react-native-app/i18n/locales/en.json';
import fr from '@react-native-app/i18n/locales/fr.json';
import es from '@react-native-app/i18n/locales/es.json';
import it from '@react-native-app/i18n/locales/it.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es },
  it: { translation: it },
};

export async function initI18n() {
  const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'en';
  const supportedLocale = Object.keys(resources).includes(deviceLocale)
    ? deviceLocale
    : 'en';

  await i18n.use(initReactI18next).init({
    resources,
    lng: supportedLocale,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  return i18n;
}

export default i18n;
