import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-parchment text-ink font-serif">
        <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-gold/20 via-transparent to-burgundy/10" />
        <header className="sticky top-0 z-10 backdrop-blur bg-parchment/80 border-b border-gold/30">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <div className="text-2xl tracking-wide">
              <span className="text-burgundy">Classic</span>
              <span className="text-ink">Salon</span>
            </div>
            <nav className="flex gap-6 text-sm">
              <a className="hover:text-burgundy" href="/">Library</a>
              <a className="hover:text-burgundy" href="/submit">Submit</a>
              <a className="hover:text-burgundy" href="/charts">Charts</a>
              <a className="hover:text-burgundy" href="/me">Me</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        <footer className="border-t border-gold/30">
          <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-ink/70">World Classics · FHE Privacy · Sepolia</div>
        </footer>
      </body>
    </html>
  );
}


