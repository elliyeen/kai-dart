import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// Static icon referenced through the base path: Next's generated icon route ignores basePath on static export.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  icons: { icon: [{ url: `${basePath}/kai-icon.png`, type: "image/png", sizes: "32x32" }] },
  title: "KAI — The Operating System for Cities and Enterprise",
  description: "AI-powered facilities management and station readiness. An Elliyeen demonstration and proposed pilot for transit operators.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Resize viewport around the virtual keyboard rather than scrolling
  interactiveWidget: "resizes-visual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
