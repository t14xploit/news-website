"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { buttonVariants } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./theme/mode-toggle";
import { Separator } from "@/components/ui/separator";

export default function NavBar() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
    setMounted(true); // now it's safe to use dynamic stuff
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  if (!mounted) return null; // prevents mismatch entirely

  return (
    <nav className="w-full border-b border-border bg-background text-foreground">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          panda<span className="text-primary">🐼NEWS</span>
        </Link>

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

        {/* Right side, rendering based on authentication status */}
        <div className="flex items-center gap-4">
          {isPending ? (
            <div>Loading...</div>
          ) : session ? (
            // User is logged in -  sign out button
            <>
              <span className="text-sm mr-2">
                Hi, {session.user.name || session.user.email}
              </span>
              <button
                onClick={handleSignOut}
                className={buttonVariants({ variant: "outline" })}
              >
                Sign Out
              </button>
            </>
          ) : (
            // User is not logged in - sign up and sign in buttons
            <>
              <Link
                href="/sign-up"
                className={buttonVariants({ variant: "default" })}
              >
                Sign Up
              </Link>
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: "outline" })}
              >
                Sign In
              </Link>
            </>
          )}
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="text-xl"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
