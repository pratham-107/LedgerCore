import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  CreditCard, 
  PlusCircle, 
  Landmark, 
  Receipt, 
  FileSpreadsheet, 
  Scale, 
  LogOut, 
  ArrowLeft, 
  RotateCcw, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Download, 
  UploadCloud, 
  Layers, 
  Search, 
  Filter, 
  RefreshCw, 
  ShieldAlert,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency, SUPPORTED_CURRENCIES } from '../context/CurrencyContext';
import CurrencySelector from './CurrencySelector';

export default function DashboardView({ onBackToHome }) {
  const { user, logout } = useAuth();
  const { currency, currencyCode, format, formatRaw, convertFromUSD, convert } = useCurrency();
  const userRole = user?.role || 'VIEWER';

  // Active sub-view
  const [activeTab, setActiveTab] = useState('overview'); // overview | transactions | new-txn | accounts | invoices | import | reports
  
  // Data states from Spring Boot
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pnl, setPnl] = useState(null);
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  // New Transaction State
  const [txnDesc, setTxnDesc] = useState('');
  const [txnCurrency, setTxnCurrency] = useState('USD');
  const [txnReference, setTxnReference] = useState('');
  const [entries, setEntries] = useState([
    { accountId: '', type: 'DEBIT', amount: '' },
    { accountId: '', type: 'CREDIT', amount: '' }
  ]);

  // New Account State
  const [newAccName, setNewAccName] = useState('');
  const [newAccType, setNewAccType] = useState('ASSET');
  const [newAccCat, setNewAccCat] = useState('CURRENT_ASSET');
  const [newAccCur, setNewAccCur] = useState('USD');
  const [newAccBal, setNewAccBal] = useState('0.00');

  // CSV Import State
  const [csvFile, setCsvFile] = useState(null);
  const [importing, setImporting] = useState(false);

  // RBAC Permission checks
  const canPostTransactions = userRole === 'ADMIN' || userRole === 'ACCOUNTANT';
  const canManageAccounts = userRole === 'ADMIN';
  const canReverse = userRole === 'ADMIN' || userRole === 'ACCOUNTANT';
  const canImportCsv = userRole === 'ADMIN' || userRole === 'ACCOUNTANT';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const [accs, txns, pnlData, bsData] = await Promise.all([
        api.getAccounts(),
        api.getTransactions(),
        api.getPnl(),
        api.getBalanceSheet()
      ]);
      setAccounts(accs || []);
      setTransactions(txns || []);
      setPnl(pnlData);
      setBalanceSheet(bsData);

      if (accs && accs.length >= 2 && !entries[0].accountId) {
        setEntries([
          { accountId: accs[0].accountId || accs[0].id, type: 'DEBIT', amount: '250.00' },
          { accountId: accs[1].accountId || accs[1].id, type: 'CREDIT', amount: '250.00' }
        ]);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error loading backend data: ' + (err.response?.data?.message || err.message) });
    } finally {
      setLoading(false);
    }
  };

  // Zero-sum validation
  const totalDebits = entries.reduce((sum, e) => e.type === 'DEBIT' ? sum + (parseFloat(e.amount) || 0) : sum, 0);
  const totalCredits = entries.reduce((sum, e) => e.type === 'CREDIT' ? sum + (parseFloat(e.amount) || 0) : sum, 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.001 && totalDebits > 0;

  const handleAddEntry = () => {
    setEntries([...entries, { accountId: accounts[0]?.accountId || '', type: 'CREDIT', amount: '' }]);
  };

  const handleRemoveEntry = (idx) => {
    if (entries.length > 2) {
      setEntries(entries.filter((_, i) => i !== idx));
    }
  };

  const handleCreateTxn = async (e) => {
    e.preventDefault();
    if (!canPostTransactions) {
      setStatusMessage({ type: 'error', text: 'RBAC Access Denied: VIEWER role cannot post transactions.' });
      return;
    }
    if (!isBalanced) {
      setStatusMessage({ type: 'error', text: 'Unbalanced entry: Sum of Debits must equal Sum of Credits.' });
      return;
    }

    try {
      await api.createTransaction({
        description: txnDesc || 'Double-entry Journal Entry',
        currency: txnCurrency,
        reference: txnReference || 'REF-' + Math.floor(Math.random() * 100000),
        entries: entries.map(e => ({
          accountId: e.accountId,
          type: e.type,
          amount: parseFloat(e.amount)
        }))
      });
      setStatusMessage({ type: 'success', text: 'Transaction successfully committed to the immutable ledger.' });
      setTxnDesc('');
      setTxnReference('');
      loadDashboardData();
      setActiveTab('transactions');
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Post failed: ' + (err.response?.data?.message || err.message) });
    }
  };

  const handleReverseTxn = async (transactionId) => {
    if (!canReverse) {
      setStatusMessage({ type: 'error', text: 'RBAC Access Denied: VIEWER role cannot reverse transactions.' });
      return;
    }
    if (!window.confirm(`Confirm immutable reversal for transaction ${transactionId}?`)) return;

    try {
      await api.reverseTransaction(transactionId, 'Manual correction initiated from workspace');
      setStatusMessage({ type: 'success', text: `Transaction ${transactionId} reversed with compensatory audit entry.` });
      loadDashboardData();
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Reversal failed: ' + (err.response?.data?.message || err.message) });
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!canManageAccounts) {
      setStatusMessage({ type: 'error', text: 'RBAC Access Denied: Only ADMIN role can create Chart of Accounts.' });
      return;
    }

    try {
      await api.createAccount({
        accountName: newAccName,
        type: newAccType,
        category: newAccCat,
        currency: newAccCur,
        initialBalance: parseFloat(newAccBal) || 0
      });
      setStatusMessage({ type: 'success', text: `Account ${newAccName} created in Chart of Accounts.` });
      setNewAccName('');
      setNewAccBal('0.00');
      loadDashboardData();
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Account creation failed: ' + (err.response?.data?.message || err.message) });
    }
  };

  const handleCsvImport = async (e) => {
    e.preventDefault();
    if (!csvFile) return;
    if (!canImportCsv) {
      setStatusMessage({ type: 'error', text: 'RBAC Access Denied: VIEWER role cannot import CSV bank feeds.' });
      return;
    }

    setImporting(true);
    try {
      const res = await api.importTransactionsCsv(csvFile);
      setStatusMessage({ 
        type: 'success', 
        text: `CSV Import Complete: ${res.successfulRecords || 0} transactions posted (${res.failedRecords || 0} failed).` 
      });
      setCsvFile(null);
      loadDashboardData();
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'CSV Import failed: ' + (err.response?.data?.message || err.message) });
    } finally {
      setImporting(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const blob = await api.exportTransactionsCsv();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ledgercore-transactions-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStatusMessage({ type: 'success', text: 'Ledger exported to CSV successfully.' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Export failed: ' + err.message });
    }
  };

  const getRoleBadge = () => {
    switch (userRole) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> ADMIN (Full Control)
          </span>
        );
      case 'ACCOUNTANT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 shadow-xs">
            <Building2 className="w-3.5 h-3.5 text-blue-700" /> ACCOUNTANT (Posting & Invoices)
          </span>
        );
      case 'VIEWER':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300 shadow-xs">
            <UserCheck className="w-3.5 h-3.5 text-purple-700" /> VIEWER (Read-Only)
          </span>
        );
    }
  };

  const filteredTxns = transactions.filter(t => 
    t.description?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    t.transactionId?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    t.reference?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f6f3] text-gray-900 flex flex-col font-sans">
      {/* Top Application Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
          </button>

          <div className="h-5 w-[1px] bg-gray-200" />

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-gray-950">LedgerCore Workspace</span>
              <div className="text-[10px] text-gray-500 font-medium">Enterprise Double-Entry Engine</div>
            </div>
          </div>
        </div>

        {/* User Identity & System Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-medium text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Connected</span>
          </div>

          {/* Worldwide Currency Switcher */}
          <CurrencySelector variant="dashboard" />

          <div className="h-5 w-[1px] bg-gray-200" />

          <div className="flex items-center gap-2.5">
            {getRoleBadge()}
            <span className="text-xs font-semibold text-gray-700 max-w-[180px] truncate" title={user?.email}>
              {user?.email}
            </span>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-all"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </header>

      {/* Status Notification */}
      {statusMessage && (
        <div className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-500 text-white shadow-xs' 
            : 'bg-rose-600 text-white shadow-xs'
        }`}>
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-white/80 hover:text-white text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Core Financials</div>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    activeTab === 'overview' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <span>Dashboard Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    activeTab === 'transactions' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <span>Transactions Ledger</span>
                  <span className="ml-auto text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full font-bold">
                    {transactions.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('new-txn')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    activeTab === 'new-txn' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                  } ${!canPostTransactions ? 'opacity-50' : ''}`}
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>Post Double-Entry</span>
                  {!canPostTransactions && <span className="ml-auto text-[9px] bg-amber-100 text-amber-800 px-1 rounded">Locked</span>}
                </button>

                <button
                  onClick={() => setActiveTab('accounts')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    activeTab === 'accounts' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-amber-400" />
                  <span>Chart of Accounts</span>
                  <span className="ml-auto text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full font-bold">
                    {accounts.length}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Reports & Tools</div>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    activeTab === 'reports' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Scale className="w-4 h-4 text-teal-400" />
                  <span>P&L & Balance Sheet</span>
                </button>

                <button
                  onClick={() => setActiveTab('invoices')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    activeTab === 'invoices' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Receipt className="w-4 h-4 text-indigo-400" />
                  <span>Invoices & Billing</span>
                </button>

                <button
                  onClick={() => setActiveTab('import')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    activeTab === 'import' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                  } ${!canImportCsv ? 'opacity-50' : ''}`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>CSV Bulk Feeds</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Data Sync */}
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Sync MongoDB'}</span>
            </button>
          </div>
        </aside>

        {/* Right Main Content Pane */}
        <main className="flex-1 p-8 overflow-y-auto max-h-[calc(100vh-60px)]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-950">Financial Dashboard Overview</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Real-time ledger aggregation from Spring Boot & MongoDB.</p>
                </div>
                {canPostTransactions && (
                  <button
                    onClick={() => setActiveTab('new-txn')}
                    className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-400" /> Post New Transaction
                  </button>
                )}
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-950">
                    {format(pnl?.totalRevenue || 0)}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1">Aggregated Income ({currency.code})</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Expenses</span>
                    <TrendingDown className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-950">
                    {format(pnl?.totalExpense || 0)}
                  </div>
                  <div className="text-[11px] text-rose-600 font-medium mt-1">Operational Burn ({currency.code})</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Net Income</span>
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className={`text-2xl font-bold ${pnl?.netIncome >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {format(pnl?.netIncome || 0)}
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium mt-1">Revenue - Expenses ({currency.code})</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Assets</span>
                    <Landmark className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-950">
                    {format(balanceSheet?.totalAssets || 0)}
                  </div>
                  <div className="text-[11px] text-amber-600 font-medium mt-1">Cash & Receivables ({currency.code})</div>
                </div>
              </div>

              {/* Recent Transactions Table Preview */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-900">Recent Immutable Transactions</h3>
                  <button onClick={() => setActiveTab('transactions')} className="text-xs font-semibold text-blue-600 hover:underline">
                    View All ({transactions.length})
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100 uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-4">Txn ID</th>
                        <th className="py-2.5 px-4">Description</th>
                        <th className="py-2.5 px-4">Reference</th>
                        <th className="py-2.5 px-4">Amount</th>
                        <th className="py-2.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {transactions.slice(0, 5).map((t) => (
                        <tr key={t.id || t.transactionId} className="hover:bg-gray-50/80">
                          <td className="py-3 px-4 font-mono font-medium text-gray-600">{t.transactionId}</td>
                          <td className="py-3 px-4 font-semibold text-gray-900">{t.description}</td>
                          <td className="py-3 px-4 text-gray-500">{t.reference || '-'}</td>
                          <td className="py-3 px-4 font-bold text-gray-900">
                            {(SUPPORTED_CURRENCIES[t.currency]?.symbol || '$')}{(t.amount || 0).toFixed(2)} {t.currency}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              t.status === 'POSTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {transactions.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-400">No transactions recorded yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRANSACTIONS LEDGER */}
          {activeTab === 'transactions' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-950">Immutable Transactions Ledger</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Every financial entry is permanently logged with zero-sum verification.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCsv}
                    className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                  {canPostTransactions && (
                    <button
                      onClick={() => setActiveTab('new-txn')}
                      className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-400" /> New Transaction
                    </button>
                  )}
                </div>
              </div>

              {/* Search filter */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter transactions by description, ID, or reference..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              {/* Transactions List */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-100 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Txn ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTxns.map((t) => (
                      <tr key={t.id || t.transactionId} className="hover:bg-gray-50/80">
                        <td className="py-3.5 px-4 font-mono font-medium text-gray-700">{t.transactionId}</td>
                        <td className="py-3.5 px-4 text-gray-500">
                          {t.postedAt ? new Date(t.postedAt).toLocaleDateString() : 'Today'}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-900">{t.description}</div>
                          {t.reference && <div className="text-[10px] text-gray-400">Ref: {t.reference}</div>}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-900">
                          {(SUPPORTED_CURRENCIES[t.currency]?.symbol || '$')}{(t.amount || 0).toFixed(2)} {t.currency}
                          {t.currency !== currencyCode && (
                            <span className="block text-[10px] text-gray-400 font-normal">
                              ≈ {format(convert(t.amount, t.currency, 'USD'))}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'POSTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {t.status === 'POSTED' && canReverse && (
                            <button
                              onClick={() => handleReverseTxn(t.transactionId)}
                              className="text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-1 rounded font-semibold transition-all inline-flex items-center gap-1"
                              title="Post compensating reversal transaction"
                            >
                              <RotateCcw className="w-3 h-3" /> Reverse
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredTxns.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-gray-400">No matching transactions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: POST DOUBLE-ENTRY TRANSACTION */}
          {activeTab === 'new-txn' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-950">Post Double-Entry Transaction</h1>
                <p className="text-xs text-gray-500 mt-0.5">Enforces formal accounting zero-sum balancing (Sum of Debits = Sum of Credits).</p>
              </div>

              {!canPostTransactions && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-xs">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="font-bold">Read-Only Permission:</span> Your current role ({userRole}) does not have permission to post transactions. Only ADMIN and ACCOUNTANT can post.
                  </div>
                </div>
              )}

              <form onSubmit={handleCreateTxn} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      required
                      value={txnDesc}
                      onChange={(e) => setTxnDesc(e.target.value)}
                      placeholder="e.g. SaaS Subscription Revenue, Office Rent"
                      disabled={!canPostTransactions}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Reference Number</label>
                    <input
                      type="text"
                      value={txnReference}
                      onChange={(e) => setTxnReference(e.target.value)}
                      placeholder="e.g. INV-2026-0042"
                      disabled={!canPostTransactions}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Ledger Currency</label>
                    <select
                      value={txnCurrency}
                      onChange={(e) => setTxnCurrency(e.target.value)}
                      disabled={!canPostTransactions}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                    >
                      {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} — {c.name} ({c.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Ledger Entries */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">Multi-Document Ledger Entries</label>
                    {canPostTransactions && (
                      <button
                        type="button"
                        onClick={handleAddEntry}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        + Add Entry Leg
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {entries.map((entry, idx) => {
                      const curObj = SUPPORTED_CURRENCIES[txnCurrency] || SUPPORTED_CURRENCIES.USD;
                      return (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <select
                            value={entry.accountId}
                            onChange={(e) => {
                              const copy = [...entries];
                              copy[idx].accountId = e.target.value;
                              setEntries(copy);
                            }}
                            disabled={!canPostTransactions}
                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                          >
                            <option value="">Select Account...</option>
                            {accounts.map(acc => (
                              <option key={acc.id || acc.accountId} value={acc.accountId || acc.id}>
                                {acc.accountId} — {acc.accountName} ({acc.type})
                              </option>
                            ))}
                          </select>

                          <select
                            value={entry.type}
                            onChange={(e) => {
                              const copy = [...entries];
                              copy[idx].type = e.target.value;
                              setEntries(copy);
                            }}
                            disabled={!canPostTransactions}
                            className={`w-28 px-3 py-2 border rounded-lg text-xs font-bold ${
                              entry.type === 'DEBIT' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            <option value="DEBIT">DEBIT</option>
                            <option value="CREDIT">CREDIT</option>
                          </select>

                          <div className="relative w-36">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">{curObj.symbol}</span>
                            <input
                              type="number"
                              step="0.01"
                              required
                              placeholder="0.00"
                            value={entry.amount}
                            onChange={(e) => {
                              const copy = [...entries];
                              copy[idx].amount = e.target.value;
                              setEntries(copy);
                            }}
                            disabled={!canPostTransactions}
                            className="w-full pl-7 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900"
                          />
                        </div>

                        {entries.length > 2 && canPostTransactions && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEntry(idx)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      );
                    })}
                  </div>
                </div>

                {/* Balance validation bar */}
                <div className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                  isBalanced ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  <div className="space-x-4">
                    <span>Total Debits: <strong>${totalDebits.toFixed(2)}</strong></span>
                    <span>Total Credits: <strong>${totalCredits.toFixed(2)}</strong></span>
                  </div>
                  <div>
                    {isBalanced ? (
                      <span className="flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" /> Balanced & Valid
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-700">
                        <AlertCircle className="w-4 h-4" /> Difference: ${(Math.abs(totalDebits - totalCredits)).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!canPostTransactions || !isBalanced}
                  className="w-full py-3 bg-black hover:bg-gray-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  Post to Immutable Ledger
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: CHART OF ACCOUNTS */}
          {activeTab === 'accounts' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-950">Chart of Accounts</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Categorized financial ledgers tracking Assets, Liabilities, Equity, Revenue, and Expenses.</p>
                </div>
              </div>

              {/* Create Account Form (Admin Only) */}
              {canManageAccounts ? (
                <form onSubmit={handleCreateAccount} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                  <div className="font-bold text-xs text-gray-800 uppercase tracking-wider">Create New Account (Admin Only)</div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Account Name (e.g. Stripe Clearing)"
                      value={newAccName}
                      onChange={(e) => setNewAccName(e.target.value)}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                    <select
                      value={newAccType}
                      onChange={(e) => setNewAccType(e.target.value)}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                    >
                      <option value="ASSET">ASSET</option>
                      <option value="LIABILITY">LIABILITY</option>
                      <option value="EQUITY">EQUITY</option>
                      <option value="REVENUE">REVENUE</option>
                      <option value="EXPENSE">EXPENSE</option>
                    </select>
                    <select
                      value={newAccCat}
                      onChange={(e) => setNewAccCat(e.target.value)}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                    >
                      <option value="CURRENT_ASSET">CURRENT_ASSET</option>
                      <option value="NON_CURRENT_ASSET">NON_CURRENT_ASSET</option>
                      <option value="CURRENT_LIABILITY">CURRENT_LIABILITY</option>
                      <option value="OPERATING_REVENUE">OPERATING_REVENUE</option>
                      <option value="OPERATING_EXPENSE">OPERATING_EXPENSE</option>
                      <option value="EQUITY">EQUITY</option>
                    </select>
                    <select
                      value={newAccCur}
                      onChange={(e) => setNewAccCur(e.target.value)}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                    >
                      {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.symbol})
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="bg-black hover:bg-gray-800 text-white text-xs font-semibold rounded-xl py-2 shadow-xs"
                    >
                      Add Account
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-3 bg-gray-100 rounded-xl text-xs text-gray-500 font-medium">
                  Note: Chart of Accounts creation is restricted to <strong>ADMIN</strong> role.
                </div>
              )}

              {/* Accounts Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-100 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Account ID</th>
                      <th className="py-3 px-4">Account Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4 text-right">Current Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {accounts.map((acc) => {
                      const curObj = SUPPORTED_CURRENCIES[acc.currency] || SUPPORTED_CURRENCIES.USD;
                      return (
                        <tr key={acc.id || acc.accountId} className="hover:bg-gray-50/80">
                          <td className="py-3.5 px-4 font-mono font-medium text-gray-700">{acc.accountId}</td>
                          <td className="py-3.5 px-4 font-bold text-gray-900">{acc.accountName}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800">
                              {acc.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-gray-500">{acc.category}</td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-900">
                            {curObj.symbol}{(acc.balance || 0).toLocaleString('en-US', { minimumFractionDigits: curObj.decimals ?? 2, maximumFractionDigits: curObj.decimals ?? 2 })} {acc.currency}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-gray-950">Financial Statements & Reports</h1>
                <p className="text-xs text-gray-500 mt-0.5">Automated Profit & Loss (Income Statement) and Balance Sheet aggregated via MongoDB.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* P&L Statement */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" /> Profit & Loss Statement
                    </h3>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {currency.code} ({currency.symbol})
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 font-semibold text-gray-700">
                      <span>Total Operating Revenue:</span>
                      <span className="text-emerald-600 font-bold">{format(pnl?.totalRevenue || 0)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 font-semibold text-gray-700">
                      <span>Total Operating Expenses:</span>
                      <span className="text-rose-600 font-bold">({format(pnl?.totalExpense || 0)})</span>
                    </div>
                    <div className="flex justify-between py-3 border-t-2 border-gray-900 font-black text-sm text-gray-950">
                      <span>Net Operating Income:</span>
                      <span className={pnl?.netIncome >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                        {format(pnl?.netIncome || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Balance Sheet Statement */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-blue-600" /> Balance Sheet Equation
                    </h3>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Assets = Liab + Equity ({currency.code})
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 font-semibold text-gray-700">
                      <span>Total Assets:</span>
                      <span className="font-bold text-gray-950">{format(balanceSheet?.totalAssets || 0)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 font-semibold text-gray-700">
                      <span>Total Liabilities:</span>
                      <span className="font-bold text-gray-950">{format(balanceSheet?.totalLiabilities || 0)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 font-semibold text-gray-700">
                      <span>Total Equity:</span>
                      <span className="font-bold text-gray-950">{format(balanceSheet?.totalEquity || 0)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-t-2 border-gray-900 font-black text-sm text-gray-950">
                      <span>Liabilities + Equity:</span>
                      <span className="text-blue-600 font-bold">
                        {format((balanceSheet?.totalLiabilities || 0) + (balanceSheet?.totalEquity || 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: INVOICES */}
          {activeTab === 'invoices' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-gray-950">Invoices & Billing</h1>
                <p className="text-xs text-gray-500 mt-0.5">Automated invoice status tracking and PDF invoice generation.</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-100 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { num: 'INV-2026-001', client: 'Acme Corp', due: '2026-09-15', amt: 4500.00, status: 'PAID' },
                      { num: 'INV-2026-002', client: 'Stripe Partners', due: '2026-09-20', amt: 7200.00, status: 'PAID' },
                      { num: 'INV-2026-003', client: 'Global Cloud Inc', due: '2026-09-28', amt: 1250.00, status: 'PENDING' },
                      { num: 'INV-2026-004', client: 'Venture Capital Labs', due: '2026-10-05', amt: 18000.00, status: 'PENDING' }
                    ].map((inv) => (
                      <tr key={inv.num} className="hover:bg-gray-50/80">
                        <td className="py-3.5 px-4 font-mono font-medium text-gray-800">{inv.num}</td>
                        <td className="py-3.5 px-4 font-bold text-gray-900">{inv.client}</td>
                        <td className="py-3.5 px-4 text-gray-500">{inv.due}</td>
                        <td className="py-3.5 px-4 font-bold text-gray-900">${inv.amt.toFixed(2)} USD</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
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

          {/* TAB 7: CSV BULK IMPORT */}
          {activeTab === 'import' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-950">CSV Bulk Bank Feed Import</h1>
                <p className="text-xs text-gray-500 mt-0.5">Stream hundreds of bank transactions directly into the double-entry ledger.</p>
              </div>

              {!canImportCsv && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-xs">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="font-bold">Access Restricted:</span> Your current role ({userRole}) cannot perform bulk CSV imports.
                  </div>
                </div>
              )}

              <form onSubmit={handleCsvImport} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
                <div className="border-2 border-dashed border-gray-200 hover:border-black rounded-2xl p-8 text-center transition-colors">
                  <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <div className="text-xs font-semibold text-gray-700 mb-1">
                    {csvFile ? csvFile.name : 'Select or drag & drop CSV transaction file'}
                  </div>
                  <p className="text-[11px] text-gray-400 mb-4">Accepts Apache Commons CSV format with balanced debit & credit rows.</p>
                  
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files[0])}
                    disabled={!canImportCsv || importing}
                    className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!csvFile || !canImportCsv || importing}
                  className="w-full py-3 bg-black hover:bg-gray-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {importing ? 'Streaming & Validating CSV...' : 'Start Streaming Import'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
