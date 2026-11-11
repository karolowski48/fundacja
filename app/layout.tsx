import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { nunito, oswald } from "@/app/fonts";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/JsonLd";
import { Motion } from "@/components/Motion";
import { RouteScroll } from "@/components/layout/RouteScroll";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { settings } from "@/lib/content";
import { organizationJsonLd } from "@/lib/seo";
import { isPreview, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: settings.seo.defaultTitle, template: `%s | ${settings.name}` },
  description: settings.seo.defaultDescription,
  applicationName: settings.name,
  authors: [{ name: settings.name, url: siteUrl }],
  creator: settings.name,
  publisher: settings.name,
  robots: isPreview ? { index: false, follow: false } : { index: true, follow: true, "max-image-preview": "large" },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#462451",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pl"
      className={`${oswald.variable} ${nunito.variable}`}
      // lets Next switch smooth scrolling off during route changes (otherwise the jump to the top animates and gets interrupted)
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Runs synchronously before first paint (next/script "beforeInteractive" is deferred in the
            App Router), so JS-only controls never pop in and shift the layout. */}
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js")' }} />
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-plum-800 focus:px-5 focus:py-3 focus:font-bold focus:text-cream-50"
        >
          Przejdź do treści
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <ScrollToTop />
        <RouteScroll />
        <Motion />
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
