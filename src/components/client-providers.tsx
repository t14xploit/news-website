"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode } from "react";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { UserProvider } from "@/lib/context/user-context";
import { PlanProvider } from "@/components/subscribe/plan-context";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/lib/error-boundary";
import { ClientSidebarWrapper } from "@/components/sidebar-nav/client-sidebar-wrapper";
import SiteHeader from "@/components/sidebar-nav/site-header-2";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  subscriptionId: string | null;
};

export function ClientProviders({
  children,
  user,
}: {
  children: ReactNode;
  user: User;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
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
                  <div className="flex flex-1 flex-col max-w-full md:max-w-full mx-auto px-4 lg:px-8 w-full">
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
    </QueryClientProvider>
  );
}
