import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shorty Shop — Voucher Promozionali Esclusivi",
  description:
    "Ottieni il tuo voucher promozionale esclusivo presso i negozi Shorty Shop. Scopri le offerte per Shorty Uomo, Shorty Woman e Shorty Intimissimi.",
  keywords: ["shorty shop", "voucher", "promozione", "moda", "fashion"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.className} antialiased bg-[#fafafa] text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
