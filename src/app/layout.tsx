import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Scale EV - Charging Station Management System",
    template: "%s | Scale EV",
  },
  description: "Modern, scalable charging station management platform for global electric vehicle infrastructure.",
  keywords: ["EV Charging", "CSMS", "Charging Station Management", "Electric Vehicles", "OCPP"],
  authors: [{ name: "Scale EV Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://scale-ev.com",
    title: "Scale EV - Professional CSMS Platform",
    description: "Manage your charging network with precision and scale.",
    siteName: "Scale EV",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scale EV - Professional CSMS Platform",
    description: "Manage your charging network with precision and scale.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
