import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "SentinelAI",
  description: "Cloud Identity Security Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans text-text-primary min-h-screen antialiased`}>
        {/* Liquid Glass SVG distortion filter */}
        <svg style={{position:'absolute',width:0,height:0,overflow:'hidden'}} aria-hidden="true">
          <defs>
            <filter id="liquid-glass-filter" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves={3} stitchTiles="stitch" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={3} xChannelSelector="R" yChannelSelector="G"/>
            </filter>
          </defs>
        </svg>

        <div id="bg-orbs">
          <div className="orb-1"></div>
          <div className="orb-2"></div>
          <div className="orb-3"></div>
        </div>

        <Providers>
          <div className="flex w-full min-h-screen relative z-10 p-6 gap-6">
            <Sidebar />
            <div className="flex flex-col flex-1 w-full gap-6">
              <TopNav />
              <main className="flex-1 w-full max-w-[1600px] mx-auto">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
