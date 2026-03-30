"use client";
import { useState, useEffect } from "react";

export default function GoldCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [big, setBig] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("button,a,[data-hover]")) setBig(true);
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("button,a,[data-hover]")) setBig(false);
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  const size = big ? 38 : 18;

  return (
    <div
      className="fixed z-[9999] pointer-events-none hidden md:block"
      style={{ left: pos.x, top: pos.y, transform: "translate(-50%,-50%)", transition: "none" }}>
      <div style={{
        width: size, height: size,
        border: "1px solid #b8955a",
        borderRadius: "50%",
        transition: "width 0.2s ease, height 0.2s ease",
        opacity: 0.8,
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 4, height: 4, borderRadius: "50%",
        background: "#b8955a",
      }} />
    </div>
  );
}