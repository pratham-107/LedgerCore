import React from 'react';
import { Layers, ArrowUpRight } from 'lucide-react';

export default function Navbar({ onOpenApp }) {
  return (
    <header className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      {/* Top enterprise badge banner */}
      <div className="w-full bg-gray-950 text-white text-[13px] py-2 text-center font-medium tracking-tight flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>LedgerCore v1.0 — Enterprise Double-Entry Bookkeeping & Financial Engine</span>
      </div>

      {/* Main navigation */}
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-950">LedgerCore</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-8 text-[14px] text-gray-600 font-medium">
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <a href="#invoices" className="hover:text-black transition-colors">Invoices</a>
          <a href="#finances" className="hover:text-black transition-colors">Finances</a>
          <a href="#security" className="hover:text-black transition-colors">Security</a>
          <a 
            href="http://localhost:8080/swagger-ui.html" 
            target="_blank" 
            rel="noreferrer"
            className="hover:text-black transition-colors flex items-center gap-0.5"
          >
            API Docs <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
          </a>
          <button
            onClick={onOpenApp}
            className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Open Dashboard</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </button>
        </div>
      </nav>
    </header>
  );
}
