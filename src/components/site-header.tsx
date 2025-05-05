import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./theme/mode-toggle";
import SignOutButton from "./auth/sign-out-button";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
// import { ModeToggle } from "@/components/theme/mode-toggle";

export default async function SiteHeader() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div>
      <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)] py-9 px-4 lg:gap-4 lg:px-6">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="scale-120 -ml-1" />
          <Separator
            orientation="vertical"
            className="mx-8 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-lg font-medium sm:text-xl">panda🐼NEWS</h1>
          <div className="ml-auto">
            <div className="flex items-center gap-4">
              {session ? (
                // User is logged in, show Sign Out button
                <>
                  <span className="text-sm mr-2">
                    Hi, {session.user.name || session.user.email}
                  </span>
                  <SignOutButton />
                </>
              ) : (
                // User is not logged in, show Sign Up and Sign In buttons
                <>
                  <Link
                    href="/sign-in"
                    className={buttonVariants({ variant: "secondary" })}
                  >
                    Sign In
                  </Link>
                </>
              )}

              <ModeToggle />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
