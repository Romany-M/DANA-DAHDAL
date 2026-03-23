"use client";

/*
  الـ component ده بقى thin wrapper على useSite()
  يعني تلقائياً متزامن مع زرار الـ Navbar
  لأن كلهم بيقروا من نفس الـ SiteContext
*/
import { useSite } from "../context/SiteContext";

export default function DarkModeToggle() {
  const { dark, toggleDark } = useSite();

  return (
    <button
      onClick={toggleDark}
      className="px-4 py-2 bg-gray-200 dark:bg-gray-700
                 text-black dark:text-white rounded transition-all duration-300"
    >
      {dark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}