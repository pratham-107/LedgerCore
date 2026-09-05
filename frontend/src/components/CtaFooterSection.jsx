import React from "react";
import { BeanFilled } from "./FloatingBean";

export default function CtaFooterSection({ onOpenApp }) {
  return (
    <footer className="relative bg-white pt-24 pb-12 overflow-hidden border-t border-gray-100">
      {/* 3D Glossy Beans Cluster in background */}
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
          Get started for free
        </h2>
        <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto mb-8 font-normal">
          Get beautiful invoices and finance reports powered by your Notion in
          less than 2 minutes.
        </p>

        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={onOpenApp}
            className="bg-black hover:bg-gray-800 text-white font-semibold text-sm px-7 py-3.5 rounded-full transition-all shadow-xl hover:shadow-2xl flex items-center gap-2.5 active:scale-95"
          >
            {/* Notion Logo */}
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.57c-.42-.326-.981-.7-2.055-.607L3.107 2.083c-.467.047-.56.327-.374.513l1.726 1.612zm.98 3.547v13.578c0 .7.374.933 1.168.887l13.822-.793c.793-.047.98-.467.98-1.12V6.634c0-.653-.233-.933-.887-.887L6.326 6.541c-.654.047-.887.373-.887 1.214zm13.12 1.353c.094.42 0 .84-.42.887l-.934.187v8.54c-1.027.606-2.054.933-3.08.933-1.635 0-2.195-.793-3.456-2.38l-3.36-4.573v5.694l1.587.373c.047.047.047.42-.046.467l-3.874.233c-.094 0-.14-.373.046-.42l1.074-.28V9.897l-1.448-.14c-.093-.047-.046-.42.093-.42l3.921-.234 3.734 5.04v-4.62l-1.353-.233c-.094-.047-.047-.42.093-.42l3.967-.234z" />
            </svg>
            <span>Log in to get started</span>
          </button>
        </div>
      </div>

      {/* Bottom Footer Links */}
      <div className="max-w-6xl mx-auto px-6 pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <div className="flex items-center gap-6">
          <a href="#community" className="hover:text-black transition-colors">
            Community
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-black transition-colors"
          >
            Twitter
          </a>
          <a href="#privacy" className="hover:text-black transition-colors">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:text-black transition-colors">
            Terms of Use
          </a>
        </div>
        <div className="text-gray-400">a reboot product</div>
      </div>
    </footer>
  );
}
