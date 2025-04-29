import type { Metadata } from "next";
import "./globals.css";

import { Instrument_Serif, Inika } from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ClientToaster from "@/components/client-toaster/toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const inika = Inika({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-inika",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PandaNEWS",
  description: "Curated news, editorials, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inika.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />

          <main className="flex-1 bg-background text-foreground">
            <div className="max-w-screen-xl mx-auto px-6">
              {children}
              <ClientToaster />
            </div>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
