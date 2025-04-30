'use client'

import Link from 'next/link'
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className=" max-w-screen w-full pt-4 px-6 mx-auto border-t border-border bg-background text-foreground   text-sm">
<div className=" mx-auto flex flex-col gap-10 md:flex-row md:justify-between">
        
        {/* Logo + Socials */}
        <div>
          <h2 className="text-xl font-bold mb-4">
            panda<span className="text-primary">🐼NEWS</span>
          </h2>
          <p className="mb-4 max-w-xs font-instrument">
            Curated stories, expert opinions, and updates from around the world.
          </p>
          <div className="flex gap-4 mt-12">
            <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
              <FaInstagram className="h-5 w-5 hover:text-primary transition" />
            </Link>
            <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
              <FaFacebookF className="h-5 w-5 hover:text-primary transition" />
            </Link>
            <Link href="https://twitter.com" target="_blank" aria-label="Twitter">
              <FaTwitter className="h-5 w-5 hover:text-primary transition" />
            </Link>
            <Link href="https://youtube.com" target="_blank" aria-label="YouTube">
              <FaYoutube className="h-5 w-5 hover:text-primary transition" />
            </Link>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-8 sm:gap-16">
          <div className="space-y-2 font-instrument">
            <h4 className="font-semibold mb-2">Info</h4>
            <Link href="/about" className="block hover:underline">About Us</Link>
            <Link href="/contact" className="block hover:underline">Contact</Link>
            <Link href="/privacy-policy" className="block hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="block hover:underline">Terms of Use</Link>
            <Link href="/subscription" className="block hover:underline">Subscriptions</Link>
          </div>

          <div className="space-y-2 font-instrument">
            <h4 className="font-semibold mb-2">Explore</h4>
            <Link href="/editors-choice" className="block hover:underline">Editor’s Choice</Link>
            <Link href="/top-news" className="block hover:underline">Top News</Link>
            <Link href="/weather" className="block hover:underline">Weather</Link>
            <Link href="/experts" className="block hover:underline">Expert Views</Link>
            <Link href="/economy" className="block hover:underline">Business & Economy</Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-center text-muted-foreground font-instrument">
        © {new Date().getFullYear()} panda🐼NEWS. All rights reserved.
      </div>
    </footer>
  )
}
