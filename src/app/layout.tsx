import type { Metadata } from "next";
import "./globals.css";

// import Footer from "@/components/Footer";

import { SidebarInset } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import SiteHeader from "@/components/sidebar-nav/site-header";
import { ClientSidebarWrapper } from "@/components/sidebar-nav/client-sidebar-wrapper";
import { PlanProvider } from "@/components/subscribe/plan-context";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "OpenNews",
  description:
    "Transparent, real-time news and human-centric insights that keep you connected.",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

 const user = {
    name: "",
    email: "",
    avatar: "/alien/alien_1.jpg",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PlanProvider initialUserData={user}>
            <ClientSidebarWrapper user={user}>
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
