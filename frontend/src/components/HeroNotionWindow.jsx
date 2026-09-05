import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  Plus, 
  MessageSquare, 
  Clock, 
  Star, 
  MoreHorizontal, 
  ChevronDown, 
  BarChart3, 
  Receipt, 
  CreditCard, 
  FileText, 
  Users, 
  Landmark, 
  Scale, 
  Lock, 
  Globe, 
  Briefcase, 
  TrendingUp, 
  HelpCircle,
  ArrowUpRight
} from 'lucide-react';

import { useCurrency } from '../context/CurrencyContext';

export default function HeroNotionWindow({ onOpenApp }) {
  const { format, currency } = useCurrency();
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | transactions | invoices

  return (
    <div className="relative mx-auto max-w-5xl rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-200/80 bg-white overflow-hidden text-left font-sans text-xs text-gray-800 transition-all hover:shadow-[0_25px_60px_rgba(0,0,0,0.16)]">
      {/* Notion Window Top Bar */}
      <div className="bg-[#f7f6f3] border-b border-gray-200 px-4 py-2.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          {/* Mac OS Window dots */}
          <div className="flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
          </div>
          
          <div className="flex items-center gap-1.5 text-gray-600 font-medium pl-1 text-[11px]">
            <span className="hover:text-black cursor-pointer">LedgerCore Workspace</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Financial Overview</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-500">
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Live Showcase</span>
          </div>
          <button onClick={onOpenApp} className="hover:text-black font-semibold flex items-center gap-1 text-[11px] text-gray-700 bg-white border border-gray-200 px-2.5 py-0.5 rounded-md hover:bg-gray-50 transition-colors shadow-2xs">
            <span>Launch App</span>
            <ArrowUpRight className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Main Notion Split: Sidebar + Canvas */}
      <div className="flex min-h-[480px]">
        {/* Left Sidebar */}
        <aside className="w-52 bg-[#f7f6f3] border-r border-gray-200 p-3 flex flex-col justify-between select-none hidden sm:flex">
          <div className="space-y-4">
            {/* Workspace profile */}
            <div 
              onClick={onOpenApp}
              className="flex items-center justify-between px-1.5 py-1.5 hover:bg-[#efedea] rounded-lg cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <div className="w-5 h-5 rounded bg-black text-white font-bold text-[10px] flex items-center justify-center shrink-0">L</div>
                <div className="truncate">
                  <div className="font-semibold text-xs text-gray-900 leading-tight truncate">LedgerCore Enterprise</div>
                  <div className="text-[10px] text-gray-500 truncate">team@ledgercore.com</div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </div>

            {/* Quick Actions */}
            <div className="space-y-0.5 text-xs text-gray-600">
              <div onClick={onOpenApp} className="flex items-center gap-2 px-2 py-1 hover:bg-[#efedea] rounded cursor-pointer">
                <Search className="w-3.5 h-3.5 text-gray-500" />
                <span>Search</span>
              </div>
              <div onClick={onOpenApp} className="flex items-center gap-2 px-2 py-1 hover:bg-[#efedea] rounded cursor-pointer">
                <Bell className="w-3.5 h-3.5 text-gray-500" />
                <span>Updates</span>
              </div>
              <div onClick={onOpenApp} className="flex items-center gap-2 px-2 py-1 hover:bg-[#efedea] rounded cursor-pointer">
                <Settings className="w-3.5 h-3.5 text-gray-500" />
                <span>Settings</span>
              </div>
            </div>

            {/* Section 1: Core Books */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">
                Books & Ledger
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left flex items-center gap-2 px-2 py-1 rounded transition-colors ${
                    activeTab === 'dashboard' ? 'bg-[#e8e7e3] font-semibold text-gray-900' : 'text-gray-600 hover:bg-[#efedea]'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`w-full text-left flex items-center gap-2 px-2 py-1 rounded transition-colors ${
                    activeTab === 'transactions' ? 'bg-[#e8e7e3] font-semibold text-gray-900' : 'text-gray-600 hover:bg-[#efedea]'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                  <span>Transactions</span>
                </button>
                <button
                  onClick={() => setActiveTab('invoices')}
                  className={`w-full text-left flex items-center gap-2 px-2 py-1 rounded transition-colors ${
                    activeTab === 'invoices' ? 'bg-[#e8e7e3] font-semibold text-gray-900' : 'text-gray-600 hover:bg-[#efedea]'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Invoices</span>
                </button>
                <div onClick={onOpenApp} className="flex items-center gap-2 px-2 py-1 text-gray-500 hover:bg-[#efedea] rounded cursor-pointer">
                  <Landmark className="w-3.5 h-3.5 text-gray-400" />
                  <span>Bank accounts</span>
                </div>
                <div onClick={onOpenApp} className="flex items-center gap-2 px-2 py-1 text-gray-500 hover:bg-[#efedea] rounded cursor-pointer">
                  <Scale className="w-3.5 h-3.5 text-gray-400" />
                  <span>Balance Sheet</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom links */}
          <div className="space-y-0.5 text-xs text-gray-500 pt-4 border-t border-gray-200">
            <div onClick={onOpenApp} className="flex items-center gap-2 px-2 py-1 hover:bg-[#efedea] rounded cursor-pointer">
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <span>Admin Center</span>
            </div>
            <div onClick={onOpenApp} className="flex items-center gap-2 px-2 py-1 hover:bg-[#efedea] rounded cursor-pointer">
              <Briefcase className="w-3.5 h-3.5 text-gray-400" />
              <span>Finance Ops</span>
            </div>
          </div>
        </aside>

        {/* Right Canvas / Dashboard Area */}
        <main className="flex-1 bg-white p-6 sm:p-8 overflow-y-auto relative">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header Title */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" /> Financial Dashboard
                </h2>
                <button
                  onClick={onOpenApp}
                  className="text-xs bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Open Full App</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Metric Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="bg-[#fbfbfa] p-4 rounded-xl border border-gray-200/70 hover:border-gray-300 transition-all">
                  <div className="text-[11px] text-gray-500 font-medium">Total Cash & Assets</div>
                  <div className="text-xl font-bold text-gray-900 mt-1">{format(482950)}</div>
                  <div className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3 h-3" /> +12.4% this quarter
                  </div>
                </div>

                <div className="bg-[#fbfbfa] p-4 rounded-xl border border-gray-200/70 hover:border-gray-300 transition-all">
                  <div className="text-[11px] text-gray-500 font-medium">Monthly Operating Burn</div>
                  <div className="text-xl font-bold text-gray-900 mt-1">{format(14200)}</div>
                  <div className="text-[10px] text-gray-400 mt-1">34 months runway</div>
                </div>

                <div className="bg-[#fbfbfa] p-4 rounded-xl border border-gray-200/70 hover:border-gray-300 transition-all">
                  <div className="text-[11px] text-gray-500 font-medium">Net Operating Income</div>
                  <div className="text-xl font-bold text-emerald-600 mt-1">+{format(38450)}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">100% Balanced ({currency.code})</div>
                </div>
              </div>

              {/* P&L Statement Snapshot */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="bg-[#f7f6f3] px-4 py-2 border-b border-gray-200 font-semibold text-gray-700 flex justify-between items-center">
                  <span>Profit & Loss Breakdown (YTD)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    {currency.code} ({currency.symbol})
                  </span>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Account Category</th>
                      <th className="py-2.5 px-4 font-semibold">Classification</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2.5 px-4 font-medium text-gray-800">SaaS & Enterprise Revenue</td>
                      <td className="py-2.5 px-4 text-gray-500">Operating Revenue</td>
                      <td className="py-2.5 px-4 font-bold text-emerald-600 text-right">+{format(124500)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-medium text-gray-800">Cloud Infrastructure (AWS)</td>
                      <td className="py-2.5 px-4 text-gray-500">Cost of Goods Sold</td>
                      <td className="py-2.5 px-4 font-bold text-rose-600 text-right">-{format(8200)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-medium text-gray-800">Payroll & Engineering</td>
                      <td className="py-2.5 px-4 text-gray-500">Operating Expense</td>
                      <td className="py-2.5 px-4 font-bold text-rose-600 text-right">-{format(62400)}</td>
                    </tr>
                    <tr className="bg-gray-50/70 font-bold border-t border-gray-200">
                      <td className="py-3 px-4 text-gray-900" colSpan={2}>Net Operating Margin</td>
                      <td className="py-3 px-4 text-emerald-600 text-right text-sm">+{format(53900)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" /> Transactions Ledger
                </h2>
                <button onClick={onOpenApp} className="text-xs bg-black text-white px-3 py-1.5 rounded-lg font-medium">
                  Open in Workspace
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3">Reference</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                      <th className="py-2 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { date: 'Sep 04', desc: 'Enterprise Annual License - Stripe', ref: 'INV-4091', amt: '$12,000.00', status: 'POSTED' },
                      { date: 'Sep 03', desc: 'AWS Production Server Cluster', ref: 'AWS-9921', amt: '$1,450.00', status: 'POSTED' },
                      { date: 'Sep 01', desc: 'Consulting Advisory Services', ref: 'ADV-0112', amt: '$4,500.00', status: 'POSTED' },
                      { date: 'Aug 28', desc: 'Office Lease - Q3 Settlement', ref: 'LS-8812', amt: '$6,200.00', status: 'POSTED' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="py-2.5 px-3 text-gray-500">{row.date}</td>
                        <td className="py-2.5 px-3 font-semibold text-gray-900">{row.desc}</td>
                        <td className="py-2.5 px-3 text-gray-500 font-mono text-[11px]">{row.ref}</td>
                        <td className="py-2.5 px-3 font-bold text-gray-900 text-right">{row.amt}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-600" /> Active Invoices
                </h2>
                <button onClick={onOpenApp} className="text-xs bg-black text-white px-3 py-1.5 rounded-lg font-medium">
                  Create Invoice
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="py-2 px-3">Invoice #</th>
                      <th className="py-2 px-3">Customer</th>
                      <th className="py-2 px-3">Due Date</th>
                      <th className="py-2 px-3 text-right">Total</th>
                      <th className="py-2 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { num: 'INV-2026-001', client: 'Acme Global Inc', due: 'Sep 15, 2026', amt: '$4,500.00', status: 'PAID' },
                      { num: 'INV-2026-002', client: 'TechFlow Ventures', due: 'Sep 22, 2026', amt: '$8,200.00', status: 'PENDING' },
                      { num: 'INV-2026-003', client: 'Stripe Integration Client', due: 'Oct 01, 2026', amt: '$14,000.00', status: 'DRAFT' }
                    ].map((inv, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-mono font-medium text-gray-700">{inv.num}</td>
                        <td className="py-2.5 px-3 font-semibold text-gray-900">{inv.client}</td>
                        <td className="py-2.5 px-3 text-gray-500">{inv.due}</td>
                        <td className="py-2.5 px-3 font-bold text-gray-900 text-right">{inv.amt}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : inv.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
