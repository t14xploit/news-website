import type { Metadata } from "next";
import "./globals.css";

import { Instrument_Serif, Inika } from 'next/font/google'
// import NavBar from "@/components/NavBar";
import { AppSidebar } from "@/components/app-sidebar";
import Footer from "@/components/Footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
// import { ThemeProvider } from "@/components/theme/theme-provider";


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

    <html lang="en" className={`${instrumentSerif.variable} ${inika.variable}`}>
    <body className="flex flex-col bg-background text-foreground">
      
    {/* <NavBar /> */}
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        user={{
          id: "1",
          name: "Ninja",
          email: "ninja@ufo.io",
          role: "ADMIN",
          image: null,
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          subscriptionId: null,
        }}
        variant="inset"
      />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col min-h-[calc(100vh-var(--header-height))] w-full">
          <div className="flex flex-1 flex-col max-w-6xl mx-auto px-4 md:px-6 w-full">
            <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
    <main className="flex-1 bg-background text-foreground">
  <div className="max-w-screen-lg mx-auto px-6">{children}</div>
</main>
    <Footer/>
      </body>
    </html>
  );
}
