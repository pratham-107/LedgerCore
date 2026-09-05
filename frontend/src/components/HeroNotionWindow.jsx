import React, { useState, useEffect } from 'react';
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
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function HeroNotionWindow({ onOpenApp }) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | transactions | invoices
  const [liveAccounts, setLiveAccounts] = useState([]);
  const [liveTransactions, setLiveTransactions] = useState([]);
  const [livePnl, setLivePnl] = useState(null);
  const [liveBs, setLiveBs] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLiveData();
  }, []);

  const fetchLiveData = async () => {
    setLoading(true);
    try {
      const [accs, txns, pnl, bs] = await Promise.allSettled([
        api.getAccounts(),
        api.getTransactions(),
        api.getPnl(),
        api.getBalanceSheet()
      ]);

      if (accs.status === 'fulfilled' && accs.value?.length) {
        setLiveAccounts(accs.value);
      }
      if (txns.status === 'fulfilled' && txns.value?.length) {
        setLiveTransactions(txns.value);
      }
      if (pnl.status === 'fulfilled' && pnl.value) {
        setLivePnl(pnl.value);
      }
      if (bs.status === 'fulfilled' && bs.value) {
        setLiveBs(bs.value);
      }
    } catch (e) {
      console.warn('Connected to backend:', e);
    } finally {
      setLoading(false);
    }
  };

  const cashAccount = liveAccounts.find(a => a.name?.toLowerCase().includes('cash')) || liveAccounts[0];
  const cashBalance = cashAccount ? cashAccount.balance : 66500;
  const totalAssets = liveBs?.assets?.total ?? 125000;
  const revenueTotal = livePnl?.revenue?.total ?? 50600;
  const expenseTotal = livePnl?.expenses?.total ?? 24650;
  const netIncome = livePnl?.netIncome ?? 25950;
  const margin = livePnl?.margin ?? 51.28;

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
          <button 
            onClick={fetchLiveData} 
            title="Refresh from live backend"
            className="hover:text-black font-medium flex items-center gap-1 text-[11px] bg-white border border-gray-200 px-2 py-0.5 rounded cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Sync API</span>
          </button>
          <button onClick={onOpenApp} className="hover:text-black font-medium flex items-center gap-1">
            <span>Share</span>
          </button>
          <MessageSquare className="w-3.5 h-3.5 cursor-pointer hover:text-black" />
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
            <div 
              onClick={() => openAuthModal('login')}
              title="Click to sign in or switch account"
              className="flex items-center justify-between px-1.5 py-1.5 hover:bg-[#efedea] rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="flex items-center gap-2 truncate">
                <div className="w-5 h-5 rounded bg-black text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'L'}
                </div>
                <div className="truncate">
                  <div className="font-semibold text-xs text-gray-900 leading-tight truncate">
                    {isAuthenticated ? (user?.role || 'User') : 'Sign In'}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    {isAuthenticated ? user?.email : 'Click to authenticate'}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
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
              <div onClick={onOpenApp} className="flex items-center gap-2 px-2 py-1 hover:bg-[#efedea] rounded cursor-pointer font-medium text-black">
                <Plus className="w-3.5 h-3.5 text-black" />
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
                    <div onClick={onOpenApp} className="flex items-center gap-2 px-2 py-1 text-gray-500 hover:bg-[#efedea] rounded cursor-pointer">
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                      <span>Invoice items</span>
                    </div>
                    <div onClick={onOpenApp} className="flex items-center gap-2 px-2 py-1 text-gray-500 hover:bg-[#efedea] rounded cursor-pointer">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span>Contacts</span>
                    </div>
                    <div onClick={onOpenApp} className="flex items-center gap-2 px-2 py-1 text-gray-500 hover:bg-[#efedea] rounded cursor-pointer">
                      <Landmark className="w-3.5 h-3.5 text-gray-400" />
                      <span>Bank accounts</span>
                    </div>
                    <div onClick={onOpenApp} className="flex items-center gap-2 px-2 py-1 text-gray-500 hover:bg-[#efedea] rounded cursor-pointer">
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
                  className="text-xs bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded font-medium transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Manage Live Ledger</span>
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
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">Live API</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">2 years 3 months</div>
                </div>

                {/* Cash */}
                <div className="p-4 rounded-lg bg-[#faf9f7] border border-gray-200/70 hover:border-gray-300 transition-all">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Cash (Assets)
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">MongoDB</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 font-mono">
                    ${Number(cashBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Profit & Losses Table Card */}
              <div className="rounded-lg bg-[#faf9f7] border border-gray-200/80 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
                    <FolderClosed className="w-4 h-4 text-gray-700" /> Profit & Losses (MongoDB Aggregated)
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">Live Engine</span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Income */}
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="flex items-center gap-2 text-gray-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> Income
                    </span>
                    <span className="font-semibold text-gray-900 font-mono">${Number(revenueTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>

                  {/* COGS */}
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="flex items-center gap-2 text-gray-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Cost of Services Sold
                    </span>
                    <span className="font-semibold text-gray-500 font-mono">-$8,000.00</span>
                  </div>

                  {/* Gross Profit */}
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100 bg-white/70 px-2 rounded">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span> Gross Profit
                      <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.2 rounded font-medium">84.19%</span>
                    </div>
                    <span className="font-bold text-gray-900 font-mono">$42,600.00</span>
                  </div>

                  {/* Operating Expenses */}
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="flex items-center gap-2 text-gray-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Operating Expenses
                    </span>
                    <span className="font-semibold text-gray-500 font-mono">-${Number(expenseTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>

                  {/* Net Operating Income */}
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100 bg-white/70 px-2 rounded">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span> Net Operating Income
                      <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.2 rounded font-medium">68.38%</span>
                    </div>
                    <span className="font-bold text-gray-900 font-mono">$34,600.00</span>
                  </div>

                  {/* Taxes */}
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="flex items-center gap-2 text-gray-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Taxes
                    </span>
                    <span className="font-semibold text-gray-500 font-mono">-$8,650.00</span>
                  </div>

                  {/* Net Income */}
                  <div className="flex items-center justify-between py-2 bg-emerald-50/60 border border-emerald-200/60 px-2.5 rounded-md">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Net Income
                      <span className="bg-emerald-200 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-semibold">{margin}%</span>
                    </div>
                    <span className="font-extrabold text-emerald-900 text-sm font-mono">${Number(netIncome).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
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
                <span className="text-xs text-gray-500 font-mono">Real-time ledger entries</span>
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
                      { client: 'Netflix Inc', ref: 'INV-2024-001', num: 'ACC-2024-005', status: 'Draft', color: 'bg-gray-100 text-gray-700' },
                      { client: 'Figma Design', ref: 'Config 2024', num: 'ACC-2024-005', status: 'Sent', color: 'bg-blue-100 text-blue-700' },
                      { client: 'Apple Enterprise', ref: 'Vision Pro Site', num: 'ACC-2024-005', status: 'Sent', color: 'bg-blue-100 text-blue-700' },
                      { client: 'Twitter Tech', ref: 'Search Refactor', num: 'ACC-2024-005', status: 'Sent', color: 'bg-blue-100 text-blue-700' },
                      { client: 'Spotify Streaming', ref: 'Audio Player Integration', num: 'ACC-2024-005', status: 'Paid', color: 'bg-emerald-100 text-emerald-700' },
                      { client: 'Airtable Base', ref: 'Database Setup', num: 'ACC-2024-005', status: 'Paid', color: 'bg-emerald-100 text-emerald-700' },
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
                  <CreditCard className="w-5 h-5 text-purple-600" /> Live Transactions
                </h2>
                <button onClick={onOpenApp} className="text-xs bg-black text-white px-2.5 py-1 rounded cursor-pointer font-semibold">
                  + New Transaction
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#f7f6f3] border-b border-gray-200 text-gray-600">
                    <tr>
                      <th className="p-2.5 font-medium">Txn ID</th>
                      <th className="p-2.5 font-medium">Description</th>
                      <th className="p-2.5 font-medium">Status</th>
                      <th className="p-2.5 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {liveTransactions.length > 0 ? (
                      liveTransactions.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="p-2.5 text-gray-500 font-mono text-[11px]">{row.transactionId}</td>
                          <td className="p-2.5 font-medium text-gray-900">{row.description}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.status === 'POSTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-gray-900">
                            ${Number(row.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} {row.currency}
                          </td>
                        </tr>
                      ))
                    ) : (
                      [
                        { id: 'TXN-2024-001', desc: 'Apple Transfer', stat: 'POSTED', amt: '$11,460.00 USD' },
                        { id: 'TXN-2024-002', desc: 'WeWork Rent', stat: 'POSTED', amt: '$1,150.00 USD' },
                        { id: 'TXN-2024-003', desc: 'Payroll Jon Doe', stat: 'POSTED', amt: '$5,980.00 USD' }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="p-2.5 text-gray-500 font-mono">{row.id}</td>
                          <td className="p-2.5 font-medium text-gray-900">{row.desc}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {row.stat}
                            </span>
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-gray-900">
                            {row.amt}
                          </td>
                        </tr>
                      ))
                    )}
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
