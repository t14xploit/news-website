import Link from "next/link";
import { ModeToggle } from "@/components/theme/mode-toggle";

export default function NavBar() {
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
          <Link
            href="/sign-in"
            className="px-4 py-2 rounded-md border border-border hover:bg-muted text-xl font-instrument"
          >
            Sign In
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
