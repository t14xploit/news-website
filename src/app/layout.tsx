import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import SiteHeader from "@/components/sidebar-nav/site-header-2";
import { ClientSidebarWrapper } from "@/components/sidebar-nav/client-sidebar-wrapper";
import { PlanProvider } from "@/components/subscribe/plan-context";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/lib/error-boundary";
import { UserProvider } from "@/lib/context/user-context";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "OpenNews",
  description:
    "Transparent, real-time news and human-centric insights that keep you connected.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const incomingHeaders = await headers();
  const nativeHeaders = new Headers();
  for (const [key, value] of incomingHeaders.entries()) {
    nativeHeaders.set(key, value ?? "");
  }

  const session = await auth.api.getSession({
    headers: nativeHeaders,
  });

  interface ExtendedUser {
    id: string;
    email: string;
    role?: string | null;
    subscriptionId?: string | null;
    name?: string | null;
    avatar?: string | null;
    subscriptionType?: string | null;
  }

  const maybeUser = session?.user as ExtendedUser | undefined;

  const user = maybeUser
    ? {
        id: maybeUser.id,
        name: maybeUser.name ?? "",
        email: maybeUser.email ?? "",
        avatar: maybeUser.avatar ?? "/alien/alien_1.jpg",
        role: maybeUser.role ?? "user",
        subscriptionId: maybeUser.subscriptionId ?? null,
      }
    : {
        id: "",
        name: "",
        email: "",
        avatar: "/alien/alien_1.jpg",
        role: "user",
        subscriptionId: null,
      };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body suppressHydrationWarning>
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
