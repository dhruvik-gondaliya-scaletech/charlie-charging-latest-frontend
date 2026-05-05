import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

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
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className="font-sans antialiased"
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
