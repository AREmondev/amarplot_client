import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
// import LanguageDetector from "i18next-browser-languagedetector"; // Disabled to prevent automatic language detection

// Import JSON files directly
import BanglaCommon from "../public/locales/bn/common.json";
import BanglaNavigation from "../public/locales/bn/navigation.json";
import BanglaForms from "../public/locales/bn/forms.json";
import BanglaConstants from "../public/locales/bn/constants.json";

import EnglishCommon from "../public/locales/en/common.json";
import EnglishNavigation from "../public/locales/en/navigation.json";
import EnglishForms from "../public/locales/en/forms.json";
import EnglishConstants from "../public/locales/en/constants.json";

// Check if we're on the client side
const isClient = typeof window !== "undefined";

const i18nConfig = {
  lng: "bn", // Set Bengali as default language
  fallbackLng: "bn", // Set Bengali as fallback
  debug: process.env.NODE_ENV === "development",

  interpolation: {
    escapeValue: false,
  },

  ns: ["common", "navigation", "forms", "constants"], // Available namespaces
  defaultNS: "common",
  react: {
    useSuspense: false,
  },

  // Disable URL-based language detection
  detection: {
    order: [], // Disable all detection methods
    caches: [], // Disable caching
  },

  // Only use backend and language detector on client side
  ...(isClient && {
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  }),

  // Provide initial resources for SSR - Use imported JSON data
  resources: {
    bn: {
      common: BanglaCommon,
      navigation: BanglaNavigation,
      forms: BanglaForms,
      constants: BanglaConstants,
    },
    en: {
      common: EnglishCommon,
      navigation: EnglishNavigation,
      forms: EnglishForms,
      constants: EnglishConstants,
    },
  },
};

if (isClient) {
  i18n
    .use(HttpApi)
    // .use(LanguageDetector) // Disabled to prevent automatic language detection
    .use(initReactI18next)
    .init(i18nConfig);
} else {
  i18n.use(initReactI18next).init(i18nConfig);
}

export default i18n;
