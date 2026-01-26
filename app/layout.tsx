import type React from "react";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Providers } from "./providers";
import { iconButtonVariants } from "@/components/ui/icon-button";
// import { Providers } from "@/components/providers"; // <-- Import client wrapper

const Header = dynamic(() => import("@/components/common/header"), {
  loading: () => <div className="h-16 bg-background border-b animate-pulse" />,
  ssr: true,
});

const Footer = dynamic(() => import("@/components/common/footer"), {
  loading: () => <div className="h-32 bg-muted animate-pulse" />,
  ssr: true,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
  preload: true,
});

export const metadata = {
  title: "AmarPlot - Find Your Perfect Property",
  description:
    "Modern real estate platform for buying, selling, and renting land, flats, plots, and mess spaces in Bangladesh.",
  icons: {
    icon: "/favicon.png", 
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://app.amarplot.com/" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Suspense fallback={<div className="h-16 bg-background border-b animate-pulse" />}>
              <Header />
            </Suspense>
            <main className="flex-1 relative">
              <Suspense
                fallback={
                  <div className="min-h-[50vh] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                }
              >
                {children}
              </Suspense>
            </main>
            <Suspense fallback={<div className="h-32 bg-muted animate-pulse" />}>
              <Footer />
            </Suspense>
          </div>
        </Providers>
      </body>
    </html>
  );
}
