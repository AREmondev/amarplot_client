"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import usaFlag from "../../public/images/usa-flag.png";
import bdFlag from "../../public/images/bd-flag.png";
import { useLocaleStore } from "@/lib/store/useLocaleStore";
// import { useLocaleStore } from "@/stores/useLocaleStore";

export default function LocaleSwitcher() {
  const { i18n } = useTranslation();

  const { locale, isReady, setLocale, setIsReady } = useLocaleStore();
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as "en" | "bn" | null;
  
    // Always default to English if nothing saved
    const langToSet: "en" | "bn" = savedLang ? savedLang : "en";
  
    i18n.changeLanguage(langToSet).then(() => {
      setLocale(langToSet);
      setIsReady(true);
    });
  }, [i18n, setLocale, setIsReady]);
  

  const handleLocaleChange = (lang: "en" | "bn") => {
    i18n.changeLanguage(lang);
    setLocale(lang);
  };

  const currentFlag = locale === "en" ? usaFlag : bdFlag;
  const currentLabel =
    locale === "en"
      ? { short: "EN", full: "ENGLISH" }
      : { short: "BN", full: "বাংলা" };

  if (!isReady) return null;

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-1 px-3 py-1 rounded-md cursor-pointer">
            <span className="text-[10px] lg:text-xl">
              <Image src={currentFlag} alt="flag" width={15} />
            </span>

            <>
              <span className="text-[10px] font-medium block ">
                {currentLabel.short}
              </span>

    

            </>

            <svg
              className="w-3 h-3 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-40 rounded-xl bg-background shadow-lg mt-2 -right-[120px] md:-right-[140px] absolute py-3 px-0 border-[#99999980]"
        >
          <div className="space-y-2 flex flex-col py-2">
            <button
              onClick={() => handleLocaleChange("en")}
              className={`py-1 px-3 text-center rounded-md transition-all duration-200 ease-in-out
                ${
                  locale === "en"
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "hover:bg-accent/20 hover:text-accent text-muted-foreground"
                }`}
            >
              English
            </button>

            <button
              onClick={() => handleLocaleChange("bn")}
              className={`py-1 px-3 text-center rounded-md transition-all duration-200 ease-in-out
                ${
                  locale === "bn"
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "hover:bg-accent/20 hover:text-accent text-muted-foreground"
                }`}
            >
              বাংলা
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
