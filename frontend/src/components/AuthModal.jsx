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
  KeyRound,
  ArrowRight,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ADMIN_PASSCODE = 'LEDGERCORE-ADMIN-2026';

export default function AuthModal({ onAuthSuccess }) {
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
  const [role, setRole] = useState('ACCOUNTANT');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    try {
      if (authModalTab === 'login') {
        await login(email, password);
        if (onAuthSuccess) onAuthSuccess();
      } else {
        // Validation for Admin role creation
        if (role === 'ADMIN') {
          if (adminPasscode.trim() !== ADMIN_PASSCODE) {
            setFormError(`Unauthorized Admin Registration: Invalid Admin Security Passcode. Default master key is: ${ADMIN_PASSCODE}`);
            return;
          }
        }

        // Password complexity check
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/]).{8,}$/;
        if (!passwordRegex.test(password)) {
          setFormError('Password must be 8+ chars and contain uppercase, lowercase, number, and special symbol.');
          return;
        }

        await register(email, password, role);
        if (onAuthSuccess) onAuthSuccess();
      }
    } catch (err) {
      setFormError(err.message || 'Authentication failed. Please verify your backend server.');
    }
  };

  const handleQuickDemoLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    login(demoEmail, demoPass)
      .then(() => {
        if (onAuthSuccess) onAuthSuccess();
      })
      .catch((err) => {
        setFormError(err.message || 'Demo login failed. Make sure backend is running on port 8080.');
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
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-gray-950 flex items-center justify-center font-bold shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight">LedgerCore</span>
          </div>
          <p className="text-xs text-gray-400">
            {authModalTab === 'login' 
              ? 'Sign in to access your organization financial ledger.' 
              : 'Create a new user account with role-based access control.'}
          </p>

          {/* Tab Switcher */}
          <div className="flex bg-gray-900/80 p-1 rounded-xl mt-4 border border-gray-800">
            <button
              type="button"
              onClick={() => { setAuthModalTab('login'); setFormError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                authModalTab === 'login' 
                  ? 'bg-white text-gray-950 shadow-xs' 
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
                  ? 'bg-white text-gray-950 shadow-xs' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {/* Error Alert */}
          {(formError || authError) && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError || authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
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
                  className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
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
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Select User Role & Priority Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ACCOUNTANT', label: 'Accountant', desc: 'Post ledger entries & invoices', icon: Building2 },
                    { id: 'VIEWER', label: 'Viewer', desc: 'Read-only financial statements', icon: UserCheck },
                    { id: 'ADMIN', label: 'Administrator', desc: 'Full chart & user management', icon: ShieldCheck }
                  ].map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={`p-2.5 text-left rounded-xl border transition-all ${
                          role === r.id 
                            ? 'border-black bg-gray-950 text-white shadow-xs' 
                            : 'border-gray-200 bg-gray-50 hover:bg-white text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-1 font-bold text-xs mb-0.5">
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span>{r.label}</span>
                        </div>
                        <div className={`text-[10px] leading-tight ${role === r.id ? 'text-gray-300' : 'text-gray-400'}`}>
                          {r.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Admin Passcode Prompt if Administrator is selected */}
                {role === 'ADMIN' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2 animate-fade-in">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                      <KeyRound className="w-4 h-4 text-amber-600" />
                      <span>Admin Passcode Required</span>
                    </div>
                    <p className="text-[11px] text-amber-700 leading-tight">
                      To prevent unauthorized administrator registrations, enter your organization's master authorization key.
                    </p>
                    <input
                      type="password"
                      placeholder={`Enter passcode (Master Key: ${ADMIN_PASSCODE})`}
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{authModalTab === 'login' ? 'Sign In to Workspace' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Collapsible Demo Accounts Testing Panel (For Evaluation / Testing) */}
          {authModalTab === 'login' && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                className="text-xs text-gray-500 hover:text-black flex items-center justify-between w-full font-medium"
              >
                <span className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                  <span>Pre-seeded Evaluation Credentials</span>
                </span>
                <span className="text-[11px] font-bold text-gray-400">{showDemoCredentials ? '▲ Hide' : '▼ Show'}</span>
              </button>

              {showDemoCredentials && (
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2 animate-fade-in">
                  <p className="text-[11px] text-gray-500">
                    Click any pre-seeded credential below to log in directly:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('admin@ledgercore.com', 'SecurePass123!')}
                      className="p-2 bg-white border border-gray-200 hover:border-emerald-500 rounded-lg text-left transition-all"
                    >
                      <div className="text-xs font-bold text-gray-900 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Admin
                      </div>
                      <div className="text-[10px] text-gray-400 truncate">admin@ledgercore.com</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('accountant@ledgercore.com', 'SecurePass123!')}
                      className="p-2 bg-white border border-gray-200 hover:border-blue-500 rounded-lg text-left transition-all"
                    >
                      <div className="text-xs font-bold text-gray-900 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-blue-600" /> Accountant
                      </div>
                      <div className="text-[10px] text-gray-400 truncate">accountant@...</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('viewer@ledgercore.com', 'SecurePass123!')}
                      className="p-2 bg-white border border-gray-200 hover:border-purple-500 rounded-lg text-left transition-all"
                    >
                      <div className="text-xs font-bold text-gray-900 flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-purple-600" /> Viewer
                      </div>
                      <div className="text-[10px] text-gray-400 truncate">viewer@...</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

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
