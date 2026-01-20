import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "X-Kira - WhatsApp Bot",
  description: "X-Kira WhatsApp Bot made with @whiskeysockets/baileys library. Fast, reliable, and feature-rich.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
