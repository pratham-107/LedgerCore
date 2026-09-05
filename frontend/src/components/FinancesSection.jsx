import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Clock, 
  DollarSign, 
  BarChart3, 
  FileSpreadsheet, 
  Flame,
  CreditCard 
} from 'lucide-react';

export default function FinancesSection() {
  return (
    <section id="finances" className="py-24 bg-gradient-to-b from-white to-[#faf9f7] border-t border-gray-100 text-left">
      <div className="max-w-6xl mx-auto px-6">
        {/* Badge & Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14"
        >
          <span className="text-orange-700 text-xs font-semibold uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200/50 inline-block mb-3">
            Finances
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mb-4">
            Simple finances for your<br />business that just works
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Understand your business with auto-generated double-entry accounting reports. Simple, intuitive, and mathematically balanced with zero-sum validation.
          </p>
        </motion.div>

        {/* Split Preview Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-4 md:p-8 rounded-2xl border border-gray-200/80 shadow-sm mb-16"
        >
          {/* Left: Financial Breakdown & Chart */}
          <div className="bg-[#faf9f7] rounded-xl border border-gray-200 p-6 flex flex-col justify-between">
            {/* Chart Area */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Revenue over expense
                </span>
                <span className="text-gray-400">This year</span>
              </div>

              {/* SVG Curve Chart */}
              <div className="w-full h-32 relative">
                <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  <line x1="0" y1="30" x2="400" y2="30" stroke="#edece9" strokeDasharray="3 3" />
                  <line x1="0" y1="70" x2="400" y2="70" stroke="#edece9" strokeDasharray="3 3" />
                  <line x1="0" y1="110" x2="400" y2="110" stroke="#edece9" />

                  {/* Area fill */}
                  <path
                    d="M 0 90 Q 50 100 100 80 T 200 45 T 300 30 T 400 20 L 400 110 L 0 110 Z"
                    fill="url(#chartGradient)"
                  />
                  {/* Revenue Curve with drawing animation */}
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d="M 0 90 Q 50 100 100 80 T 200 45 T 300 30 T 400 20"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                  />
                  {/* Expense Curve with drawing animation */}
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
                    d="M 0 95 Q 50 85 100 90 T 200 80 T 300 70 T 400 65"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                </svg>
                {/* Months axis */}
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                </div>
              </div>
            </div>

            {/* Two Column Splits */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200 text-xs">
              {/* Revenue Split */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-900 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Revenue split
                  </span>
                  <span className="text-[10px] text-gray-400">This year</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { name: 'Apple', pct: 60, barColor: 'bg-black' },
                    { name: 'Twitter', pct: 20, barColor: 'bg-blue-400' },
                    { name: 'Figma', pct: 10, barColor: 'bg-purple-400' },
                    { name: 'Spotify', pct: 5, barColor: 'bg-emerald-400' },
                    { name: 'Airtable', pct: 5, barColor: 'bg-amber-400' },
                    { name: 'Netflix', pct: 5, barColor: 'bg-red-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-600 font-medium truncate w-16">{item.name}</span>
                      <div className="flex-1 mx-2 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.05 }}
                          className={`h-full ${item.barColor} rounded-full`}
                        ></motion.div>
                      </div>
                      <span className="text-gray-900 font-bold font-mono">{item.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expenses Split */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-900 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Expenses split
                  </span>
                  <span className="text-[10px] text-gray-400">This year</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { name: 'Payroll', pct: 50, barColor: 'bg-red-400' },
                    { name: 'Rent', pct: 15, barColor: 'bg-orange-400' },
                    { name: 'Assets', pct: 5, barColor: 'bg-amber-400' },
                    { name: 'Travel', pct: 5, barColor: 'bg-yellow-400' },
                    { name: 'Accounting', pct: 5, barColor: 'bg-gray-400' },
                    { name: 'Software', pct: 1, barColor: 'bg-indigo-400' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-600 font-medium truncate w-16">{item.name}</span>
                      <div className="flex-1 mx-2 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.05 }}
                          className={`h-full ${item.barColor} rounded-full`}
                        ></motion.div>
                      </div>
                      <span className="text-gray-900 font-bold font-mono">{item.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Transactions Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-xs shadow-sm flex flex-col justify-between">
            <div>
              <div className="p-3 bg-[#f7f6f3] border-b border-gray-200 flex items-center justify-between">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-purple-600" /> Transactions
                </span>
                <span className="text-[11px] text-gray-400 font-mono">Ledger Database</span>
              </div>

              <table className="w-full text-left">
                <thead className="bg-[#faf9f7] border-b border-gray-200 text-gray-500 text-[11px]">
                  <tr>
                    <th className="p-2.5 font-medium">Date</th>
                    <th className="p-2.5 font-medium">Transaction</th>
                    <th className="p-2.5 font-medium">Category</th>
                    <th className="p-2.5 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { date: 'June 30, 2023', name: 'Apple Transfer', cat: 'Revenue', catColor: 'bg-blue-50 text-blue-700', amt: '€11,460.00', pos: true },
                    { date: 'June 23, 2023', name: 'Uber Travel', cat: 'Travel', catColor: 'bg-orange-50 text-orange-700', amt: '-€40.00', pos: false },
                    { date: 'June 22, 2023', name: 'Accountant May', cat: 'Accounting', catColor: 'bg-purple-50 text-purple-700', amt: '-€345.00', pos: false },
                    { date: 'June 22, 2023', name: 'Phone Bill', cat: 'Utilities', catColor: 'bg-yellow-50 text-yellow-700', amt: '-€345.00', pos: false },
                    { date: 'June 20, 2023', name: 'Google Workspace', cat: 'Software', catColor: 'bg-indigo-50 text-indigo-700', amt: '-€345.00', pos: false },
                    { date: 'June 20, 2023', name: 'Superhuman Mail', cat: 'Software', catColor: 'bg-indigo-50 text-indigo-700', amt: '-€30.00', pos: false },
                    { date: 'June 19, 2023', name: 'Slack Tech', cat: 'Software', catColor: 'bg-indigo-50 text-indigo-700', amt: '-€80.00', pos: false },
                    { date: 'June 15, 2023', name: 'WeWork Rent', cat: 'Rent', catColor: 'bg-red-50 text-red-700', amt: '-€1,150.00', pos: false },
                    { date: 'June 14, 2023', name: 'Payroll Jon Doe', cat: 'Payroll', catColor: 'bg-rose-50 text-rose-700', amt: '-€5,980.00', pos: false },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="p-2 text-gray-500 text-[11px] whitespace-nowrap">{row.date}</td>
                      <td className="p-2 font-medium text-gray-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        {row.name}
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${row.catColor}`}>
                          {row.cat}
                        </span>
                      </td>
                      <td className={`p-2 text-right font-mono font-bold ${row.pos ? 'text-emerald-600' : 'text-gray-800'}`}>
                        {row.amt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-[#faf9f7] border-t border-gray-200 text-[11px] text-gray-500 flex justify-between font-mono">
              <span>9 Ledger transactions</span>
              <span className="font-bold text-gray-900">Net: +€3,891.00</span>
            </div>
          </div>
        </motion.div>

        {/* 6 Feature Grid items with stagger & hover spring */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Building2,
              bg: 'bg-orange-50 border-orange-200/60 text-orange-600',
              title: 'Bank connection',
              desc: 'Connect your banking feed to get live balance and transaction sync.'
            },
            {
              icon: Clock,
              bg: 'bg-purple-50 border-purple-200/60 text-purple-600',
              title: 'Runway',
              desc: 'Accurately forecast cash runway and make informed decisions.'
            },
            {
              icon: DollarSign,
              bg: 'bg-red-50 border-red-200/60 text-red-600',
              title: 'Updated balance',
              desc: 'Get real-time running balance updates across your entire Chart of Accounts.'
            },
            {
              icon: BarChart3,
              bg: 'bg-blue-50 border-blue-200/60 text-blue-600',
              title: 'Essential reports',
              desc: 'Pre-aggregated MongoDB pipelines for monthly P&L and balance sheets.'
            },
            {
              icon: FileSpreadsheet,
              bg: 'bg-rose-50 border-rose-200/60 text-rose-600',
              title: 'Profit & Loss',
              desc: 'Track gross revenue, operating costs, and margins in real-time.'
            },
            {
              icon: Flame,
              bg: 'bg-amber-50 border-amber-200/60 text-amber-600',
              title: 'Expense tracking',
              desc: 'Categorize and visualize your spending breakdown by department.'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -3 }}
                className="flex gap-4 items-start p-3 rounded-xl hover:bg-gray-50/80 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${item.bg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
