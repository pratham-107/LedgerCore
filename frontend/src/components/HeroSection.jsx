import React from "react";
import HeroNotionWindow from "./HeroNotionWindow";
import { BeanOutline, BeanFilled } from "./FloatingBean";

export default function HeroSection({ onOpenApp }) {
  return (
    <section className="relative pt-16 pb-24 overflow-hidden bg-gradient-to-b from-white via-[#fbfbfa] to-white">
      {/* Decorative Floating Beans in Background */}
      <div className="absolute top-12 left-8 md:left-24 animate-float-slow opacity-90 pointer-events-none">
        <BeanOutline color="#f59e0b" size={80} rotation={-25} />
      </div>
      <div className="absolute top-36 left-4 md:left-12 animate-float-reverse opacity-80 pointer-events-none">
        <BeanOutline color="#ef4444" size={90} rotation={40} />
      </div>
      <div className="absolute top-64 left-10 md:left-28 animate-float-slow opacity-75 pointer-events-none">
        <BeanOutline color="#3b82f6" size={75} rotation={-15} />
      </div>
      <div className="absolute top-96 left-6 md:left-16 animate-float-reverse opacity-80 pointer-events-none">
        <BeanOutline color="#10b981" size={85} rotation={30} />
      </div>

      <div className="absolute top-16 right-8 md:right-24 animate-float-reverse opacity-90 pointer-events-none">
        <BeanOutline color="#f97316" size={85} rotation={35} />
      </div>
      <div className="absolute top-44 right-4 md:right-12 animate-float-slow opacity-80 pointer-events-none">
        <BeanOutline color="#0284c7" size={75} rotation={-45} />
      </div>
      <div className="absolute top-72 right-12 md:right-28 animate-float-reverse opacity-75 pointer-events-none">
        <BeanOutline color="#10b981" size={90} rotation={15} />
      </div>
      <div className="absolute top-96 right-6 md:right-16 animate-float-slow opacity-80 pointer-events-none">
        <BeanOutline color="#ef4444" size={80} rotation={-25} />
      </div>

      {/* Main Hero Container */}
      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-950 mb-5 leading-tight">
          Your{" "}
          <span className="inline-flex items-center text-amber-500">🥐</span>{" "}
          finances &{" "}
          <span className="inline-flex items-center text-emerald-500">✈️</span>{" "}
          invoices
          <br />
          powered by Notion
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Connect your Notion to generate beautiful invoices you can finally
          send and automated reports to understand your business.
        </p>

        {/* Primary CTA */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <button
            onClick={onOpenApp}
            className="group bg-black hover:bg-gray-800 text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-all shadow-lg hover:shadow-xl flex items-center gap-2.5 active:scale-95"
          >
            {/* Notion Logo Icon */}
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.57c-.42-.326-.981-.7-2.055-.607L3.107 2.083c-.467.047-.56.327-.374.513l1.726 1.612zm.98 3.547v13.578c0 .7.374.933 1.168.887l13.822-.793c.793-.047.98-.467.98-1.12V6.634c0-.653-.233-.933-.887-.887L6.326 6.541c-.654.047-.887.373-.887 1.214zm13.12 1.353c.094.42 0 .84-.42.887l-.934.187v8.54c-1.027.606-2.054.933-3.08.933-1.635 0-2.195-.793-3.456-2.38l-3.36-4.573v5.694l1.587.373c.047.047.047.42-.046.467l-3.874.233c-.094 0-.14-.373.046-.42l1.074-.28V9.897l-1.448-.14c-.093-.047-.046-.42.093-.42l3.921-.234 3.734 5.04v-4.62l-1.353-.233c-.094-.047-.047-.42.093-.42l3.967-.234z" />
            </svg>
            <span>Log in to get started</span>
          </button>
        </div>

        {/* Hero Interactive Notion Window */}
        <HeroNotionWindow onOpenApp={onOpenApp} />
      </div>
    </section>
  );
}
