// components/providers/i18n-provider.tsx
"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { useEffect } from "react";
import { useLocaleStore } from "@/lib/store/useLocaleStore";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { locale, isReady, setLocale, setIsReady } = useLocaleStore();

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as "en" | "bn" | null;

    const langToSet: "en" | "bn" =
      savedLang === "en" || savedLang === "bn"
        ? savedLang
        : i18n.language === "en"
        ? "bn"
        : "en";

    if (i18n.language !== langToSet) {
      i18n.changeLanguage(langToSet).then(() => {
        setLocale(langToSet);
        setIsReady(true);
      });
    } else {
      setLocale(langToSet);
      setIsReady(true);
    }
  }, [setLocale, setIsReady]);

  if (!isReady) return null;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
