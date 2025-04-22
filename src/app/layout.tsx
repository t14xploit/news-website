import type { Metadata } from "next";
import "./globals.css";

import { Instrument_Serif, Inika } from 'next/font/google'

const instrumentSerif = Instrument_Serif({
  weight: ['400'], 
  subsets: ['latin'],
  variable: '--font-instrument-serif', 
  display: 'swap',
})

const inika = Inika({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-inika',
  display: 'swap',
})


export const metadata: Metadata = {
  title: 'PandaNEWS',
  description: 'Curated news, editorials, and more',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${inika.variable}`}>
    <body className="bg-white text-black">{children}</body>
  </html>
  );
}
