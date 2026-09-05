import React from 'react';
import { BeanFilled } from './FloatingBean';
import { Layers, ArrowRight } from 'lucide-react';

export default function CtaFooterSection({ onOpenApp }) {
  return (
    <footer className="relative bg-white pt-24 pb-12 overflow-hidden border-t border-gray-100">
      {/* 3D Glossy Shapes Cluster in background */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-full max-w-4xl h-44 pointer-events-none flex justify-center items-center gap-8 opacity-90 overflow-hidden">
        <div className="animate-float-slow -translate-y-4">
          <BeanFilled color="#ec4899" size={110} rotation={-25} />
        </div>
        <div className="animate-float-reverse translate-y-6">
          <BeanFilled color="#a855f7" size={130} rotation={45} />
        </div>
        <div className="animate-float-slow -translate-y-8">
          <BeanFilled color="#f59e0b" size={120} rotation={-15} />
        </div>
        <div className="animate-float-reverse translate-y-4">
          <BeanFilled color="#ef4444" size={135} rotation={35} />
        </div>
        <div className="animate-float-slow -translate-y-2">
          <BeanFilled color="#fb923c" size={115} rotation={-40} />
        </div>
      </div>

      {/* Main CTA Container */}
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 pt-12 pb-16">
        <h2 className="text-3xl md:text-5xl font-black text-gray-950 tracking-tight mb-4">
          Get started with LedgerCore
        </h2>
        <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto mb-8 font-normal">
          Experience production-grade financial bookkeeping, double-entry validation, and real-time reports.
        </p>

        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={onOpenApp}
            className="bg-black hover:bg-gray-800 text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all shadow-xl hover:shadow-2xl flex items-center gap-2.5 active:scale-95 cursor-pointer"
          >
            <span>Open LedgerCore Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Footer Links */}
      <div className="max-w-6xl mx-auto px-6 pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-black text-white flex items-center justify-center">
            <Layers className="w-3 h-3" />
          </div>
          <span className="font-bold text-gray-900">LedgerCore</span>
          <span className="text-gray-400 ml-2">© {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">Swagger API</a>
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <a href="#security" className="hover:text-black transition-colors">Security</a>
          <a href="#docs" className="hover:text-black transition-colors">Documentation</a>
        </div>
      </div>
    </footer>
  );
}
