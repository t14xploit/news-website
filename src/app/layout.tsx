import type { Metadata } from "next";
import "./globals.css";

import Footer from "@/components/Footer";

import { SidebarInset } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import SiteHeader from "@/components/sidebar-nav/site-header";
import { ClientSidebarWrapper } from "@/components/sidebar-nav/client-sidebar-wrapper";
import { PlanProvider } from "@/components/subscribe/plan-context";

import { Toaster } from "sonner";


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
                  <div className="flex flex-1 flex-col max-w-full md:max-w-full mx-auto px-4  lg:px-8 w-full">
                    <div className="flex flex-1 flex-col gap-4 py-4 sm:gap-6 sm:py-6">
                      {children}
                    </div>
                  </div>
                </main>
                <Toaster />
              </SidebarInset>
            </ClientSidebarWrapper>
          </PlanProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

