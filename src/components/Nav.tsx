"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-navy-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden">
            <Image
              src="/logo.png"
              alt="Life Economics logo"
              width={44}
              height={44}
              className="scale-[1.15] -translate-x-[1px]"
            />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight">
            Life Economics
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6 text-sm">
          <Link href="/resources" className="hover:text-flame-400 transition-colors">
            Resources
          </Link>
          <a
            href="https://lifeeconomics.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-flame-500 hover:bg-flame-600 text-white font-semibold px-4 py-2 rounded transition-colors"
          >
            Read the Newsletter
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 flex flex-col gap-3 text-sm">
          <Link
            href="/resources"
            className="hover:text-flame-400 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Resources
          </Link>
          <a
            href="https://lifeeconomics.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-flame-500 hover:bg-flame-600 text-white font-semibold px-4 py-2 rounded text-center transition-colors"
          >
            Read the Newsletter
          </a>
        </div>
      )}
    </nav>
  );
}
