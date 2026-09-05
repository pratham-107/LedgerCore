import React from 'react';
import { UserX, Cpu, Unlock, ShieldCheck } from 'lucide-react';
import { BeanOutline } from './FloatingBean';

export default function PrivacySection() {
  return (
    <section className="py-24 bg-white border-t border-gray-100 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Badge & Title */}
        <div className="max-w-2xl mb-14">
          <span className="text-blue-700 text-xs font-semibold uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/50 inline-block mb-3">
            Privacy
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mb-4">
            Your finances. Your data.<br />No one will follow you.
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            You own your data. When you connect your Notion to Magic Beans your data remains there. We don't store any financial or personal information about you.
          </p>
        </div>

        {/* 4 Privacy Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Card 1 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500">
              <UserX className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Anonymous</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              We don't store personal or financial information about you.
            </p>
          </div>

          {/* Card 2 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Headless</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              We use Notion API to fetch your data. Never store a single bit.
            </p>
          </div>

          {/* Card 3 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
              <Unlock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">No Lock-In</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your data is and always be in Notion. Use MB to get super powers.
            </p>
          </div>

          {/* Card 4 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Secure</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your data and credentials are never shared with us nor any third-party.
            </p>
          </div>
        </div>

        {/* Decorative subtle blue doodle beans on bottom-right */}
        <div className="flex justify-end gap-2 mt-8 opacity-70">
          <div className="w-4 h-2.5 rounded-full bg-blue-300"></div>
          <div className="w-5 h-3 rounded-full bg-blue-400 rotate-12"></div>
          <div className="w-6 h-3.5 rounded-full bg-blue-500 -rotate-12"></div>
        </div>
      </div>
    </section>
  );
}
