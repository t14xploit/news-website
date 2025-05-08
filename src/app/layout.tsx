import type { Metadata } from "next";
import "./globals.css";

// import { Instrument_Serif, Inika } from "next/font/google";
// import NavBar from "@/components/NavBar";
// import { AppSidebar } from "@/components/app-sidebar";
import Footer from "@/components/Footer";
import { SidebarInset } from "@/components/ui/sidebar";
// import SiteHeader from "@/components/site-header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import SiteHeader from "@/components/sidebar-nav/site-header";
import { ClientSidebarWrapper } from "@/components/sidebar-nav/client-sidebar-wrapper";
import { PlanProvider } from "@/components/subscribe/plan-context";

// const instrumentSerif = Instrument_Serif({
//   weight: ["400"],
//   subsets: ["latin"],
//   variable: "--font-instrument-serif",
//   display: "swap",
// });

// const inika = Inika({
//   weight: ["400", "700"],
//   subsets: ["latin"],
//   variable: "--font-inika",
//   display: "swap",
// });

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
    <html lang="en" suppressHydrationWarning>
    <body>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <PlanProvider>
          <ClientSidebarWrapper>
            <SidebarInset className="flex flex-col min-h-screen">
              <SiteHeader />
              <main className="flex flex-1 flex-col min-h-[calc(100vh-var(--header-height))] w-full">
                <div className="flex flex-1 flex-col max-w-6xl mx-auto px-4 md:px-6 w-full">
                  <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
                    {children}
                  </div>
                </div>
                <Footer />
              </main>
            </SidebarInset>
          </ClientSidebarWrapper>
        <ClientSidebarWrapper>
          <SidebarInset>
            <SiteHeader />
            <main className="flex flex-1 flex-col min-h-[calc(100vh-var(--header-height))] w-full">
              <div className="flex flex-1 flex-col max-w-6xl mx-auto px-4 md:px-6 w-full">
                <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {children}
                </div>
              </div>
              <Footer />
            </main>
          </SidebarInset>
        </ClientSidebarWrapper>
        </PlanProvider>
      </ThemeProvider>
    </body>
  </html>
)
}
