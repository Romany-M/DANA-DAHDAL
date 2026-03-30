/* app/murals/page.tsx */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSite } from "../context/SiteContext";
import { translations } from "../lib/translations";
import { supabase } from "../lib/supabase";
import type { DbImage } from "../lib/supabase";

type MuralItem = DbImage;

/* ══════════════════════════════════
   WATERMARK — Shutterstock style
══════════════════════════════════ */
function WatermarkOverlay() {
  const id = useRef(`wm-${Math.random().toString(36).slice(2, 8)}`).current;
  return (
    <svg
      direction="ltr"
      style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", userSelect: "none", zIndex: 5,
        direction: "ltr",
      }}
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <pattern id={id} x="0" y="0" width="190" height="95"
          patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
          <text x="8" y="26"
            fontFamily="'Cormorant Garamond',serif"
            fontSize="11" fontWeight="400" letterSpacing="4"
            fill="rgba(255,255,255,0.22)">
            DANA DAHDAL
          </text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* ══════════════════════════════════
   MURAL MODAL
   ✦ zoom fix: capture:true + stopImmediatePropagation
   ✦ lenis stop/start
   ✦ watermark على الصورة داخل الـ lightbox
══════════════════════════════════ */
function MuralModal({ items, index, onClose, onChange }: {
  items: MuralItem[]; index: number;
  onClose: () => void; onChange: (i: number) => void;
}) {
  const { langT } = useSite();
  const t    = translations[langT];
  const isAr = langT === "ar";

  useEffect(() => {
    document.dispatchEvent(new CustomEvent("lenis:stop"));
    document.body.style.overflow = "hidden";
    return () => {
      document.dispatchEvent(new CustomEvent("lenis:start"));
      document.body.style.overflow = "";
    };
  }, []);

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
      e.stopImmediatePropagation();
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      setZoom(z => parseFloat(Math.min(5, Math.max(1, z + delta)).toFixed(1)));
    };
    el.addEventListener("wheel", h, { passive: false, capture: true });
    return () => el.removeEventListener("wheel", h, { capture: true } as EventListenerOptions);
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
      if (dx > 0 && index > 0)                onChange(index - 1);
    }
  };

  const item = items[index];
  const displayTitle    = (isAr && item.title_ar)    ? item.title_ar    : item.title;
  const displayMedium   = (isAr && item.medium_ar)   ? item.medium_ar   : item.medium;
  const displayLocation = (isAr && item.location_ar) ? item.location_ar : item.location;

  const sv = {
    enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -80 : 80 }),
  };

  return (
    <motion.div className="fixed inset-0 z-[200] bg-black flex flex-col"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}>

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 flex-shrink-0 bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <span className="text-[#b8955a] text-xs tracking-[0.4em] uppercase font-semibold">
            {index + 1} / {items.length}
          </span>
          <div className="flex items-center gap-1 border-l border-white/10 pl-3">
            <button onClick={() => setZoom(z => Math.max(1, parseFloat((z - 0.5).toFixed(1))))} disabled={zoom <= 1}
              className="w-8 h-8 flex items-center justify-center border border-white/20 text-white/60 hover:border-[#b8955a] hover:text-[#b8955a] disabled:opacity-20 transition-all text-xl select-none">−</button>
            <span className="text-white/50 text-xs w-14 text-center select-none">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(5, parseFloat((z + 0.5).toFixed(1))))} disabled={zoom >= 5}
              className="w-8 h-8 flex items-center justify-center border border-white/20 text-white/60 hover:border-[#b8955a] hover:text-[#b8955a] disabled:opacity-20 transition-all text-xl select-none">+</button>
            {zoom > 1 && (
              <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                className="ml-1 px-2 py-1 text-[9px] tracking-widest uppercase text-white/30 hover:text-[#b8955a] border border-white/10 hover:border-[#b8955a] transition-all">
                reset
              </button>
            )}
          </div>
          {zoom === 1 && (
            <span className="hidden sm:block text-[9px] tracking-[0.3em] text-white/20 uppercase">{t.scrollZoom}</span>
          )}
        </div>
        <button onClick={onClose}
          className="w-9 h-9 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-[#b8955a] transition-all text-xl">✕</button>
      </div>

      {/* Split */}
      <div className={`flex-1 flex overflow-hidden flex-col sm:flex-row ${isAr ? "sm:flex-row-reverse" : ""}`}>

        {/* Image area */}
        <div ref={imgAreaRef}
          className="flex-1 relative overflow-hidden bg-[#050505] flex items-center justify-center"
          style={{ minHeight: "50vh", cursor: zoom > 1 ? (drag ? "grabbing" : "grab") : "default" }}
          onMouseDown={onMD} onMouseMove={onMM}
          onMouseUp={() => setDrag(false)} onMouseLeave={() => setDrag(false)}
          onTouchStart={onTS} onTouchEnd={onTE}
          onContextMenu={e => e.preventDefault()}>

          <AnimatePresence custom={dir} mode="wait">
            <motion.div key={index}
              custom={dir} variants={sv} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transition: drag ? "none" : "transform 0.15s ease-out",
                transformOrigin: "center center",
                display: "flex", alignItems: "center", justifyContent: "center",
                maxWidth: "100%", maxHeight: "100%", position: "relative",
              }}>
              <img src={item.src} alt={displayTitle}
                style={{ maxWidth: "100%", maxHeight: "85vh", objectFit: "contain",
                         userSelect: "none", pointerEvents: "none", display: "block" }}
                draggable={false} />
              {/* ✦ watermark على صورة الـ lightbox */}
              <WatermarkOverlay />
            </motion.div>
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

        {/* Details Panel */}
        <div className={`w-full sm:w-[320px] md:w-[380px] flex-shrink-0 bg-[#0d0d0d]
                         ${isAr ? "sm:border-r" : "sm:border-l"} border-white/10
                         border-t sm:border-t-0 flex flex-col justify-center
                         px-6 sm:px-8 py-6 sm:py-10 overflow-y-auto`}>
          <AnimatePresence mode="wait">
            <motion.div key={index}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
              className={isAr ? "text-right" : ""}>
              <p className="text-[9px] tracking-[0.5em] text-[#b8955a] uppercase mb-4 font-semibold">
                {index + 1} / {items.length}
              </p>
              <h2 className="text-white text-lg sm:text-2xl font-semibold tracking-[0.1em] uppercase leading-snug mb-5">
                {displayTitle}
              </h2>
              <div className="w-10 h-[1px] bg-[#b8955a] mb-6" />
              <div className="space-y-4">
                {displayLocation && (
                  <div>
                    <p className="text-[9px] tracking-[0.45em] text-neutral-500 uppercase mb-1 font-semibold">
                      {isAr ? "الموقع" : "Location"}
                    </p>
                    <p className="text-[#f0cc8a] text-sm leading-relaxed">{displayLocation}</p>
                  </div>
                )}
                {displayMedium && (
                  <div>
                    <p className="text-[9px] tracking-[0.45em] text-neutral-500 uppercase mb-1 font-semibold">
                      {isAr ? "الخامة" : "Medium"}
                    </p>
                    <p className="text-neutral-200 text-sm italic">{displayMedium}</p>
                  </div>
                )}
                {item.size && (
                  <div>
                    <p className="text-[9px] tracking-[0.45em] text-neutral-500 uppercase mb-1 font-semibold">
                      {isAr ? "المساحة" : "Scale"}
                    </p>
                    <p className="text-[#b8955a] text-sm font-semibold tracking-wider">{item.size}</p>
                  </div>
                )}
                {item.year && (
                  <div>
                    <p className="text-[9px] tracking-[0.45em] text-neutral-500 uppercase mb-1 font-semibold">
                      {isAr ? "السنة" : "Year"}
                    </p>
                    <p className="text-neutral-200 text-sm tracking-widest">{item.year}</p>
                  </div>
                )}
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
              <a href="/#contact"
                className="block mt-4 py-3 text-center border border-[#b8955a] text-[#b8955a] text-[9px] tracking-[0.45em] uppercase font-semibold hover:bg-[#b8955a] hover:text-black transition-all duration-300">
                {isAr ? "طلب عمل مماثل ←" : "COMMISSION SIMILAR WORK →"}
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

