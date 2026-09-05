import React from 'react';
import { Layers, ArrowUpRight, LogIn, UserPlus, LogOut, ShieldCheck, Building2, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenApp }) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3 h-3" /> ADMIN
          </span>
        );
      case 'ACCOUNTANT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Building2 className="w-3 h-3" /> ACCOUNTANT
          </span>
        );
      case 'VIEWER':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <UserCheck className="w-3 h-3" /> VIEWER
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-800 border border-gray-200">
            <Shield className="w-3 h-3" /> {role || 'USER'}
          </span>
        );
    }
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      {/* Top enterprise badge banner */}
      <div className="w-full bg-gray-950 text-white text-[13px] py-2 text-center font-medium tracking-tight flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>LedgerCore v1.0 — Enterprise Double-Entry Bookkeeping & Financial Engine</span>
      </div>

      {/* Main navigation */}
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-950">LedgerCore</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-[14px] text-gray-600 font-medium">
          <a href="#features" className="hover:text-black transition-colors hidden md:block">Features</a>
          <a href="#invoices" className="hover:text-black transition-colors hidden md:block">Invoices</a>
          <a href="#finances" className="hover:text-black transition-colors hidden md:block">Finances</a>
          <a href="#security" className="hover:text-black transition-colors hidden md:block">Security</a>
          <a 
            href="http://localhost:8080/swagger-ui.html" 
            target="_blank" 
            rel="noreferrer"
            className="hover:text-black transition-colors flex items-center gap-0.5 hidden sm:flex"
          >
            API Docs <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
          </a>

          {/* Auth Controls */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
              {/* User badge */}
              <div className="flex items-center gap-2">
                {getRoleBadge(user?.role)}
                <span className="text-xs font-medium text-gray-700 hidden lg:inline truncate max-w-[140px]" title={user?.email}>
                  {user?.email}
                </span>
              </div>

              {/* Open Dashboard button */}
              <button
                onClick={onOpenApp}
                className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3.5 py-2 rounded-full transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </button>

              {/* Logout button */}
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
              <button
                onClick={() => openAuthModal('login')}
                className="text-gray-700 hover:text-black text-xs font-semibold px-3 py-2 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-gray-500" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => openAuthModal('register')}
                className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3.5 py-2 rounded-full transition-all shadow-sm flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
