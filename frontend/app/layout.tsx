import type { Metadata } from "next";
import { Nunito, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "leaflet/dist/leaflet.css";
import "./globals.css";

// Nunito for main text
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  display: "swap",
  variable: "--font-nunito",
});

// Geist Mono for code/monospace
const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "E-Commerce App",
    template: "%s | E-Commerce App",
  },
  description:
    "A modern e-commerce application for buying and selling products.",
  keywords: ["ecommerce", "shop", "online store", "products", "shopping cart"],
  authors: [{ name: "E-Commerce App" }],
  icons: {
    icon: "/images/icon.png",
  },
  openGraph: {
    title: "E-Commerce App",
    description:
      "A modern e-commerce application for buying and selling products.",
    type: "website",
    images: ["/images/og-home.png"],
  },
};

export const viewport = "width=device-width, initial-scale=1";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Optional: preconnect for additional Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${nunito.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
