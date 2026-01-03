import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "GoBengali - Bangla Grammar Checker, Writing Assistant & Translator",
  description: "Free Bangla writing assistant, grammar checker, and translator. Professional tool for Bengali spelling correction and translation.",
  keywords: ["Bangla grammar checker", "Bangla writing assistant", "Bangla translator", "Bengali", "translation", "grammar", "writing", "AI"],
  icons: {
    icon: [
      {
        url: '/favicon.png?v=2',
        sizes: '32x32',
        type: 'image/png',
      }
    ],
    shortcut: '/favicon.png?v=2',
    apple: '/favicon.png?v=2',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}

