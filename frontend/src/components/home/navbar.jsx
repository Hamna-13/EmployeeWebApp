import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-sky-600 grid place-items-center text-white font-bold">
            CH
          </div>
          <span className="text-lg sm:text-xl font-semibold text-gray-900">CoreHours</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-md">
          <a href="#home" className="text-gray-900 hover:text-amber-500">Home</a>
          <a href="#about" className="text-gray-900 hover:text-amber-500">About</a>
          <a href="#features" className="text-gray-900 hover:text-amber-500">Features</a>
          <a href="#contact" className="text-gray-900 hover:text-amber-500">Contact</a>
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-6">
          <a href="/login" className="text-gray-700 hover:text-amber-500 text-sm font-medium">Login</a>
          <a
            href="#get-started"
            className="inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-500 transition"
          >
            Get Started
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 ring-1 ring-gray-200"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-2">
            <a onClick={() => setOpen(false)} href="#home" className="block px-2 py-2 rounded-lg hover:bg-gray-50">Home</a>
            <a onClick={() => setOpen(false)} href="#about" className="block px-2 py-2 rounded-lg hover:bg-gray-50">About</a>
            <a onClick={() => setOpen(false)} href="#features" className="block px-2 py-2 rounded-lg hover:bg-gray-50">Features</a>
            <a onClick={() => setOpen(false)} href="#contact" className="block px-2 py-2 rounded-lg hover:bg-gray-50">Contact</a>
            <div className="pt-2 flex gap-2">
              <a href="/login" className="flex-1 rounded-lg ring-1 ring-gray-200 px-4 py-2 text-center font-medium">Login</a>
              <a href="#get-started" className="flex-1 rounded-lg bg-sky-600 px-4 py-2 text-center font-semibold text-white">Get Started</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
