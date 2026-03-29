import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2Vibe News — AI-Powered News Intelligence",
  description: "Real-time news aggregation from 30+ sources with AI summarization, source reliability scoring, and multi-perspective analysis. Turkish + English.",
  keywords: ["news", "AI", "intelligence", "haber", "yapay zeka", "turkiye", "world"],
  openGraph: {
    title: "2Vibe News",
    description: "AI-Powered News Intelligence Platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#09090b" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
