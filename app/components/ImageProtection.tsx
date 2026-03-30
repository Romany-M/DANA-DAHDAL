/* app/components/ImageProtection.tsx */
"use client";

import { useEffect } from "react";

export default function ImageProtection() {
  useEffect(() => {
    // منع right-click على الصور
    const handler = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === "IMG") {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", handler);
    return () => document.removeEventListener("contextmenu", handler);
  }, []);

  return null;
}