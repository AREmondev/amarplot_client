// lib/store/useLocaleStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type LocaleState = {
  locale: "en" | "bn";
  isReady: boolean;
  setLocale: (lang: "en" | "bn") => void;
  setIsReady: (ready: boolean) => void;
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "en", // fallback
      isReady: false,
      setLocale: (lang) => {
        localStorage.setItem("lang", lang);
        set({ locale: lang });
      },
      setIsReady: (ready) => set({ isReady: ready }),
    }),
    {
      name: "locale-storage", // localStorage key
    }
  )
);
