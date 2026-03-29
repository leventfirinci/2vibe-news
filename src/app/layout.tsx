import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2Vibe News — Haberi Değil, Anlamını Oku",
  description:
    "AI destekli haber istihbarat platformu. Gerçek zamanlı haberler, çoklu kaynak karşılaştırma, güvenilirlik puanı ve 'Neden Önemli?' açıklamaları.",
  keywords: ["haber", "news", "AI", "yapay zeka", "türkiye", "dünya", "gündem"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
