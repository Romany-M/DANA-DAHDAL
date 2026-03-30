"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration:        1.2,
      easing:          (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel:     true,
      syncTouch:       false,   // ✦ مهم على الموبايل
      touchMultiplier: 1.5,
      infinite:        false,
    });

    /* ✦ نعرّضه على window عشان نقدر نوقفه/نشغله من أي مكان */
    (window as any).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    /* ✦ استمع لأحداث stop/start من الـ Lightbox */
    const onStop  = () => lenis.stop();
    const onStart = () => lenis.start();
    document.addEventListener("lenis:stop",  onStop);
    document.addEventListener("lenis:start", onStart);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      (window as any).__lenis = null;
      document.removeEventListener("lenis:stop",  onStop);
      document.removeEventListener("lenis:start", onStart);
    };
  }, []);

  return <>{children}</>;
}