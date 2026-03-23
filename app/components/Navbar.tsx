/* app/components/Navbar.tsx */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSite } from "../context/SiteContext";
import { translations } from "../lib/translations";

export default function Navbar() {
  const { langUI, langT, dark, toggleLang, toggleDark } = useSite();
  const t = translations[langT];
  const [active, setActive] = useState<string>("");

  /* ── الروابط بالترجمة ── */
  const links = [
    { name: t.navGallery,     href: "#gallery",  id: "gallery"  },
    { name: t.navMurals,      href: "#murals",   id: "murals"   },
    { name: t.navExhibitions, href: "#various",  id: "various"  },
    { name: t.navAbout,       href: "#about",    id: "about"    },
    { name: t.navContact,     href: "#contact",  id: "contact"  },
  ];

  /* ── Scroll Spy ── */
  useEffect(() => {
    const handleScroll = () => {
      const middle = window.scrollY + window.innerHeight / 2;
      let current = "";
      links.forEach(({ id, name }) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (middle >= el.offsetTop && middle < el.offsetTop + el.offsetHeight)
          current = name;
      });
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langT]); // نعيد التسجيل لما تتغير اللغة

  return (
    <>
      {/* ── Navbar ── */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md
                         bg-[#0f0f0f]/90 border-b border-neutral-800/40">
        <nav className="flex items-center justify-center px-4 sm:px-10 py-5
                        gap-4 sm:gap-10 overflow-x-auto">
          {links.map(link => (
            <div key={link.id} className="relative flex-shrink-0">
              <Link
                href={link.href}
                onClick={() => setActive(link.name)}
                className={`text-[10px] tracking-[0.25em] uppercase transition duration-300 whitespace-nowrap ${
                  active === link.name
                    ? "text-[#b8955a]"
                    : "text-neutral-300 hover:text-amber-400"
                }`}
              >
                {link.name}
              </Link>
              <span className={`absolute left-0 -bottom-2 h-[1px] bg-[#b8955a]
                                transition-all duration-300 ${
                active === link.name ? "w-full" : "w-0"
              }`} />
            </div>
          ))}
        </nav>
      </header>

      {/* ── Floating Controls ── */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">

        {/* Language */}
        <button
          onClick={toggleLang}
          aria-label="Toggle language"
          className="relative w-11 h-11 flex items-center justify-center rounded-full
                     bg-[#0f0f0f]/80 border border-neutral-700 backdrop-blur-md
                     hover:border-[#b8955a] transition-all duration-300 group"
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4"
               className="w-4 h-4 stroke-neutral-300 group-hover:stroke-[#b8955a] transition duration-300">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10
                     15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span className="absolute -top-1 -right-1 text-[7px] tracking-wider
                           bg-[#b8955a] text-white w-4 h-4 rounded-full
                           flex items-center justify-center font-medium">
            {langUI}
          </span>
        </button>

        {/* Dark / Light */}
        <button
          onClick={toggleDark}
          aria-label="Toggle theme"
          className="w-11 h-11 flex items-center justify-center rounded-full
                     bg-[#0f0f0f]/80 border border-neutral-700 backdrop-blur-md
                     hover:border-[#b8955a] transition-all duration-300 group"
        >
          {dark ? (
            /* Moon — dark mode active */
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4"
                 className="w-4 h-4 stroke-neutral-300 group-hover:stroke-[#b8955a] transition duration-300">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            /* Sun — light mode active */
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4"
                 className="w-4 h-4 stroke-neutral-300 group-hover:stroke-[#b8955a] transition duration-300">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1"  x2="12" y2="3"  />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1"  y1="12" x2="3"  y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
              <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}