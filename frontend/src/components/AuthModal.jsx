import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Layers, 
  UserCheck,
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    authModalTab, 
    setAuthModalTab, 
    closeAuthModal, 
    login, 
    register, 
    loading, 
    error: authError 
  } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    try {
      if (authModalTab === 'login') {
        await login(email, password);
        setSuccessMsg('Successfully logged in!');
      } else {
        // Password validation pattern check for UX
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/]).{8,}$/;
        if (!passwordRegex.test(password)) {
          setFormError('Password must be 8+ chars with uppercase, lowercase, digit & special char.');
          return;
        }
        await register(email, password, role);
        setSuccessMsg(`Account created with ${role} role!`);
      }
    } catch (err) {
      setFormError(err.message || 'Authentication failed. Please check your backend connection.');
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    login(demoEmail, demoPass).catch((err) => {
      setFormError(err.message || 'Demo login failed. Is the backend running on port 8080?');
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gray-950 text-white p-6 pb-5 relative">
          <button 
            onClick={closeAuthModal}
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-gray-950 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight">LedgerCore</span>
          </div>
          <p className="text-xs text-gray-400">
            {authModalTab === 'login' 
              ? 'Sign in to access your financial ledger and real-time accounts.' 
              : 'Create a new user account with role-based access control.'}
          </p>

          {/* Tab Switcher */}
          <div className="flex bg-gray-900/80 p-1 rounded-xl mt-4 border border-gray-800">
            <button
              type="button"
              onClick={() => { setAuthModalTab('login'); setFormError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                authModalTab === 'login' 
                  ? 'bg-white text-gray-950 shadow-sm' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthModalTab('register'); setFormError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                authModalTab === 'register' 
                  ? 'bg-white text-gray-950 shadow-sm' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Create Account (Sign Up)
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {/* Error / Success Alerts */}
          {(formError || authError) && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError || authError}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-700 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Demo Credentials (for Login Tab) */}
          {authModalTab === 'login' && (
            <div className="mb-5 p-3.5 bg-gray-50 border border-gray-200/80 rounded-xl">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>1-Click Demo Accounts</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@ledgercore.com', 'SecurePass123!')}
                  className="flex flex-col items-start p-2 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-xs transition-all text-left"
                >
                  <span className="text-[11px] font-bold text-gray-900 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Admin
                  </span>
                  <span className="text-[10px] text-gray-400 truncate w-full">Full Controls</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('accountant@ledgercore.com', 'SecurePass123!')}
                  className="flex flex-col items-start p-2 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-xs transition-all text-left"
                >
                  <span className="text-[11px] font-bold text-gray-900 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-blue-600" /> Accountant
                  </span>
                  <span className="text-[10px] text-gray-400 truncate w-full">Post Ledger</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('viewer@ledgercore.com', 'SecurePass123!')}
                  className="flex flex-col items-start p-2 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-xs transition-all text-left"
                >
                  <span className="text-[11px] font-bold text-gray-900 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-purple-600" /> Viewer
                  </span>
                  <span className="text-[10px] text-gray-400 truncate w-full">Read-Only</span>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authModalTab === 'register' && (
                <p className="text-[11px] text-gray-400 mt-1">
                  Must be 8+ characters with uppercase, lowercase, digit & symbol (e.g. <code className="bg-gray-100 px-1 py-0.5 rounded">SecurePass123!</code>).
                </p>
              )}
            </div>

            {/* Role Selection (Only in Register Tab) */}
            {authModalTab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Assigned RBAC Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ADMIN', label: 'Admin', desc: 'Full R/W + Manage Accounts' },
                    { id: 'ACCOUNTANT', label: 'Accountant', desc: 'Post Transactions & View Reports' },
                    { id: 'VIEWER', label: 'Viewer', desc: 'Read-Only Financial Statements' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`p-2.5 text-left rounded-xl border transition-all ${
                        role === r.id 
                          ? 'border-black bg-gray-950 text-white shadow-sm' 
                          : 'border-gray-200 bg-gray-50 hover:bg-white text-gray-700'
                      }`}
                    >
                      <div className="font-semibold text-xs">{r.label}</div>
                      <div className={`text-[10px] mt-0.5 leading-tight ${role === r.id ? 'text-gray-300' : 'text-gray-400'}`}>
                        {r.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{authModalTab === 'login' ? 'Sign In to Workspace' : 'Create Ledger Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer toggle */}
          <div className="mt-5 text-center text-xs text-gray-500">
            {authModalTab === 'login' ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthModalTab('register'); setFormError(''); }}
                  className="font-semibold text-black hover:underline"
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthModalTab('login'); setFormError(''); }}
                  className="font-semibold text-black hover:underline"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
