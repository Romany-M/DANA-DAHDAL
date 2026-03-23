/* app/page.tsx */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSite } from "./context/SiteContext";
import { translations } from "./lib/translations";
import { galleryData, variousWorks, muralsData, ArtItem } from "./lib/data";

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/painterwaled?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    color: "#E1306C",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/painter.waled.makram",
    color: "#1877F2",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
];

/* ══════════════════════════════════
   LIGHTBOX
══════════════════════════════════ */
function Lightbox({ items, index, onClose, onChange }: {
  items: ArtItem[]; index: number;
  onClose: () => void; onChange: (i: number) => void;
}) {
  const { langT } = useSite();
  const t = translations[langT];
  const isAr = langT === "ar";
  const [zoom, setZoom] = useState(1);
  const [pan,  setPan]  = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState(false);
  const dragRef    = useRef({ sx: 0, sy: 0, px: 0, py: 0 });
  const imgAreaRef = useRef<HTMLDivElement>(null);
  const prevIdx    = useRef(index);
  const [dir, setDir] = useState(0);

  useEffect(() => {
    setDir(index > prevIdx.current ? 1 : -1);
    prevIdx.current = index;
    setZoom(1); setPan({ x: 0, y: 0 });
  }, [index]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft"  && index > 0)                onChange(index - 1);
      if (e.key === "ArrowRight" && index < items.length - 1) onChange(index + 1);
      if (e.key === "+" || e.key === "=") setZoom(z => Math.min(5, z + 0.5));
      if (e.key === "-")                  setZoom(z => Math.max(1, z - 0.5));
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [index, items.length, onClose, onChange]);

  useEffect(() => {
    const el = imgAreaRef.current;
    if (!el) return;
    const h = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(z => Math.min(5, Math.max(1, z - e.deltaY * 0.002)));
    };
    el.addEventListener("wheel", h, { passive: false });
    return () => el.removeEventListener("wheel", h);
  }, []);

  const onMD = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault(); setDrag(true);
    dragRef.current = { sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y };
  };
  const onMM = (e: React.MouseEvent) => {
    if (!drag) return;
    setPan({ x: dragRef.current.px + e.clientX - dragRef.current.sx,
              y: dragRef.current.py + e.clientY - dragRef.current.sy });
  };
  const tx = useRef(0);
  const onTS = (e: React.TouchEvent) => { tx.current = e.touches[0].clientX; };
  const onTE = (e: React.TouchEvent) => {
    if (zoom > 1) return;
    const dx = e.changedTouches[0].clientX - tx.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0 && index < items.length - 1) onChange(index + 1);
      if (dx > 0 && index > 0) onChange(index - 1);
    }
  };

  const item = items[index];
  const sv = {
    enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  return (
    <motion.div className="fixed inset-0 z-[200] bg-black flex flex-col"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}>
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 flex-shrink-0 bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <span className="text-[#b8955a] text-xs tracking-[0.4em] uppercase font-semibold">{index + 1} / {items.length}</span>
          <div className="flex items-center gap-1 border-l border-white/10 pl-3">
            <button onClick={() => setZoom(z => Math.max(1, z - 0.5))} disabled={zoom <= 1}
              className="w-8 h-8 flex items-center justify-center border border-white/20 text-white/60 hover:border-[#b8955a] hover:text-[#b8955a] disabled:opacity-20 transition-all text-xl">−</button>
            <span className="text-white/40 text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(5, z + 0.5))} disabled={zoom >= 5}
              className="w-8 h-8 flex items-center justify-center border border-white/20 text-white/60 hover:border-[#b8955a] hover:text-[#b8955a] disabled:opacity-20 transition-all text-xl">+</button>
            {zoom > 1 && (
              <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                className="ml-1 px-2 py-1 text-[9px] tracking-widest uppercase text-white/30 hover:text-[#b8955a] border border-white/10 hover:border-[#b8955a] transition-all">reset</button>
            )}
          </div>
          {zoom === 1 && <span className="hidden sm:block text-[9px] tracking-[0.3em] text-white/20 uppercase">{t.scrollZoom}</span>}
        </div>
        <button onClick={onClose}
          className="w-9 h-9 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-[#b8955a] transition-all text-xl">✕</button>
      </div>

      <div className={`flex-1 flex overflow-hidden flex-col sm:flex-row ${isAr ? "sm:flex-row-reverse" : ""}`}>
        <div ref={imgAreaRef}
          className="flex-1 relative overflow-hidden bg-[#050505] flex items-center justify-center"
          style={{ minHeight: "50vh", cursor: zoom > 1 ? (drag ? "grabbing" : "grab") : "default" }}
          onMouseDown={onMD} onMouseMove={onMM}
          onMouseUp={() => setDrag(false)} onMouseLeave={() => setDrag(false)}
          onTouchStart={onTS} onTouchEnd={onTE}>
          <AnimatePresence custom={dir} mode="wait">
            <motion.img key={index} src={item.src} alt={item.title}
              custom={dir} variants={sv} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                maxHeight: "100%", maxWidth: "100%", objectFit: "contain",
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transition: drag ? "none" : "transform 0.1s ease-out",
                userSelect: "none", pointerEvents: "none",
              }}
              draggable={false} />
          </AnimatePresence>
          {index > 0 && (
            <button onClick={() => onChange(index - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/60 border border-white/20 text-white/70 hover:bg-[#b8955a] hover:border-[#b8955a] hover:text-white transition-all text-2xl z-10">‹</button>
          )}
          {index < items.length - 1 && (
            <button onClick={() => onChange(index + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/60 border border-white/20 text-white/70 hover:bg-[#b8955a] hover:border-[#b8955a] hover:text-white transition-all text-2xl z-10">›</button>
          )}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {items.map((_, i) => (
              <button key={i} onClick={() => onChange(i)}
                className={`transition-all duration-300 ${i === index ? "w-8 h-[3px] bg-[#b8955a]" : "w-3 h-[3px] bg-white/20 hover:bg-white/50"}`} />
            ))}
          </div>
        </div>

        <div className={`w-full sm:w-[320px] md:w-[380px] flex-shrink-0 bg-[#0d0d0d]
                         ${isAr ? "sm:border-r" : "sm:border-l"} border-white/10
                         border-t sm:border-t-0 flex flex-col justify-center
                         px-6 sm:px-8 py-6 sm:py-10 overflow-y-auto`}>
          <AnimatePresence mode="wait">
            <motion.div key={index}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
              className={isAr ? "text-right" : ""}>
              <p className="text-[9px] tracking-[0.5em] text-[#b8955a] uppercase mb-4 font-semibold">{index + 1} / {items.length}</p>
              <h2 className="text-white text-lg sm:text-2xl font-semibold tracking-[0.1em] uppercase leading-snug mb-5">{item.title}</h2>
              <div className="w-10 h-[1px] bg-[#b8955a] mb-6" />
              <div className="space-y-4">
                {item.medium   && <div><p className="text-[9px] tracking-[0.45em] text-neutral-500 uppercase mb-1 font-semibold">{isAr ? "الخامة" : "Medium"}</p><p className="text-neutral-200 text-sm italic leading-relaxed">{item.medium}</p></div>}
                {item.dims     && <div><p className="text-[9px] tracking-[0.45em] text-neutral-500 uppercase mb-1 font-semibold">{isAr ? "الأبعاد" : "Dimensions"}</p><p className="text-neutral-200 text-sm tracking-wider">{item.dims}</p></div>}
                {item.year     && <div><p className="text-[9px] tracking-[0.45em] text-neutral-500 uppercase mb-1 font-semibold">{isAr ? "السنة" : "Year"}</p><p className="text-neutral-200 text-sm tracking-widest">{item.year}</p></div>}
                {item.location && <div><p className="text-[9px] tracking-[0.45em] text-neutral-500 uppercase mb-1 font-semibold">{isAr ? "الموقع" : "Location"}</p><p className="text-[#f0cc8a] text-sm leading-relaxed">{item.location}</p></div>}
              </div>
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3">
                <button onClick={() => index > 0 && onChange(index - 1)} disabled={index === 0}
                  className="flex-1 py-3 border border-white/15 text-white/50 hover:border-[#b8955a] hover:text-[#b8955a] disabled:opacity-20 transition-all text-xs tracking-[0.3em] uppercase text-center font-semibold">
                  ‹ {t.prev}
                </button>
                <button onClick={() => index < items.length - 1 && onChange(index + 1)} disabled={index === items.length - 1}
                  className="flex-1 py-3 border border-white/15 text-white/50 hover:border-[#b8955a] hover:text-[#b8955a] disabled:opacity-20 transition-all text-xs tracking-[0.3em] uppercase text-center font-semibold">
                  {t.next} ›
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function Preloader({ onDone }: { onDone: () => void }) {
  useEffect(() => { const id = setTimeout(onDone, 2200); return () => clearTimeout(id); }, [onDone]);
  return (
    <motion.div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
      exit={{ opacity: 0, transition: { duration: 1.0 } }}>
      <motion.div className="absolute bottom-0 left-0 h-[2px] bg-[#b8955a]"
        initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2, ease: "easeInOut" }} />
      <motion.p className="text-[9px] tracking-[0.55em] text-neutral-400 uppercase mb-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
        — Byzantine Iconographer —
      </motion.p>
      <motion.h1 className="font-cormorant font-semibold tracking-[0.5em] uppercase text-white text-center"
        style={{ fontSize: "clamp(2rem,5vw,4.5rem)" }}
        initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}>
        Dana Fawaz
      </motion.h1>
      <motion.h1 className="font-cormorant font-semibold tracking-[0.5em] uppercase italic text-center"
        style={{ fontSize: "clamp(2rem,5vw,4.5rem)", color: "#b8955a" }}
        initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.9 }}>
        Dahdal
      </motion.h1>
    </motion.div>
  );
}

function ArtCard({ src, title, medium, dims, year, location, delay = 0, onClick }: {
  src: string; title: string; medium: string; dims: string; year: string;
  location: string; delay?: number; onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className="group cursor-pointer" onClick={onClick}>
      <div className="overflow-hidden relative bg-neutral-100 dark:bg-neutral-900" style={{ paddingBottom: "133%" }}>
        <img src={src} alt={title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
          <p className="text-white text-[9px] sm:text-[10px] tracking-[0.28em] uppercase font-semibold">{title}</p>
          <p className="text-[#f0cc8a] text-[8px] sm:text-[9px] tracking-[0.22em] mt-1">{location}</p>
        </div>
        <div className="absolute top-2 right-2 w-7 h-7 bg-black/55 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-white fill-none" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/><path d="m21 21-3.5-3.5M8 11h6M11 8v6"/>
          </svg>
        </div>
      </div>
      <div className="mt-3 pb-3 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-baseline gap-2">
        <div className="min-w-0">
          <h4 className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-semibold truncate">{title}</h4>
          <p className="text-[9px] sm:text-[10px] text-neutral-500 italic mt-0.5 truncate">{medium}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-[9px] sm:text-[10px] tracking-widest text-neutral-400 block">{dims}</span>
          <span className="text-[9px] sm:text-[10px] tracking-widest text-neutral-400 block">{year}</span>
        </div>
      </div>
    </motion.div>
  );
}

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 1 }}
      className="text-center mb-10 sm:mb-16 md:mb-20">
      {label && <p className="text-xs tracking-[0.5em] text-neutral-400 uppercase mb-4 sm:mb-6 font-semibold">{label}</p>}
      <h2 className="font-semibold tracking-[0.3em] sm:tracking-[0.4em] uppercase italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl">{title}</h2>
      <div className="w-8 h-[1px] bg-[#b8955a] mx-auto mt-5 sm:mt-8" />
    </motion.div>
  );
}

