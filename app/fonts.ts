import localFont from "next/font/local";

// Self-hosted variable fonts subset to Latin + Polish characters (scripts/subset-fonts.mjs).
// One file per family instead of Google's latin + latin-ext pairs: 53 KB instead of ~126 KB.
// Licence: SIL Open Font License 1.1 (app/fonts/OFL-*.txt).
export const oswald = localFont({
  src: "./fonts/oswald-pl.woff2",
  weight: "500 700",
  variable: "--font-oswald",
  display: "swap",
  fallback: ["Arial Narrow", "sans-serif"],
});

export const nunito = localFont({
  src: "./fonts/nunito-pl.woff2",
  weight: "400 800",
  variable: "--font-nunito",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
