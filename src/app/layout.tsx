import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import ConditionalFooter from "@/components/ConditionalFooter/ConditionalFooter";
import "./globals.scss";

const vogue = localFont({
  src: "./fonts/Vogue.ttf",
  variable: "--font-vogue",
  display: "swap",
  weight: "400",
});

const romanSd = localFont({
  src: "./fonts/Roman SD.ttf",
  variable: "--font-roman-sd",
  display: "swap",
  weight: "400",
});

const solveraLorvane = localFont({
  src: "./fonts/Solvera Lorvane.ttf",
  variable: "--font-solvera-lorvane",
  display: "swap",
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LACE",
    template: "%s — LACE",
  },
  description: "LACE — a boutique models agency representing curated talent worldwide.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "LACE",
    title: "LACE",
    description: "A boutique models agency representing curated talent worldwide.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${vogue.variable} ${romanSd.variable} ${solveraLorvane.variable} ${geistMono.variable}`}
    >
      <body className={vogue.className}>
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
