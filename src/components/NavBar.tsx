import Link from "next/link";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { buttonVariants } from "./ui/button";
import SignOutButton from "./auth/sign-out-button";
import { Separator } from "@/components/ui/separator";

export default async function NavBar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="w-full border-b border-border bg-background text-foreground">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          panda<span className="text-primary">🐼NEWS</span>
        </Link>

        {/* Navigation links */}
        <div className="flex gap-10 items-center font-instrument text-xl">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </div>

        {/* Right side: Sign in */}
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
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
