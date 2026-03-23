/* app/layout.tsx */
import "./globals.css";
import Navbar from "./components/Navbar";
import LenisProvider from "./components/LenisProvider";
import { SiteProvider } from "./context/SiteContext";
import { Cormorant_Garamond, Cairo } from "next/font/google";

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
  title: "Dana Fawaz Dahdal",
  description: "Byzantine Iconographer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${cairo.variable} font-cormorant`}>
        <SiteProvider>
          <LenisProvider>
            <Navbar />
            {children}
          </LenisProvider>
        </SiteProvider>
      </body>
    </html>
  );
}