/* ══════════════════════════════════
   PAGINATION
   ─────────────────────────────────
   الحل النهائي:
   - الزر بيغيّر الـ page في state
   - useEffect بيراقب page تحديداً
   - عند التغيير: scrollIntoView مباشرة على الـ section
   - isFirstMount يمنع الـ scroll عند أول تحميل
══════════════════════════════════ */
function usePagination(total: number) {
  const [page, setPage]   = useState(1);
  const anchorRef          = useRef<HTMLDivElement>(null);
  const isFirstMount       = useRef(true);
  const prevPage           = useRef(1);

  useEffect(() => {
    // مش بنعمل scroll أول مرة أو لو الصفحة مش اتغيرت
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (page === prevPage.current) return;
    prevPage.current = page;

    // scroll للـ anchor اللي فوق أزرار الـ pagination مباشرة
    const anchor = anchorRef.current;
    if (!anchor) return;

    setTimeout(() => {
      const rect = anchor.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top - 100; // 100px = navbar + margin
      window.scrollTo({ top: scrollTop, behavior: "smooth" });
    }, 50);
  }, [page]);

  const changePage = (p: number) => {
    if (p === page) return;
    setPage(p);
  };

  return { page, changePage, anchorRef, totalPages: total };
}

function PaginationBar({ page, total, onChange }: {
  page: number; total: number; onChange: (p: number) => void;
}) {
  if (total <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-2 mt-10 sm:mt-16">
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}
        className="w-10 h-10 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 disabled:opacity-25 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all text-lg">‹</button>
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-10 h-10 flex items-center justify-center border text-sm tracking-widest transition-all font-semibold ${p === page ? "bg-[#b8955a] border-[#b8955a] text-white" : "border-neutral-300 dark:border-neutral-700 hover:border-[#b8955a] hover:text-[#b8955a]"}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(Math.min(total, page + 1))} disabled={page === total}
        className="w-10 h-10 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 disabled:opacity-25 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all text-lg">›</button>
    </div>
  );
}

