'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Shorty Shop
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/uomo"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              Uomo
            </Link>
            <Link
              href="/woman"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              Woman
            </Link>
            <Link
              href="/intimissimi"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              Intimissimi
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {open && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link
                href="/uomo"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-black transition-all"
              >
                Uomo
              </Link>
              <Link
                href="/woman"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-black transition-all"
              >
                Woman
              </Link>
              <Link
                href="/intimissimi"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-black transition-all"
              >
                Intimissimi
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
