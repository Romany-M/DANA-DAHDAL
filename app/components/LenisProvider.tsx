"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.5,
    });

    (window as any).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    /* 🔥 التحكم الصح */
    const stop = () => lenis.stop();
    const start = () => lenis.start();

    document.addEventListener("lenis:stop", stop);
    document.addEventListener("lenis:start", start);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      document.removeEventListener("lenis:stop", stop);
      document.removeEventListener("lenis:start", start);
    };
  }, []);

  return <>{children}</>;
}