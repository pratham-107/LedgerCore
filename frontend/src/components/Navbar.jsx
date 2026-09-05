import React from "react";

export default function Navbar({ onOpenApp }) {
  return (
    <header className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      {/* Top sunset banner */}
      <div className="w-full bg-black text-white text-[13px] py-2 text-center font-medium tracking-tight">
        Magic Beans sunsets Dec 31, 2025. Thanks for your support!
      </div>

      {/* Main navigation */}
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="w-4 h-4 rounded-full border-2 border-black flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
          </div>
          <span className="font-semibold text-lg tracking-tight text-gray-900">
            magic beans
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-8 text-[15px] text-gray-600 font-medium">
          <a href="#pricing" className="hover:text-black transition-colors">
            Pricing
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-black transition-colors"
          >
            Twitter
          </a>
          <button
            onClick={onOpenApp}
            className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Live Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>
        </div>
      </nav>
    </header>
  );
}
