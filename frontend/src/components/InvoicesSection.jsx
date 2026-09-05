import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Plus, Sparkles, FileDown, Layers, Receipt } from 'lucide-react';

export default function InvoicesSection() {
  const [selectedInvoice, setSelectedInvoice] = useState('Netflix');

  const invoiceData = {
    Netflix: { num: '20220189', issue: '22 Jun, 2023', due: '22 Jun, 2023', to: 'Netflix Inc', address: '121 Albright Wy, Los Gatos, CA', amount: '€11,460.00' },
    Figma: { num: '20230188', issue: '15 Jun, 2023', due: '30 Jun, 2023', to: 'Figma Design', address: '768 Market St, San Francisco, CA', amount: '€4,200.00' },
    Apple: { num: '20230187', issue: '10 Jun, 2023', due: '25 Jun, 2023', to: 'Apple Inc', address: 'One Apple Park Way, Cupertino, CA', amount: '€8,500.00' },
  };

  const curr = invoiceData[selectedInvoice] || invoiceData.Netflix;

  return (
    <section id="invoices" className="py-24 bg-white border-t border-gray-100 text-left">
      <div className="max-w-6xl mx-auto px-6">
        {/* Badge & Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14"
        >
          <span className="text-emerald-700 text-xs font-semibold uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50 inline-block mb-3">
            Invoices
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mb-4">
            Beautiful invoices using<br />your LedgerCore data
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Your clients and ledger entries are synchronized in real-time. Turn financial transactions into beautifully formatted invoices ready to send.
          </p>
        </motion.div>

        {/* Split Preview Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#faf9f7] p-4 md:p-8 rounded-2xl border border-gray-200/80 shadow-sm mb-16"
        >
          {/* Left: Rendered Clean Invoice */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm flex flex-col justify-between min-h-[380px]">
            <div>
              {/* Invoice top actions */}
              <div className="flex items-center justify-between text-xs text-gray-400 pb-6 border-b border-gray-100">
                <span className="flex items-center gap-1.5 cursor-pointer hover:text-gray-700">
                  <Printer className="w-3.5 h-3.5" /> Print
                </span>
                <span className="flex items-center gap-1.5 cursor-pointer hover:text-gray-700">
                  <Plus className="w-3.5 h-3.5" /> New invoice
                </span>
              </div>

              {/* Animated Invoice Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedInvoice}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Invoice Head */}
                  <div className="mt-6 mb-8 flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">invoice</h3>
                      <div className="text-xs font-mono text-gray-400 mt-1">{curr.num}</div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="text-gray-400">Issue Date</div>
                      <div className="font-medium text-gray-900 mb-2">{curr.issue}</div>
                      <div className="text-gray-400">Due Date</div>
                      <div className="font-medium text-gray-900">{curr.due}</div>
                    </div>
                  </div>

                  {/* From / To */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-gray-400 mb-1">From</div>
                      <div className="font-semibold text-gray-900">LedgerCore HQ</div>
                      <div className="text-gray-500">billing@ledgercore.com</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">To</div>
                      <div className="font-semibold text-gray-900">{curr.to}</div>
                      <div className="text-gray-500">{curr.address}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Total */}
            <div className="pt-6 border-t border-gray-100 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Total Due</span>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={curr.amount}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xl font-bold text-gray-950 font-mono"
                >
                  {curr.amount}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Database Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-xs shadow-sm flex flex-col justify-between">
            <div>
              {/* Window mini top */}
              <div className="p-3 bg-[#f7f6f3] border-b border-gray-200 flex items-center justify-between">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-emerald-600" /> Invoices
                </span>
                <span className="text-[11px] text-gray-400 font-mono">Ledger Database</span>
              </div>

              {/* Table */}
              <table className="w-full text-left">
                <thead className="bg-[#faf9f7] border-b border-gray-200 text-gray-500 text-[11px]">
                  <tr>
                    <th className="p-2.5 font-medium">Client</th>
                    <th className="p-2.5 font-medium">Invoice Reference</th>
                    <th className="p-2.5 font-medium">Number</th>
                    <th className="p-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { client: 'Netflix', ref: 'New Invoice', num: '20220189', status: 'Draft', color: 'bg-gray-100 text-gray-700' },
                    { client: 'Figma', ref: 'Config 2023', num: '20230188', status: 'Sent', color: 'bg-blue-100 text-blue-700' },
                    { client: 'Apple', ref: 'Vision Pro Site', num: '20230187', status: 'Sent', color: 'bg-blue-100 text-blue-700' },
                    { client: 'Twitter', ref: 'Search Refactoring', num: '20230186', status: 'Sent', color: 'bg-blue-100 text-blue-700' },
                    { client: 'Spotify', ref: 'New Music Player', num: '20230185', status: 'Paid', color: 'bg-emerald-100 text-emerald-700' },
                    { client: 'Airtable', ref: 'New Product Site', num: '20230184', status: 'Paid', color: 'bg-emerald-100 text-emerald-700' },
                  ].map((row, idx) => (
                    <motion.tr 
                      key={idx}
                      whileHover={{ backgroundColor: "rgba(245, 158, 11, 0.08)" }}
                      onClick={() => setSelectedInvoice(row.client)}
                      className={`cursor-pointer transition-colors ${selectedInvoice === row.client ? 'bg-amber-50/70 font-medium' : ''}`}
                    >
                      <td className="p-2.5 font-semibold text-gray-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                        {row.client}
                      </td>
                      <td className="p-2.5 text-gray-600">{row.ref}</td>
                      <td className="p-2.5 font-mono text-gray-500">{row.num}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${row.color}`}>
                          {row.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-[#faf9f7] border-t border-gray-200 text-[11px] text-gray-500 flex justify-between">
              <span>Click a row to preview invoice</span>
              <span className="font-medium text-gray-700">+ New</span>
            </div>
          </div>
        </motion.div>

        {/* 3 Feature Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Sparkles,
              bg: 'bg-emerald-50 border-emerald-200/60 text-emerald-600',
              title: 'Custom templates',
              tag: 'SOON',
              desc: 'Match your brand identity using one of our ready-to-use professional templates.'
            },
            {
              icon: FileDown,
              bg: 'bg-blue-50 border-blue-200/60 text-blue-600',
              title: 'PDF export',
              desc: 'Export and share your ledger invoices directly as downloadable PDF files.'
            },
            {
              icon: Layers,
              bg: 'bg-amber-50 border-amber-200/60 text-amber-600',
              title: 'Custom status',
              desc: 'Organize billing workflows with custom status tags and automated reminders.'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -3 }}
                className="flex gap-4 items-start p-3 rounded-xl hover:bg-gray-50/80 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${item.bg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                    {item.tag && (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded">{item.tag}</span>
                    )}
                  </div>
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
