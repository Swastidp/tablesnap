import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TableSnap | Unlock Static Data in Seconds",
  description:
    "Turn images of invoices and tables into Excel-ready data instantly. Powered by Gemini AI. Verify before you export.",
  keywords: ["OCR", "table extraction", "invoice scanner", "AI", "spreadsheet", "Gemini", "CSV export"],
  openGraph: {
    title: "TableSnap | Unlock Static Data in Seconds",
    description: "Turn images of invoices and tables into Excel-ready data instantly. Powered by Gemini AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TableSnap | Unlock Static Data in Seconds",
    description: "Turn images of invoices and tables into Excel-ready data instantly. Powered by Gemini AI.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased h-full overflow-hidden bg-chassis text-ink overscroll-none">{children}</body>
    </html>
  );
}
