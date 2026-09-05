import React from 'react';
import HeroNotionWindow from './HeroNotionWindow';
import { BeanOutline } from './FloatingBean';
import { PieChart, Send, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HeroSection({ onOpenApp }) {
  return (
    <section className="relative pt-16 pb-24 overflow-hidden bg-gradient-to-b from-white via-[#fbfbfa] to-white">
      {/* Decorative Floating Shapes in Background */}
      <div className="absolute top-12 left-8 md:left-24 animate-float-slow opacity-80 pointer-events-none">
        <BeanOutline color="#f59e0b" size={80} rotation={-25} />
      </div>
      <div className="absolute top-36 left-4 md:left-12 animate-float-reverse opacity-70 pointer-events-none">
        <BeanOutline color="#ef4444" size={90} rotation={40} />
      </div>
      <div className="absolute top-64 left-10 md:left-28 animate-float-slow opacity-65 pointer-events-none">
        <BeanOutline color="#3b82f6" size={75} rotation={-15} />
      </div>
      <div className="absolute top-96 left-6 md:left-16 animate-float-reverse opacity-70 pointer-events-none">
        <BeanOutline color="#10b981" size={85} rotation={30} />
      </div>

      <div className="absolute top-16 right-8 md:right-24 animate-float-reverse opacity-80 pointer-events-none">
        <BeanOutline color="#f97316" size={85} rotation={35} />
      </div>
      <div className="absolute top-44 right-4 md:right-12 animate-float-slow opacity-70 pointer-events-none">
        <BeanOutline color="#0284c7" size={75} rotation={-45} />
      </div>
      <div className="absolute top-72 right-12 md:right-28 animate-float-reverse opacity-65 pointer-events-none">
        <BeanOutline color="#10b981" size={90} rotation={15} />
      </div>
      <div className="absolute top-96 right-6 md:right-16 animate-float-slow opacity-70 pointer-events-none">
        <BeanOutline color="#ef4444" size={80} rotation={-25} />
      </div>

      {/* Main Hero Container */}
      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-950 mb-5 leading-tight">
          Your{' '}
          <span className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60 align-middle text-3xl md:text-5xl">
            <PieChart className="w-8 h-8 md:w-11 md:h-11 inline-block" /> finances
          </span>{' '}
          &{' '}
          <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/60 align-middle text-3xl md:text-5xl">
            <Send className="w-8 h-8 md:w-10 md:h-10 inline-block -rotate-12" /> invoices
          </span><br />
          powered by LedgerCore
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Connect your workspace to generate structured invoices you can send and automated double-entry reports to understand and scale your business.
        </p>

        {/* Primary CTA */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <button
            onClick={onOpenApp}
            className="group bg-black hover:bg-gray-800 text-white font-semibold text-sm px-7 py-3.5 rounded-full transition-all shadow-lg hover:shadow-xl flex items-center gap-2.5 active:scale-95 cursor-pointer"
          >
            <span>Launch LedgerCore Engine</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Hero Interactive Window */}
        <HeroNotionWindow onOpenApp={onOpenApp} />
      </div>
    </section>
  );
}