const PER_PAGE = 8;

export default function MuralsPage() {
  const { langT } = useSite();
  const t    = translations[langT];
  const isAr = langT === "ar";

  const [items,   setItems]   = useState<MuralItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [lbIdx,   setLbIdx]   = useState<number | null>(null);

  useEffect(() => {
    supabase.from("images").select("*").eq("section", "murals")
      .order("created_at", { ascending: true })
      .then(({ data }) => { setItems(data ?? []); setLoading(false); });
  }, []);

  const totalPages = Math.ceil(items.length / PER_PAGE);
  const pageItems  = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleBack = () => {
    sessionStorage.setItem("visited", "1");
    window.history.length > 1 ? window.history.back() : (window.location.href = "/");
  };

  return (
    <>
      <AnimatePresence>
        {lbIdx !== null && (
          <MuralModal
            items={items}
            index={lbIdx}
            onClose={() => setLbIdx(null)}
            onChange={i => setLbIdx(i)}
          />
        )}
      </AnimatePresence>

      <main className={`min-h-screen bg-[#0a0a0a] text-white pt-20 sm:pt-28 pb-20 ${isAr ? "font-cairo" : "font-cormorant"}`}>

        {/* Back */}
        <div className="px-4 sm:px-8 md:px-16 mb-8 sm:mb-14">
          <button onClick={handleBack}
            className="inline-flex items-center gap-3 text-neutral-500 hover:text-[#b8955a] text-sm tracking-[0.4em] uppercase transition-colors duration-300 font-semibold">
            ← {isAr ? "العودة للموقع" : "Back to Home"}
          </button>
        </div>

        {/* Header */}
        <div className="text-center px-4 mb-12 sm:mb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <p className="text-xs tracking-[0.5em] text-neutral-500 uppercase mb-5 font-semibold">— Sacred Spaces —</p>
            <h1 className="font-semibold tracking-[0.4em] sm:tracking-[0.5em] uppercase italic text-3xl sm:text-4xl md:text-5xl">
              {t.muralsLabel}
            </h1>
            <p className="text-[#b8955a] text-sm sm:text-base tracking-[0.4em] uppercase font-semibold mt-3">
              {t.andDomes}
            </p>
            <div className="w-8 h-[1px] bg-[#b8955a] mx-auto mt-6 sm:mt-8" />
          </motion.div>
        </div>

        {/* Grid */}
        <div className="px-4 sm:px-8 md:px-16 lg:px-20">
          {loading ? (
            <div className="flex justify-center py-32">
              <span className="w-8 h-8 border-2 border-[#b8955a] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <motion.div
                key={page}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {pageItems.map((m, i) => {
                  const globalIdx = (page - 1) * PER_PAGE + i;
                  const mTitle    = (isAr && m.title_ar) ? m.title_ar : m.title;
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
                      className="group cursor-pointer"
                      onClick={() => setLbIdx(globalIdx)}>

                      {/* ✦ صورة نظيفة — بدون أي overlay أو تفاصيل */}
                      <div className="relative overflow-hidden bg-neutral-900"
                        style={{ paddingBottom: "125%" }}
                        onContextMenu={e => e.preventDefault()}>
                        <img src={m.src} alt={mTitle}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          style={{ pointerEvents: "none" }}
                          draggable={false} />
                        {/* ✦ watermark على كل صورة في الـ grid */}
                        <WatermarkOverlay />
                      </div>

                      {/* ✦ الاسم فقط تحت الصورة */}
                      <div className={`mt-3 pb-3 border-b border-neutral-800 ${isAr ? "text-right" : ""}`}>
                        <h4 className="text-[10px] sm:text-xs tracking-[0.25em] uppercase font-semibold text-neutral-200 truncate">
                          {mTitle}
                        </h4>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 sm:mt-16">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-10 h-10 flex items-center justify-center border border-neutral-700 text-white/60 text-lg disabled:opacity-25 hover:bg-[#b8955a] hover:border-[#b8955a] hover:text-white transition-all">‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-10 h-10 flex items-center justify-center border text-sm tracking-widest transition-all font-semibold ${p === page ? "bg-[#b8955a] border-[#b8955a] text-white" : "border-neutral-700 text-white/60 hover:border-[#b8955a] hover:text-[#b8955a]"}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-10 h-10 flex items-center justify-center border border-neutral-700 text-white/60 text-lg disabled:opacity-25 hover:bg-[#b8955a] hover:border-[#b8955a] hover:text-white transition-all">›</button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}