/* app/murals/page.tsx */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSite } from "../context/SiteContext";
import { translations } from "../lib/translations";
import { muralsData, MuralItem } from "../lib/data";

/* ══════════════════════════════════
   MURAL MODAL — صورة يسار + تفاصيل يمين
══════════════════════════════════ */
function MuralModal({ items, index, onClose, onChange }: {
  items: MuralItem[]; index: number;
  onClose: () => void; onChange: (i: number) => void;
}) {
  const { langT } = useSite();
  const t = translations[langT];
  const isAr = langT === "ar";

  const [zoom,     setZoom]     = useState(1);
  const [pan,      setPan]      = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef    = useRef({ sx: 0, sy: 0, px: 0, py: 0 });
  const imgAreaRef = useRef<HTMLDivElement>(null);
  const prevIndex  = useRef(index);
  const [dir,      setDir]      = useState(0);

  useEffect(() => {
    setDir(index > prevIndex.current ? 1 : -1);
    prevIndex.current = index;
    setZoom(1); setPan({ x: 0, y: 0 });
  }, [index]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowLeft"  && index > 0)                onChange(index - 1);
      if (e.key === "ArrowRight" && index < items.length - 1) onChange(index + 1);
      if (e.key === "+" || e.key === "=") setZoom(z => Math.min(5, z + 0.5));
      if (e.key === "-")                  setZoom(z => Math.max(1, z - 0.5));
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [index, items.length, onClose, onChange]);

  /* wheel zoom — non-passive */
  useEffect(() => {
    const el = imgAreaRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(z => Math.min(5, Math.max(1, z - e.deltaY * 0.002)));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const onMD = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault(); setDragging(true);
    dragRef.current = { sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y };
  };
  const onMM = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: dragRef.current.px + e.clientX - dragRef.current.sx,
              y: dragRef.current.py + e.clientY - dragRef.current.sy });
  };

  const touchX = useRef(0);
  const onTS = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTE = (e: React.TouchEvent) => {
    if (zoom > 1) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0 && index < items.length - 1) onChange(index + 1);
      if (dx > 0 && index > 0)                onChange(index - 1);
    }
  };

  const item = items[index];
  const slideV = {
    enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  return (
    <motion.div className="fixed inset-0 z-[200] bg-black flex flex-col"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3
                      border-b border-white/10 flex-shrink-0 bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <span className="text-[#b8955a] text-xs tracking-[0.4em] uppercase font-semibold">
            {index + 1} / {items.length}
          </span>
          <div className="flex items-center gap-1 border-l border-white/10 pl-3">
            <button onClick={() => setZoom(z => Math.max(1, z - 0.5))} disabled={zoom <= 1}
              className="w-8 h-8 flex items-center justify-center border border-white/20 text-white/60
                         hover:border-[#b8955a] hover:text-[#b8955a] disabled:opacity-20 transition-all text-xl">−</button>
            <span className="text-white/40 text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(5, z + 0.5))} disabled={zoom >= 5}
              className="w-8 h-8 flex items-center justify-center border border-white/20 text-white/60
                         hover:border-[#b8955a] hover:text-[#b8955a] disabled:opacity-20 transition-all text-xl">+</button>
            {zoom > 1 && (
              <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                className="ml-1 px-2 py-1 text-[9px] tracking-widest uppercase text-white/30
                           hover:text-[#b8955a] border border-white/10 hover:border-[#b8955a] transition-all">
                reset
              </button>
            )}
          </div>
          {zoom === 1 && (
            <span className="hidden sm:block text-[9px] tracking-[0.3em] text-white/20 uppercase">{t.scrollZoom}</span>
          )}
        </div>
        <button onClick={onClose}
          className="w-9 h-9 flex items-center justify-center border border-white/20
                     text-white/60 hover:text-white hover:border-[#b8955a] transition-all text-xl">✕</button>
      </div>

      {/* Split */}
      <div className={`flex-1 flex overflow-hidden flex-col sm:flex-row ${isAr ? "sm:flex-row-reverse" : ""}`}>

        {/* Image */}
        <div ref={imgAreaRef}
          className="flex-1 relative overflow-hidden bg-[#050505] flex items-center justify-center"
          style={{ minHeight: "50vh", cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default" }}
          onMouseDown={onMD} onMouseMove={onMM}
          onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)}
          onTouchStart={onTS} onTouchEnd={onTE}>

          <AnimatePresence custom={dir} mode="wait">
            <motion.img key={index} src={item.src} alt={item.title}
              custom={dir} variants={slideV} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                maxHeight: "100%", maxWidth: "100%", objectFit: "contain",
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transition: dragging ? "none" : "transform 0.1s ease-out",
                userSelect: "none", pointerEvents: "none",
              }}
              draggable={false} />
          </AnimatePresence>

          {index > 0 && (
            <button onClick={() => onChange(index - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center
                         bg-black/60 border border-white/20 text-white/70 hover:bg-[#b8955a]
                         hover:border-[#b8955a] hover:text-white transition-all text-2xl z-10">‹</button>
          )}
          {index < items.length - 1 && (
            <button onClick={() => onChange(index + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center
                         bg-black/60 border border-white/20 text-white/70 hover:bg-[#b8955a]
                         hover:border-[#b8955a] hover:text-white transition-all text-2xl z-10">›</button>
          )}

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {items.map((_, i) => (
              <button key={i} onClick={() => onChange(i)}
                className={`transition-all duration-300 ${i === index ? "w-8 h-[3px] bg-[#b8955a]" : "w-3 h-[3px] bg-white/20 hover:bg-white/50"}`} />
            ))}
          </div>
        </div>

        {/* Details */}
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
                {item.title}
              </h2>
              <div className="w-10 h-[1px] bg-[#b8955a] mb-6" />

              <div className="space-y-4">
                <div>
                  <p className="text-[9px] tracking-[0.45em] text-neutral-500 uppercase mb-1 font-semibold">
                    {isAr ? "الموقع" : "Location"}
                  </p>
                  <p className="text-[#f0cc8a] text-sm leading-relaxed">{item.location}</p>
                </div>
                <div>
                  <p className="text-[9px] tracking-[0.45em] text-neutral-500 uppercase mb-1 font-semibold">
                    {isAr ? "الخامة" : "Medium"}
                  </p>
                  <p className="text-neutral-200 text-sm italic">{item.medium}</p>
                </div>
                <div>
                  <p className="text-[9px] tracking-[0.45em] text-neutral-500 uppercase mb-1 font-semibold">
                    {isAr ? "المساحة" : "Scale"}
                  </p>
                  <p className="text-[#b8955a] text-sm font-semibold tracking-wider">{item.size}</p>
                </div>
                <div>
                  <p className="text-[9px] tracking-[0.45em] text-neutral-500 uppercase mb-1 font-semibold">
                    {isAr ? "السنة" : "Year"}
                  </p>
                  <p className="text-neutral-200 text-sm tracking-widest">{item.year}</p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3">
                <button onClick={() => index > 0 && onChange(index - 1)} disabled={index === 0}
                  className="flex-1 py-3 border border-white/15 text-white/50 hover:border-[#b8955a]
                             hover:text-[#b8955a] disabled:opacity-20 transition-all
                             text-xs tracking-[0.3em] uppercase text-center font-semibold">
                  ‹ {isAr ? "السابق" : "Prev"}
                </button>
                <button onClick={() => index < items.length - 1 && onChange(index + 1)} disabled={index === items.length - 1}
                  className="flex-1 py-3 border border-white/15 text-white/50 hover:border-[#b8955a]
                             hover:text-[#b8955a] disabled:opacity-20 transition-all
                             text-xs tracking-[0.3em] uppercase text-center font-semibold">
                  {isAr ? "التالي" : "Next"} ›
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════
   MURALS PAGE
══════════════════════════════════ */
const PER_PAGE = 8;

export default function MuralsPage() {
  const { langT } = useSite();
  const t = translations[langT];
  const isAr = langT === "ar";
  const [page,  setPage]  = useState(1);
  const [lbIdx, setLbIdx] = useState<number | null>(null);

  const allItems   = muralsData;
  const totalPages = Math.ceil(allItems.length / PER_PAGE);
  const pageItems  = allItems.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /* back to home — بدون preloader */
  const handleBack = () => {
    sessionStorage.setItem("visited", "1");
    window.history.length > 1 ? window.history.back() : (window.location.href = "/");
  };

  return (
    <>
      <AnimatePresence>
        {lbIdx !== null && (
          <MuralModal items={allItems} index={lbIdx}
            onClose={() => setLbIdx(null)} onChange={i => setLbIdx(i)} />
        )}
      </AnimatePresence>

      <main className={`min-h-screen bg-[#0a0a0a] text-white pt-20 sm:pt-28 pb-20
                        ${isAr ? "font-cairo" : "font-cormorant"}`}>

        {/* Back */}
        <div className="px-4 sm:px-8 md:px-16 mb-8 sm:mb-14">
          <button onClick={handleBack}
            className="inline-flex items-center gap-3 text-neutral-500 hover:text-[#b8955a]
                       text-sm tracking-[0.4em] uppercase transition-colors duration-300 font-semibold">
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
            <p className="text-[#b8955a] text-sm sm:text-base tracking-[0.4em] uppercase font-semibold mt-3">{t.andDomes}</p>
            <div className="w-8 h-[1px] bg-[#b8955a] mx-auto mt-6 sm:mt-8" />
          </motion.div>
        </div>

        {/* Grid */}
        <div className="px-4 sm:px-8 md:px-16 lg:px-20">
          <motion.div key={page}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {pageItems.map((m, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
                className="group cursor-pointer"
                onClick={() => setLbIdx((page - 1) * PER_PAGE + i)}>

                <div className="relative overflow-hidden bg-neutral-900" style={{ paddingBottom: "125%" }}>
                  <img src={m.src} alt={m.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5
                                  translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                    <p className="text-white text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold">{m.title}</p>
                    <p className="text-[#f0cc8a] text-[10px] sm:text-xs tracking-[0.22em] mt-1">{m.location}</p>
                  </div>

                  <div className="absolute top-3 right-3 bg-black/75 text-[#b8955a]
                                  text-xs tracking-[0.3em] uppercase px-2.5 py-1 font-semibold">
                    {m.size}
                  </div>

                  <div className="absolute top-3 left-3 w-8 h-8 bg-black/60 flex items-center justify-center
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-white fill-none" strokeWidth="2">
                      <circle cx="11" cy="11" r="7"/><path d="m21 21-3.5-3.5M8 11h6M11 8v6"/>
                    </svg>
                  </div>
                </div>

                <div className="mt-3 pb-4 border-b border-neutral-800">
                  <h4 className="text-xs sm:text-sm tracking-[0.25em] uppercase font-semibold text-neutral-200 leading-relaxed">
                    {m.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-neutral-500 italic mt-1">{m.medium}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] tracking-widest text-neutral-600 uppercase">
                    <span>{m.year}</span>
                    <span>·</span>
                    <span className="text-[#b8955a]/70 font-semibold">{m.size}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 sm:mt-16">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-10 h-10 flex items-center justify-center border border-neutral-700 text-white/60
                           text-lg disabled:opacity-25 hover:bg-[#b8955a] hover:border-[#b8955a] hover:text-white transition-all">‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-10 h-10 flex items-center justify-center border text-sm tracking-widest transition-all font-semibold
                    ${p === page ? "bg-[#b8955a] border-[#b8955a] text-white"
                      : "border-neutral-700 text-white/60 hover:border-[#b8955a] hover:text-[#b8955a]"}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-10 h-10 flex items-center justify-center border border-neutral-700 text-white/60
                           text-lg disabled:opacity-25 hover:bg-[#b8955a] hover:border-[#b8955a] hover:text-white transition-all">›</button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}