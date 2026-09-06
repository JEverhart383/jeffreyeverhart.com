import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "web-motion",
  description: "Interactive web animation and interaction playground",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="font-sans antialiased min-h-screen" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        <header className="border-b px-6 py-4" style={{ borderColor: "var(--border)" }}>
          <nav className="max-w-6xl mx-auto flex items-center gap-2">
            <Link href="/" className="text-sm font-semibold tracking-widest uppercase" style={{ color: "var(--accent)" }}>
              web-motion
            </Link>
            <span style={{ color: "var(--border)" }}>/</span>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>animation playground</span>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
