import type { Metadata } from "next";
import "./globals.css";

// import Footer from "@/components/Footer";

import { ThemeProvider } from "@/components/theme/theme-provider";
import SiteHeader from "@/components/sidebar-nav/site-header";
import { ClientSidebarWrapper } from "@/components/sidebar-nav/client-sidebar-wrapper";
import { PlanProvider } from "@/components/subscribe/plan-context";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/lib/error-boundary";
// import { SidebarInset } from "@/components/ui/sidebar";
import { UserProvider } from "@/lib/context/user-context";

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <PlanProvider initialUserData={user}>
              <ErrorBoundary>
                <ClientSidebarWrapper user={user}>
                  <SiteHeader />
                  <main className="flex flex-1 flex-col min-h-[calc(100vh-var(--header-height))] w-full">
                    <div className="flex flex-1 flex-col max-w-full md:max-w-full mx-auto px-4  lg:px-8 w-full">
                      <div className="flex flex-1 flex-col gap-4 py-4 sm:gap-6 sm:py-6">
                        {children}
                      </div>
                    </div>
                  </main>
                  <Toaster />
                </ClientSidebarWrapper>
              </ErrorBoundary>
            </PlanProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
