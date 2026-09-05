import React from "react";
import { X, ExternalLink, ChevronDown } from "lucide-react";
import { BeanOutline } from "./FloatingBean";

export default function ToolkitSection() {
  return (
    <section className="py-24 bg-[#faf9f7] border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mb-16 max-w-xl">
          The toolkit for those who run
          <br />
          their business on Notion
        </h2>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Database Settings Modal */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 flex flex-col justify-between shadow-sm">
            {/* Modal Mockup */}
            <div className="rounded-xl border border-gray-200/70 p-4 bg-[#faf9f7] text-xs mb-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 font-semibold text-gray-800">
                <span className="text-[11px] font-bold">Database settings</span>
                <X className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
              </div>

              <div className="py-2.5 flex items-center justify-between border-b border-gray-100">
                <span className="flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <span>📑</span> Invoices
                </span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </div>

              <div className="space-y-2 pt-2 text-[11px] text-gray-600">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <span className="text-gray-400">Aa</span> Invoice name
                  </span>
                  <span className="text-gray-400 flex items-center gap-0.5">
                    Name <ChevronDown className="w-3 h-3" />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <span className="text-gray-400">#</span> Invoice n°
                  </span>
                  <span className="text-gray-400 flex items-center gap-0.5">
                    None <ChevronDown className="w-3 h-3" />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <span className="text-gray-400">Aa</span> Total
                  </span>
                  <span className="text-gray-400 flex items-center gap-0.5">
                    None <ChevronDown className="w-3 h-3" />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <span className="text-gray-400">📅</span> Issue date
                  </span>
                  <span className="text-gray-400 flex items-center gap-0.5">
                    None <ChevronDown className="w-3 h-3" />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <span className="text-gray-400">📅</span> Due date
                  </span>
                  <span className="text-gray-400 flex items-center gap-0.5">
                    None <ChevronDown className="w-3 h-3" />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <span className="text-gray-400">🏷️</span> Status
                  </span>
                  <span className="text-gray-400 flex items-center gap-0.5">
                    None <ChevronDown className="w-3 h-3" />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <span className="text-gray-400">↗️</span> Client
                  </span>
                  <span className="text-gray-700 font-medium flex items-center gap-0.5">
                    Projects ›
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">
                Fully customizable
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Connect your database and customize how it will look.
              </p>
            </div>
          </div>

          {/* Card 2: Real-time Sync + Dark Mode */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Top item: Real-time sync */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between h-1/2">
              <div className="flex justify-center py-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs px-4 py-1.5 rounded-full flex items-center gap-1 shadow-sm transition-all">
                  <span>New</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">
                  Real-time sync
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Update anything in Notion and see the result. Works like
                  magic.
                </p>
              </div>
            </div>

            {/* Bottom item: Dark mode */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between h-1/2">
              {/* Dark mode chart mockup */}
              <div className="bg-[#191919] rounded-xl p-3 border border-[#333] mb-4 text-[10px] text-gray-400">
                <div className="h-20 w-full relative">
                  <svg className="w-full h-full" viewBox="0 0 200 80">
                    <line x1="0" y1="20" x2="200" y2="20" stroke="#2c2c2c" />
                    <line x1="0" y1="50" x2="200" y2="50" stroke="#2c2c2c" />
                    <path
                      d="M 0 60 Q 30 70 70 50 T 140 25 T 200 15"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className="flex justify-between text-[8px] text-gray-500 mt-1">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">
                  Dark mode
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  For those who prefer Notion in dark mode there is love too.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Plug & Play + Community Driven */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Top item: Plug & Play */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between h-1/2">
              <div className="space-y-2 py-2 text-xs font-semibold text-gray-800">
                <div className="flex items-center gap-2">
                  <span>📊</span> <span>Transactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✈️</span> <span>Invoices</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📑</span> <span>Invoices items</span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-gray-900 text-sm mb-1">
                  Plug & Play
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Bring your own Notion setup, Magic Beans works with any
                  database.
                </p>
              </div>
            </div>

            {/* Bottom item: Community driven */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between h-1/2">
              {/* Colorful Doodle Beans */}
              <div className="flex items-center justify-center gap-3 py-3">
                <BeanOutline color="#f59e0b" size={40} rotation={-15} />
                <BeanOutline color="#ef4444" size={45} rotation={30} />
                <BeanOutline color="#3b82f6" size={42} rotation={-35} />
                <BeanOutline color="#10b981" size={40} rotation={15} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">
                  Community driven
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Magic Beans is an independent funded product driven by our
                  community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
