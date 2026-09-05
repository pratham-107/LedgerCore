import React from 'react';
import { 
  X, 
  ExternalLink, 
  ChevronDown, 
  Receipt, 
  Calendar, 
  Tag, 
  Users, 
  CreditCard, 
  FileText,
  Sparkles,
  Zap,
  Moon,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { BeanOutline } from './FloatingBean';

export default function ToolkitSection() {
  return (
    <section id="features" className="py-24 bg-[#faf9f7] border-t border-gray-100 text-left">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mb-16 max-w-xl">
          The toolkit built for modern<br />financial operations
        </h2>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Database Settings Modal */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 flex flex-col justify-between shadow-sm">
            {/* Modal Mockup */}
            <div className="rounded-xl border border-gray-200/70 p-4 bg-[#faf9f7] text-xs mb-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 font-semibold text-gray-800">
                <span className="text-[11px] font-bold">Ledger Schema Settings</span>
                <X className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
              </div>

              <div className="py-2.5 flex items-center justify-between border-b border-gray-100">
                <span className="flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <Receipt className="w-3.5 h-3.5" /> Invoices & Entries
                </span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </div>

              <div className="space-y-2 pt-2 text-[11px] text-gray-600">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 font-mono text-[10px] text-gray-400">Aa invoice_name</span>
                  <span className="text-gray-400 flex items-center gap-0.5">Name <ChevronDown className="w-3 h-3" /></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 font-mono text-[10px] text-gray-400"># invoice_ref</span>
                  <span className="text-gray-400 flex items-center gap-0.5">Sequential <ChevronDown className="w-3 h-3" /></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 font-mono text-[10px] text-gray-400">$ total_amount</span>
                  <span className="text-gray-400 flex items-center gap-0.5">BigDecimal <ChevronDown className="w-3 h-3" /></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400" /> issue_date</span>
                  <span className="text-gray-400 flex items-center gap-0.5">ISO-8601 <ChevronDown className="w-3 h-3" /></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400" /> due_date</span>
                  <span className="text-gray-400 flex items-center gap-0.5">ISO-8601 <ChevronDown className="w-3 h-3" /></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3 text-gray-400" /> status</span>
                  <span className="text-gray-400 flex items-center gap-0.5">Enum <ChevronDown className="w-3 h-3" /></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3 text-gray-400" /> client_account</span>
                  <span className="text-gray-700 font-medium flex items-center gap-0.5">COA Linked ›</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Fully customizable</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Connect your Chart of Accounts and configure custom journal properties.
              </p>
            </div>
          </div>

          {/* Card 2: Real-time Sync + Dark Mode */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Top item: Real-time sync */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between h-1/2">
              <div className="flex justify-center py-4">
                <button className="bg-black hover:bg-gray-800 text-white font-semibold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-all">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Real-time Sync</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Live MongoDB Transactions</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Update anything in your ledger and see instant balance updates.
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
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-blue-500" /> High-contrast Theme
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Designed for WCAG 2.2 AA accessibility and clean reading across all displays.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Plug & Play + Open Architecture */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Top item: Plug & Play */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between h-1/2">
              <div className="space-y-2 py-2 text-xs font-semibold text-gray-800">
                <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-lg">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  <span>Double-Entry Transactions</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-lg">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>Automated Invoicing</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>P&L and Balance Sheet Pipelines</span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600" /> Plug & Play Architecture
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Easily integrate via REST endpoints with standard OpenAPI & Swagger docs.
                </p>
              </div>
            </div>

            {/* Bottom item: Open source / developer first */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between h-1/2">
              {/* Colorful Doodle Shapes */}
              <div className="flex items-center justify-center gap-3 py-3">
                <BeanOutline color="#f59e0b" size={40} rotation={-15} />
                <BeanOutline color="#ef4444" size={45} rotation={30} />
                <BeanOutline color="#3b82f6" size={42} rotation={-35} />
                <BeanOutline color="#10b981" size={40} rotation={15} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-rose-500" /> Developer First
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Built with Spring Boot 3.2, MongoDB 7, Redis, and React for production scale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
