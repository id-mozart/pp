import type { Metadata, Viewport } from "next";
import {
  Spectral,
  Inter,
  Playfair_Display,
  Source_Sans_3,
  Manrope,
  JetBrains_Mono,
  Cormorant,
  Prata,
  Oswald,
  Unbounded,
  Caveat,
} from "next/font/google";
import "./globals.css";

import { ConceptProvider } from "@/components/providers/ConceptProvider";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { ConceptSwitcher } from "@/components/chrome/ConceptSwitcher";
import { FloatingContacts } from "@/components/chrome/FloatingContacts";
import { CookieConsent } from "@/components/chrome/CookieConsent";
import {
  DEFAULT_CONCEPT,
  DEFAULT_MODE,
  STORAGE_KEY,
  MODE_STORAGE_KEY,
  CONCEPT_IDS,
} from "@/lib/concepts";

const spectral = Spectral({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});
const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-source",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
});
const cormorant = Cormorant({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const prata = Prata({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-prata",
  display: "swap",
});
const oswald = Oswald({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});
const unbounded = Unbounded({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-unbounded",
  display: "swap",
});
const caveat = Caveat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://pan-partners-production.up.railway.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pan&Partners — B2B продажі та переговори | Тетяна Пан",
    template: "%s | Pan&Partners",
  },
  description:
    "Навчаємо команди продавати та вести переговори з B2B-клієнтами — чітко, впевнено, з вимірюваним результатом. Корпоративні тренінги, онлайн-курси та персональні консультації від Тетяни Пан.",
  keywords: [
    "B2B продажі",
    "переговори",
    "тренінг з продажів",
    "Тетяна Пан",
    "Pan&Partners",
    "консультація з продажів",
  ],
  authors: [{ name: "Тетяна Пан" }],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: SITE_URL,
    siteName: "Pan&Partners",
    title: "Pan&Partners — B2B продажі та переговори",
    description:
      "Навчаємо команди продавати та вести переговори з B2B-клієнтами — чітко, впевнено, з вимірюваним результатом.",
    images: [{ url: "/brand/logo.webp", width: 1200, height: 630, alt: "Pan&Partners" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pan&Partners — B2B продажі та переговори",
    description:
      "Навчаємо команди продавати та вести переговори з B2B-клієнтами — чітко, впевнено, з вимірюваним результатом.",
    images: ["/brand/logo.webp"],
  },
  icons: { icon: "/brand/favicon.png", apple: "/brand/favicon.png" },
  alternates: {
    canonical: "/",
    languages: { uk: "/", en: "/?lang=en", ru: "/?lang=ru", es: "/?lang=es", ca: "/?lang=ca" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0B09",
  width: "device-width",
  initialScale: 1,
};

/** Inline, render-blocking: apply persisted concept before first paint (no FOUC). */
const noFlash = `(function(){try{var d=document.documentElement;var k="${STORAGE_KEY}",v=localStorage.getItem(k),ok=${JSON.stringify(
  CONCEPT_IDS,
)};if(v&&ok.indexOf(v)>-1){d.setAttribute("data-concept",v);}var mv=localStorage.getItem("${MODE_STORAGE_KEY}");if(mv==="light"||mv==="dark"){d.setAttribute("data-mode",mv);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="uk"
      data-concept={DEFAULT_CONCEPT}
      data-mode={DEFAULT_MODE}
      className={`${spectral.variable} ${inter.variable} ${playfair.variable} ${sourceSans.variable} ${manrope.variable} ${jetbrains.variable} ${cormorant.variable} ${prata.variable} ${oswald.variable} ${unbounded.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
        <ConceptProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-oncontrast"
          >
            До основного вмісту
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <ConceptSwitcher />
          <FloatingContacts />
          <CookieConsent />
        </ConceptProvider>
      </body>
    </html>
  );
}
