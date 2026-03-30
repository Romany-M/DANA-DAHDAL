/* app/layout.tsx */
import "./globals.css";
import Navbar from "./components/Navbar";
import LenisProvider from "./components/LenisProvider";
import ImageProtection from "./components/ImageProtection";
import { SiteProvider } from "./context/SiteContext";
import { Cormorant_Garamond, Cairo } from "next/font/google";
import GoldCursor from "./components/GoldCursor";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata = {
  title: "Dana Fawaz Dahdal — Byzantine Iconographer",
  description: "Byzantine Iconographer — Sacred Art Since 2008",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${cairo.variable} font-cormorant`}>
        <SiteProvider>
          <LenisProvider>
             <GoldCursor />
            <ImageProtection />
            <Navbar />
            {children}
          </LenisProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
