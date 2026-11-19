import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DEFAULT_LANGUAGE, SITES } from "@libsbio/shared";
import { messages } from "@/messages/index.ts";
// Every colour on this site is one of `@biolibs/bionet-theme`'s, which follow the reader's light or
// dark setting. globals.css points the site's own names at them.
import "@biolibs/bionet-theme/theme.css";
import "./globals.css";

// The fonts are fetched when the site is built and served from this site, so a reader's browser
// asks nobody else for them.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const text = messages();

export const metadata: Metadata = {
  metadataBase: new URL(SITES.libs.url),
  title: { default: text.title, template: `%s · ${text.title}` },
  description: text.description,
  openGraph: { title: text.title, description: text.description, type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={DEFAULT_LANGUAGE} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
