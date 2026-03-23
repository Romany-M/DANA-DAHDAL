/* app/context/SiteContext.tsx */
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type LangUI = "EN" | "AR";
export type LangT  = "en" | "ar";

interface SiteContextValue {
  langUI: LangUI;
  langT:  LangT;
  dark:   boolean;
  toggleLang: () => void;
  toggleDark: () => void;
}

const SiteContext = createContext<SiteContextValue>({
  langUI: "EN",
  langT:  "en",
  dark:   true,
  toggleLang: () => {},
  toggleDark: () => {},
});

export function SiteProvider({ children }: { children: ReactNode }) {
  const [langUI, setLangUI] = useState<LangUI>("EN");
  const [dark,   setDark]   = useState(true);

  useEffect(() => {
    // ── Theme ──
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme !== "light"; // default = dark
    setDark(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // ── Language ──
    const savedLang = localStorage.getItem("lang") as LangUI | null;
    if (savedLang === "AR") {
      setLangUI("AR");
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.setAttribute("lang", "ar");
    }
  }, []);

  const toggleDark = () => {
    setDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  const toggleLang = () => {
    setLangUI(prev => {
      const next: LangUI = prev === "EN" ? "AR" : "EN";
      localStorage.setItem("lang", next);
      document.documentElement.setAttribute("dir", next === "AR" ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", next === "AR" ? "ar"  : "en");
      return next;
    });
  };

  const langT: LangT = langUI === "AR" ? "ar" : "en";

  return (
    <SiteContext.Provider value={{ langUI, langT, dark, toggleLang, toggleDark }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}