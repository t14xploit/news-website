'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function NavBar() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  const toggleDarkMode = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark') {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    }
    setMounted(true) // now it's safe to use dynamic stuff
  }, [])

  if (!mounted) return null // prevents mismatch entirely

  return (
<nav className="w-full border-b border-border bg-background text-foreground">
<div className="max-w-screen-lg mx-auto flex items-center justify-between px-6 py-4">

{/* Logo */}
      <Link href="/" className="text-xl font-bold tracking-tight">
        panda<span className="text-primary">🐼NEWS</span>
      </Link>

      <div className="flex gap-10 items-center font-instrument text-xl">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/contact" className="hover:underline">Contact</Link>
      </div>

      {/* Right side: Sign in + dark mode toggle */}
      <div className="flex items-center gap-4">
        <Link
          href="/sign-in"
          className="px-4 py-2 rounded-md border border-border hover:bg-muted text-xl font-instrument"
        >
          Sign In
        </Link>

        <button
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          className="text-xl"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
      </div>

    </nav>
  )
}
