import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Minimal i18n setup for multi-language support (EN, TA, HI, TE, KN)
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: { welcome: "Welcome to WeatherCast AI" } },
      ta: { translation: { welcome: "WeatherCast AI-க்கு வரவேற்கிறோம்" } },
      hi: { translation: { welcome: "WeatherCast AI में आपका स्वागत है" } },
      te: { translation: { welcome: "WeatherCast AI కి స్వాగతం" } },
      kn: { translation: { welcome: "WeatherCast AI ಗೆ ಸುಸ್ವಾಗತ" } },
    }
  });

export default i18n;
