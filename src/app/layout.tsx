import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BioData Maker",
  description: "Create a beautiful, premium, and professional biodata in minutes.",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="%230f172a"/><rect width="14" height="6" x="5" y="5" rx="1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect width="7" height="6" x="5" y="14" rx="1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect width="4" height="6" x="15" y="14" rx="1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
