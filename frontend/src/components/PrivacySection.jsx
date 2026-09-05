import React from 'react';
import { UserX, Cpu, Unlock, ShieldCheck, Lock } from 'lucide-react';

export default function PrivacySection() {
  return (
    <section id="security" className="py-24 bg-white border-t border-gray-100 relative overflow-hidden text-left">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Badge & Title */}
        <div className="max-w-2xl mb-14">
          <span className="text-blue-700 text-xs font-semibold uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/50 inline-block mb-3">
            Security & Privacy
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mb-4">
            Your finances. Your data.<br />Protected by enterprise security.
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            You own your financial data. LedgerCore provides robust BCrypt hashing, JWT RBAC authorization, and isolated MongoDB transactions.
          </p>
        </div>

        {/* 4 Privacy Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Card 1 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <UserX className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Role-Based Access</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Granular access control enforcing ADMIN, ACCOUNTANT, and VIEWER permissions.
            </p>
          </div>

          {/* Card 2 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">ACID Transactions</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Multi-document MongoDB transactions prevent partial writes and corrupted ledgers.
            </p>
          </div>

          {/* Card 3 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Optimistic Locking</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Document versioning prevents lost updates during high-throughput concurrent postings.
            </p>
          </div>

          {/* Card 4 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Rate Limiting</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Redis-backed token bucket algorithm guards against brute force and denial of service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
