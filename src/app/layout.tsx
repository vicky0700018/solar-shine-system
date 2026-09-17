import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sartaj Solar Water System | Solar Water Heaters in Pune",
  description:
    "Solar water heater installation, maintenance and repair for homes, societies and businesses in Pune. Efficient, reliable and eco-friendly hot water systems.",
  authors: [{ name: "Sartaj Solar Water System" }],
  openGraph: {
    title: "Sartaj Solar Water System | Solar Water Heaters in Pune",
    description:
      "Residential and commercial solar water heating solutions in Pune — installation, maintenance, repair and consultation.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sartaj Solar Water System | Solar Water Heaters in Pune",
    description: "Solar water heating solutions in Pune.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="bg-background text-foreground antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
