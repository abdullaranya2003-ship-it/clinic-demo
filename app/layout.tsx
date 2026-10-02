import type { Metadata, Viewport } from "next";
import { Noto_Kufi_Arabic, IBM_Plex_Sans_Arabic, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { StoreProvider } from "@/lib/store";

const kufi = Noto_Kufi_Arabic({ subsets: ["arabic"], weight: ["500", "600", "700"], variable: "--font-kufi" });
const plex = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600"], variable: "--font-plex" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: "کلینیکی ڕۆژهەڵات — دیمۆ",
  description: "Clinic Management System — interactive demo",
};

// viewport-fit=cover + explicit scale lets the app draw edge-to-edge under
// a phone's notch/home-indicator, matched by the safe-area padding used in
// globals.css and the mobile nav drawer.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ckb" dir="rtl" className={`${kufi.variable} ${plex.variable} ${plexMono.variable}`}>
      <body className="font-plex antialiased">
        <StoreProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="min-w-0 flex-1 pb-24 md:pb-0">{children}</main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
