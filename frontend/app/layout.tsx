import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/Analytics";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "GoBengali - Bangla Grammar Checker, Writing Assistant & Translator",
  description: "Free Bangla writing assistant with AI-powered grammar checker, spelling corrector, transliterator, and English-Bengali translator. Write perfect Bengali every time.",
  keywords: ["Bangla grammar checker", "Bengali grammar checker", "Bangla writing assistant", "Bengali translator", "Bengali spelling checker", "Bangla transliteration", "Bengali AI tool"],
  icons: {
    icon: [{ url: '/favicon.png?v=2', sizes: '32x32', type: 'image/png' }],
    shortcut: '/favicon.png?v=2',
    apple: '/favicon.png?v=2',
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "GoBengali - Bangla Grammar Checker & Writing Assistant",
    description: "AI-powered Bangla grammar checker, spelling corrector, transliterator, and translator. Free to use.",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "GoBengali" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GoBengali - Bangla Grammar Checker & Writing Assistant",
    description: "AI-powered Bangla grammar checker, spelling corrector, transliterator, and translator.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en": `${BASE_URL}/en`,
      "bn": `${BASE_URL}/bn`,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
