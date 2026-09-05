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
  Home,
  DollarSign,
  Lock,
  Globe,
  Briefcase,
  FolderClosed,
  TrendingUp,
  HelpCircle
} from 'lucide-react';

export default function HeroNotionWindow({ onOpenApp }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | transactions | invoices

  return (
    <div className="w-full max-w-5xl mx-auto rounded-xl border border-gray-200/80 shadow-2xl bg-white overflow-hidden text-[#37352f] text-[13px] font-sans text-left">
      {/* Notion Window Topbar */}
      <div className="h-10 bg-[#f7f6f3] border-b border-gray-200 flex items-center justify-between px-4 select-none">
        {/* Window controls */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
          <div className="flex items-center gap-1 text-gray-400 ml-3">
            <span className="cursor-pointer hover:text-gray-700">‹</span>
            <span className="cursor-pointer hover:text-gray-700">›</span>
          </div>
        </div>

        {/* Center Breadcrumb */}
        <div className="flex items-center gap-1.5 text-gray-600 text-xs font-medium">
          <span>Workspace</span>
          <span className="text-gray-300">/</span>
          <span>Finances</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold flex items-center gap-1">
            {activeTab === 'dashboard' && <><BarChart3 className="w-3.5 h-3.5 text-blue-600" /> Dashboard</>}
            {activeTab === 'invoices' && <><Receipt className="w-3.5 h-3.5 text-emerald-600" /> Invoices</>}
            {activeTab === 'transactions' && <><CreditCard className="w-3.5 h-3.5 text-purple-600" /> Transactions</>}
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 text-gray-500 text-xs">
          <button onClick={onOpenApp} className="hover:text-black font-medium flex items-center gap-1">
            <span>Share</span>
          </button>
          <MessageSquare className="w-3.5 h-3.5 cursor-pointer hover:text-black" />
          <Clock className="w-3.5 h-3.5 cursor-pointer hover:text-black" />
          <Star className="w-3.5 h-3.5 cursor-pointer hover:text-black" />
          <MoreHorizontal className="w-3.5 h-3.5 cursor-pointer hover:text-black" />
        </div>
      </div>

      {/* Main Notion Split: Sidebar + Canvas */}
      <div className="flex min-h-[500px]">
        {/* Left Sidebar */}
        <aside className="w-56 bg-[#f7f6f3] border-r border-gray-200 p-3 flex flex-col justify-between select-none">
          <div className="space-y-4">
            {/* Workspace profile */}
            <div className="flex items-center justify-between px-1 py-1 hover:bg-[#efedea] rounded cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-black text-white font-bold text-[10px] flex items-center justify-center">L</div>
                <div className="truncate">
                  <div className="font-semibold text-xs text-gray-900 leading-tight">LedgerCore</div>
                  <div className="text-[10px] text-gray-500 truncate">team@ledgercore.com</div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>

            {/* Quick Actions */}
            <div className="space-y-0.5 text-xs text-gray-600">
              <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#efedea] rounded cursor-pointer">
                <Search className="w-3.5 h-3.5 text-gray-500" />
                <span>Search</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#efedea] rounded cursor-pointer">
                <Bell className="w-3.5 h-3.5 text-gray-500" />
                <span>Updates</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#efedea] rounded cursor-pointer">
                <Settings className="w-3.5 h-3.5 text-gray-500" />
                <span>Settings & members</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#efedea] rounded cursor-pointer">
                <Plus className="w-3.5 h-3.5 text-gray-500" />
                <span>New page</span>
              </div>
            </div>

            {/* Teamspaces */}
            <div className="pt-2">
              <div className="text-[10px] font-semibold text-gray-400 px-2 uppercase tracking-wider mb-1">Teamspaces</div>
              <div className="space-y-0.5 text-xs">
                <div className="flex items-center gap-2 px-2 py-1 text-gray-600 hover:bg-[#efedea] rounded cursor-pointer">
                  <Home className="w-3.5 h-3.5 text-gray-400" />
                  <span>General</span>
                </div>
                <div>
                  <div className="flex items-center justify-between px-2 py-1 text-gray-900 font-medium hover:bg-[#efedea] rounded cursor-pointer">
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Finances</span>
                    </span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                  {/* Subpages */}
                  <div className="pl-3 space-y-0.5 mt-0.5">
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
                    <div className="flex items-center gap-2 px-2 py-1 text-gray-500 hover:bg-[#efedea] rounded cursor-pointer">
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                      <span>Invoice items</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 text-gray-500 hover:bg-[#efedea] rounded cursor-pointer">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span>Contacts</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 text-gray-500 hover:bg-[#efedea] rounded cursor-pointer">
                      <Landmark className="w-3.5 h-3.5 text-gray-400" />
                      <span>Bank accounts</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 text-gray-500 hover:bg-[#efedea] rounded cursor-pointer">
                      <Scale className="w-3.5 h-3.5 text-gray-400" />
                      <span>Balances</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom links */}
          <div className="space-y-0.5 text-xs text-gray-500 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#efedea] rounded cursor-pointer">
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <span>Admin</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#efedea] rounded cursor-pointer">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span>Public</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#efedea] rounded cursor-pointer">
              <Briefcase className="w-3.5 h-3.5 text-gray-400" />
              <span>Finance</span>
            </div>
          </div>
        </aside>

        {/* Right Canvas / Dashboard Area */}
        <main className="flex-1 bg-white p-8 overflow-y-auto relative">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header Title */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" /> Dashboard
                </h2>
                <button
                  onClick={onOpenApp}
                  className="text-xs bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded font-medium transition-all"
                >
                  Manage Ledger
                </button>
              </div>

              {/* Top Stat Cards: Runway & Cash */}
              <div className="grid grid-cols-2 gap-4">
                {/* Runway */}
                <div className="p-4 rounded-lg bg-[#faf9f7] border border-gray-200/70 hover:border-gray-300 transition-all">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Runway
                    </span>
                    <span className="bg-gray-200/80 text-gray-600 text-[10px] px-1.5 py-0.5 rounded font-medium">Live data</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">2 years 3 months</div>
                </div>

                {/* Cash */}
                <div className="p-4 rounded-lg bg-[#faf9f7] border border-gray-200/70 hover:border-gray-300 transition-all">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Cash
                    </span>
                    <span className="bg-gray-200/80 text-gray-600 text-[10px] px-1.5 py-0.5 rounded font-medium">Live data</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">$66,500</div>
                </div>
              </div>

              {/* Profit & Losses Table Card */}
              <div className="rounded-lg bg-[#faf9f7] border border-gray-200/80 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
                    <FolderClosed className="w-4 h-4 text-gray-700" /> Profit & Losses
                  </div>
                  <span className="bg-gray-200/80 text-gray-600 text-[10px] px-1.5 py-0.5 rounded font-medium">Real-time</span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Income */}
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="flex items-center gap-2 text-gray-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> Income
                    </span>
                    <span className="font-semibold text-gray-900">$50,600</span>
                  </div>

                  {/* COGS */}
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="flex items-center gap-2 text-gray-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Cost of Services Sold
                    </span>
                    <span className="font-semibold text-gray-500">-$8,000</span>
                  </div>

                  {/* Gross Profit */}
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100 bg-white/70 px-2 rounded">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span> Gross Profit
                      <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.2 rounded font-medium">84.19%</span>
                    </div>
                    <span className="font-bold text-gray-900">$42,600</span>
                  </div>

                  {/* Operating Expenses */}
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="flex items-center gap-2 text-gray-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Operating Expenses
                    </span>
                    <span className="font-semibold text-gray-500">-$8,000</span>
                  </div>

                  {/* Net Operating Income */}
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100 bg-white/70 px-2 rounded">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span> Net Operating Income
                      <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.2 rounded font-medium">68.38%</span>
                    </div>
                    <span className="font-bold text-gray-900">$34,600</span>
                  </div>

                  {/* Taxes */}
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="flex items-center gap-2 text-gray-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Taxes
                    </span>
                    <span className="font-semibold text-gray-500">-$8,650</span>
                  </div>

                  {/* Net Income */}
                  <div className="flex items-center justify-between py-2 bg-emerald-50/60 border border-emerald-200/60 px-2.5 rounded-md">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Net Income
                      <span className="bg-emerald-200 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-semibold">51.28%</span>
                    </div>
                    <span className="font-extrabold text-emerald-900 text-sm">$25,950</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-600" /> Invoices
                </h2>
                <span className="text-xs text-gray-500">6 invoices</span>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#f7f6f3] border-b border-gray-200 text-gray-600">
                    <tr>
                      <th className="p-2.5 font-medium">Client</th>
                      <th className="p-2.5 font-medium">Invoice Reference</th>
                      <th className="p-2.5 font-medium">Number</th>
                      <th className="p-2.5 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { client: 'Netflix', ref: 'New Invoice', num: '20230189', status: 'Draft', color: 'bg-gray-100 text-gray-700' },
                      { client: 'Figma', ref: 'Config 2023', num: '20230188', status: 'Sent', color: 'bg-blue-100 text-blue-700' },
                      { client: 'Apple', ref: 'Vision Pro Site', num: '20230187', status: 'Sent', color: 'bg-blue-100 text-blue-700' },
                      { client: 'Twitter', ref: 'Search Refactor', num: '20230186', status: 'Sent', color: 'bg-blue-100 text-blue-700' },
                      { client: 'Spotify', ref: 'New Music Player', num: '20230185', status: 'Paid', color: 'bg-emerald-100 text-emerald-700' },
                      { client: 'Airtable', ref: 'New Product Site', num: '20230184', status: 'Paid', color: 'bg-emerald-100 text-emerald-700' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="p-2.5 font-semibold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          {row.client}
                        </td>
                        <td className="p-2.5 text-gray-600">{row.ref}</td>
                        <td className="p-2.5 font-mono text-gray-500">{row.num}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${row.color}`}>
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

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" /> Transactions
                </h2>
                <button onClick={onOpenApp} className="text-xs bg-black text-white px-2.5 py-1 rounded">New Transaction</button>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#f7f6f3] border-b border-gray-200 text-gray-600">
                    <tr>
                      <th className="p-2.5 font-medium">Date</th>
                      <th className="p-2.5 font-medium">Transaction</th>
                      <th className="p-2.5 font-medium">Category</th>
                      <th className="p-2.5 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { date: 'June 30, 2023', name: 'Apple Transfer', cat: 'Revenue', amt: '+€11,460.00', positive: true },
                      { date: 'June 23, 2023', name: 'Uber Travel', cat: 'Travel', amt: '-€40.00', positive: false },
                      { date: 'June 22, 2023', name: 'Accountant May', cat: 'Accounting', amt: '-€345.00', positive: false },
                      { date: 'June 22, 2023', name: 'Phone Bill', cat: 'Utilities', amt: '-€345.00', positive: false },
                      { date: 'June 20, 2023', name: 'Google Workspace', cat: 'Software', amt: '-€345.00', positive: false },
                      { date: 'June 20, 2023', name: 'Superhuman Mail', cat: 'Software', amt: '-€30.00', positive: false },
                      { date: 'June 19, 2023', name: 'Slack Tech', cat: 'Software', amt: '-€80.00', positive: false },
                      { date: 'June 15, 2023', name: 'WeWork Rent', cat: 'Rent', amt: '-€1,150.00', positive: false },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="p-2.5 text-gray-500">{row.date}</td>
                        <td className="p-2.5 font-medium text-gray-900">{row.name}</td>
                        <td className="p-2.5">
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                            {row.cat}
                          </span>
                        </td>
                        <td className={`p-2.5 text-right font-mono font-semibold ${row.positive ? 'text-emerald-600' : 'text-gray-800'}`}>
                          {row.amt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Floating Help Circle at bottom-right */}
          <div 
            onClick={onOpenApp}
            className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 flex items-center justify-center cursor-pointer text-gray-600 transition-all shadow-sm"
          >
            <HelpCircle className="w-4 h-4" />
          </div>
        </main>
      </div>
    </div>
  );
}