const PER_PAGE = 8;

/* ══════════════════════════════════
   GALLERY SECTION
══════════════════════════════════ */
function GallerySection() {
  const { langT } = useSite();
  const t = translations[langT];
  type TabKey = "icons" | "gilding" | "mosaic";
  const [active, setActive] = useState<TabKey>("icons");
  const [lbIdx,  setLbIdx]  = useState<number | null>(null);

  const allItems   = galleryData[active];
  const totalPages = Math.ceil(allItems.length / PER_PAGE);

  // pagination منفصلة لكل tab
  const iconsPag   = usePagination(Math.ceil(galleryData.icons.length   / PER_PAGE));
  const gildingPag = usePagination(Math.ceil(galleryData.gilding.length / PER_PAGE));
  const mosaicPag  = usePagination(Math.ceil(galleryData.mosaic.length  / PER_PAGE));

  const pag = active === "icons" ? iconsPag : active === "gilding" ? gildingPag : mosaicPag;
  const pageItems = allItems.slice((pag.page - 1) * PER_PAGE, pag.page * PER_PAGE);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "icons",   label: t.tabs[0] },
    { key: "gilding", label: t.tabs[1] },
    { key: "mosaic",  label: t.tabs[2] },
  ];

  return (
    <>
      <AnimatePresence>
        {lbIdx !== null && (
          <Lightbox items={allItems} index={lbIdx}
            onClose={() => setLbIdx(null)} onChange={i => setLbIdx(i)} />
        )}
      </AnimatePresence>

      <section id="gallery" className="px-4 sm:px-8 md:px-16 lg:px-28 py-16 sm:py-28 md:py-40">
        {/* ── anchor: الـ scroll بيجيلي هنا ── */}
        <div ref={pag.anchorRef} />

        <SectionHeader label={`— ${t.selectedWorks} —`} title={t.gallery} />

        <div className="flex justify-center mb-10 sm:mb-16 overflow-x-auto pb-1">
          <div className="flex border border-neutral-200 dark:border-neutral-800 min-w-max">
            {tabs.map(tab => (
              <button key={tab.key}
                onClick={() => { setActive(tab.key); }}
                className={`relative px-5 sm:px-8 md:px-10 py-3 sm:py-3.5 text-[10px] sm:text-xs md:text-sm tracking-[0.3em] uppercase transition-all duration-500 whitespace-nowrap font-semibold border-r border-neutral-200 dark:border-neutral-800 last:border-r-0 ${active === tab.key ? "bg-neutral-900 dark:bg-white text-white dark:text-black" : "text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"}`}>
                {tab.label}
                {active === tab.key && <motion.span layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#b8955a]" />}
              </button>
            ))}
          </div>
        </div>

        <motion.div key={`${active}-${pag.page}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-8">
          {pageItems.map((item, i) => (
            <ArtCard key={`${active}-${pag.page}-${i}`} {...item} delay={i * 0.05}
              onClick={() => setLbIdx((pag.page - 1) * PER_PAGE + i)} />
          ))}
        </motion.div>

        <PaginationBar page={pag.page} total={totalPages} onChange={pag.changePage} />
      </section>
    </>
  );
}

/* ══════════════════════════════════
   EXHIBITIONS SECTION
══════════════════════════════════ */
function ExhibitionsSection() {
  const { langT } = useSite();
  const t = translations[langT];
  const [lbIdx, setLbIdx] = useState<number | null>(null);

  const totalPages = Math.ceil(variousWorks.length / PER_PAGE);
  const pag        = usePagination(totalPages);
  const pageItems  = variousWorks.slice((pag.page - 1) * PER_PAGE, pag.page * PER_PAGE);

  return (
    <>
      <AnimatePresence>
        {lbIdx !== null && (
          <Lightbox items={variousWorks} index={lbIdx}
            onClose={() => setLbIdx(null)} onChange={i => setLbIdx(i)} />
        )}
      </AnimatePresence>

      <section id="various" className="px-4 sm:px-8 md:px-16 lg:px-28 py-16 sm:py-28 md:py-40 bg-neutral-100 dark:bg-neutral-950">
        {/* ── anchor ── */}
        <div ref={pag.anchorRef} />

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#b8955a]/40 to-transparent mb-10 sm:mb-16" />
        <SectionHeader label="" title={t.various} />

        <motion.div key={`various-${pag.page}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-8">
          {pageItems.map((item, i) => (
            <ArtCard key={`various-${pag.page}-${i}`} {...item} delay={i * 0.05}
              onClick={() => setLbIdx((pag.page - 1) * PER_PAGE + i)} />
          ))}
        </motion.div>

        <PaginationBar page={pag.page} total={totalPages} onChange={pag.changePage} />
      </section>
    </>
  );
}

/* ══════════════════════════════════
   HOME
══════════════════════════════════ */
export default function Home() {
  const { langT } = useSite();
  const t = translations[langT];
  const isAr = langT === "ar";
  const [showPreloader, setShowPreloader] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("visited")) {
      setShowPreloader(true);
      sessionStorage.setItem("visited", "1");
    }
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showPreloader && <Preloader key="preloader" onDone={() => setShowPreloader(false)} />}
      </AnimatePresence>

      <main className={`bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white overflow-x-hidden ${isAr ? "font-cairo" : "font-cormorant"}`}>

        {/* HERO */}
        <section className="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden">
          <div className="absolute inset-0">
            <img src="/hero.png" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/45" />
          </div>
          <div className="relative z-10">
            <p className="text-[9px] sm:text-[10px] tracking-[0.5em] text-neutral-300 uppercase mb-8 sm:mb-10 font-semibold">— {t.sacredArt} —</p>
            <h1 className="font-cormorant font-semibold tracking-[0.4em] sm:tracking-[0.5em] uppercase text-3xl sm:text-4xl md:text-5xl mb-2 text-white">Dana Fawaz</h1>
            <h1 className="font-cormorant font-semibold tracking-[0.4em] sm:tracking-[0.5em] uppercase italic text-3xl sm:text-4xl md:text-5xl mb-10 sm:mb-12" style={{ color: "#d4af7a" }}>Dahdal</h1>
            <p className="text-[9px] sm:text-[10px] tracking-[0.4em] text-neutral-300 uppercase font-medium">{t.role}</p>
            <div className="w-8 h-[1px] bg-[#b8955a] mx-auto mt-8 sm:mt-10" />
          </div>
        </section>

        <GallerySection />

        {/* MURALS */}
        <section id="murals" className="bg-[#0a0a0a] py-16 sm:py-24 md:py-40 overflow-hidden">
          <div className="text-center mb-12 sm:mb-20 md:mb-32 select-none px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
              <span className="block font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase"
                style={{ fontSize: "clamp(2.5rem,8vw,7rem)", color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.18)" }}>
                {t.muralsLabel}
              </span>
              <span className="block font-extrabold tracking-[0.4em] sm:tracking-[0.5em] uppercase text-[#b8955a] -mt-2 sm:-mt-4"
                style={{ fontSize: "clamp(1.6rem,5vw,4rem)", textShadow: "0 0 20px rgba(184,149,90,0.3)" }}>
                {t.andDomes}
              </span>
            </motion.div>
            <motion.div initial={{ width: 0 }} whileInView={{ width: "80px" }}
              transition={{ duration: 1, delay: 0.4 }} viewport={{ once: true }}
              className="h-[1px] mx-auto mt-8"
              style={{ background: "linear-gradient(to right, transparent, #b8955a, transparent)" }} />
          </div>

          <div className="overflow-hidden">
            <div className="flex gap-4 sm:gap-8 murals-ticker" style={{ width: "max-content" }}>
              {[...muralsData, ...muralsData, ...muralsData].map((m, i) => (
                <div key={i} className="relative group flex-shrink-0 overflow-hidden" style={{ width: "clamp(280px,38vw,600px)" }}>
                  <img src={m.src} alt={m.title} loading={i < 10 ? "eager" : "lazy"}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    style={{ height: "clamp(200px,26vw,450px)" }} />
                  <div className="absolute inset-0 bg-black/45 group-hover:bg-black/20 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8">
                    <p className="text-white text-[10px] sm:text-sm tracking-[0.3em] uppercase font-semibold mb-1">{m.title}</p>
                    <p className="text-[#f0cc8a] text-[9px] sm:text-[10px] tracking-[0.25em] uppercase mb-2">{m.location}</p>
                    <div className="flex flex-wrap gap-2 text-[9px] tracking-[0.2em] text-neutral-300 uppercase">
                      <span>{m.medium}</span><span className="text-neutral-600">·</span>
                      <span>{m.size}</span><span className="text-neutral-600">·</span>
                      <span>{m.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12 sm:mt-16 md:mt-20">
            <a href="/murals"
              className="group inline-flex items-center gap-4 border border-neutral-700 text-neutral-300 px-8 sm:px-12 py-4 tracking-[0.35em] text-sm uppercase font-semibold hover:bg-[#b8955a] hover:border-[#b8955a] hover:text-white transition-all duration-500">
              {t.exploreMurals}
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </a>
          </div>
        </section>

        <ExhibitionsSection />

        {/* ABOUT */}
        <section id="about" className="py-20 sm:py-40 md:py-60 px-4 sm:px-10 md:px-20 lg:px-32 bg-[#f9f9f9] dark:bg-[#080808] overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16 md:gap-20 items-center">
            <motion.div className="lg:col-span-5 relative"
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.4 }} viewport={{ once: true }}>
              <div className="absolute -inset-4 border border-[#b8955a]/25 translate-x-6 translate-y-6 hidden md:block" />
              <div className="relative overflow-hidden shadow-2xl" style={{ paddingBottom: "133%" }}>
                <motion.img src="/icons/artist.png" alt="Dana Fawaz Dahdal"
                  className="absolute inset-0 w-full h-full object-cover"
                  whileHover={{ scale: 1.04 }} transition={{ duration: 1.2 }} />
              </div>
              <p className="mt-5 sm:mt-8 text-xs tracking-[0.4em] uppercase text-neutral-400 text-center font-medium">{t.handCaption}</p>
            </motion.div>
            <div className="lg:col-span-7 space-y-8 sm:space-y-14">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }} viewport={{ once: true }}>
                <span className="text-[#b8955a] text-xs sm:text-sm tracking-[0.5em] uppercase block mb-3 font-semibold">{t.philosophy}</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[0.1em] leading-tight">{t.beyondVisible}</h2>
              </motion.div>
              <motion.div className="space-y-5 sm:space-y-8 text-neutral-600 dark:text-neutral-400 leading-[1.9] sm:leading-[2.2] text-base sm:text-lg max-w-xl"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }} viewport={{ once: true }}>
                <p>{t.bio1}</p>
                <p className="border-l-2 border-[#b8955a] pl-5 sm:pl-8 py-2 italic">{t.quote}</p>
                <p>{t.bio2}</p>
              </motion.div>
              <motion.div className="flex flex-wrap gap-3 sm:gap-6"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }} viewport={{ once: true }}>
                {socials.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 border border-neutral-300 dark:border-neutral-700 text-sm tracking-[0.3em] uppercase font-semibold text-neutral-700 dark:text-neutral-300 transition-all duration-300"
                    onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = s.color; el.style.color = s.color; }}
                    onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = ""; el.style.color = ""; }}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0"><path d={s.path}/></svg>{s.label}
                  </a>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="bg-neutral-100 dark:bg-neutral-950 py-16 sm:py-28 md:py-40 px-4 sm:px-6 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1 }} className="w-full max-w-xl">
            <SectionHeader label={`— ${t.commissionWork} —`} title={t.contact} />
            <div className="flex flex-col gap-0">
              {[
                { placeholder: t.yourName,     type: "text",  id: "cname",    label: t.name },
                { placeholder: t.emailAddress, type: "email", id: "cemail",   label: t.email },
                { placeholder: t.subject,      type: "text",  id: "csubject", label: t.subject },
              ].map((f, i) => (
                <div key={i} className="relative group">
                  <label htmlFor={f.id} className="block text-xs sm:text-sm tracking-[0.4em] uppercase text-neutral-600 dark:text-neutral-300 pt-5 pb-1 font-semibold">{f.label}</label>
                  <input id={f.id} type={f.type} placeholder={f.placeholder}
                    className="w-full bg-transparent border-b-2 border-neutral-400 dark:border-neutral-600 pb-3 text-sm sm:text-base text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none transition-all duration-300" />
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#b8955a] group-focus-within:w-full transition-all duration-500" />
                </div>
              ))}
              <div className="relative group">
                <label htmlFor="cmsg" className="block text-xs sm:text-sm tracking-[0.4em] uppercase text-neutral-600 dark:text-neutral-300 pt-6 pb-1 font-semibold">{t.message}</label>
                <textarea id="cmsg" placeholder={t.yourMessage}
                  className="w-full bg-transparent border-b-2 border-neutral-400 dark:border-neutral-600 pb-3 text-sm sm:text-base text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none resize-none h-28 sm:h-32 transition-all duration-300" />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#b8955a] group-focus-within:w-full transition-all duration-500" />
              </div>
              <button className="mt-10 sm:mt-14 group flex items-center justify-between w-full border-2 border-neutral-500 dark:border-neutral-400 px-6 sm:px-8 py-4 text-sm tracking-[0.4em] uppercase font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-transparent transition-all duration-500">
                {t.sendMessage}<span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </button>
              <div className="flex justify-center gap-8 mt-10 sm:mt-14">
                {socials.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="text-neutral-600 dark:text-neutral-300 hover:text-[#b8955a] transition duration-300 flex items-center gap-2 text-sm tracking-[0.3em] uppercase font-semibold">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0"><path d={s.path}/></svg>{s.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="bg-black py-8 sm:py-12 px-4 flex justify-center">
          <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs tracking-[0.4em] uppercase text-neutral-700 border-t border-neutral-900 pt-6 sm:pt-8">
            <span className="font-medium">{t.copyright}</span>
            <div className="flex gap-6 sm:gap-8">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="hover:text-neutral-400 transition duration-300">{s.label}</a>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}