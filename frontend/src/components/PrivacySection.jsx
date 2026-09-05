import React from 'react';
import { motion } from 'framer-motion';
import { UserX, Cpu, ShieldCheck, Lock } from 'lucide-react';

export default function PrivacySection() {
  const cards = [
    {
      icon: UserX,
      bg: 'bg-blue-50 border-blue-100 text-blue-600',
      title: 'Role-Based Access',
      desc: 'Granular access control enforcing ADMIN, ACCOUNTANT, and VIEWER permissions.'
    },
    {
      icon: Cpu,
      bg: 'bg-sky-50 border-sky-100 text-sky-600',
      title: 'ACID Transactions',
      desc: 'Multi-document MongoDB transactions prevent partial writes and corrupted ledgers.'
    },
    {
      icon: Lock,
      bg: 'bg-indigo-50 border-indigo-100 text-indigo-600',
      title: 'Optimistic Locking',
      desc: 'Document versioning prevents lost updates during high-throughput concurrent postings.'
    },
    {
      icon: ShieldCheck,
      bg: 'bg-emerald-50 border-emerald-100 text-emerald-600',
      title: 'Rate Limiting',
      desc: 'Redis-backed token bucket algorithm guards against brute force and denial of service.'
    }
  ];

  return (
    <section id="security" className="py-24 bg-white border-t border-gray-100 relative overflow-hidden text-left">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Badge & Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14"
        >
          <span className="text-blue-700 text-xs font-semibold uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/50 inline-block mb-3">
            Security & Privacy
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mb-4">
            Your finances. Your data.<br />Protected by enterprise security.
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            You own your financial data. LedgerCore provides robust BCrypt hashing, JWT RBAC authorization, and isolated MongoDB transactions.
          </p>
        </motion.div>

        {/* 4 Privacy Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="space-y-3 p-3 rounded-2xl hover:bg-gray-50/70 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${card.bg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">{card.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
