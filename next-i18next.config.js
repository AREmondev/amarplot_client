// next-i18next.config.js
const i18n = {
  locales: ["bn", "en"], // Bengali first (primary), then English
  defaultLocale: "en", // Bengali as default
  localeDetection: false, // Disable automatic locale detection to prevent redirects
};

module.exports = { i18n };
