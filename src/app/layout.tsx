import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TableSnap - Convert Images to Spreadsheets Instantly",
  description:
    "Transform images of tables, invoices, and financial documents into editable spreadsheets with AI-powered extraction. Verify before you export.",
  keywords: ["OCR", "table extraction", "invoice scanner", "AI", "spreadsheet"],
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
      <body className="font-sans antialiased h-full overflow-hidden bg-chassis text-ink">{children}</body>
    </html>
  );
}
