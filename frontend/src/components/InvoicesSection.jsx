import React, { useState } from "react";
import { Printer, Plus, Sparkles, FileDown, Layers } from "lucide-react";

export default function InvoicesSection() {
  const [selectedInvoice, setSelectedInvoice] = useState("Netflix");

  const invoiceData = {
    Netflix: {
      num: "20220189",
      issue: "22 Jun, 2023",
      due: "22 Jun, 2023",
      to: "Netflix Inc",
      address: "121 Albright Wy, Los Gatos, CA",
      amount: "€11,460.00",
    },
    Figma: {
      num: "20230188",
      issue: "15 Jun, 2023",
      due: "30 Jun, 2023",
      to: "Figma Design",
      address: "768 Market St, San Francisco, CA",
      amount: "€4,200.00",
    },
    Apple: {
      num: "20230187",
      issue: "10 Jun, 2023",
      due: "25 Jun, 2023",
      to: "Apple Inc",
      address: "One Apple Park Way, Cupertino, CA",
      amount: "€8,500.00",
    },
  };

  const curr = invoiceData[selectedInvoice] || invoiceData.Netflix;

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Badge & Title */}
        <div className="max-w-2xl mb-14">
          <span className="text-emerald-700 text-xs font-semibold uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50 inline-block mb-3">
            Invoices
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mb-4">
            Beautiful invoices using
            <br />
            your Notion data
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Your projects and clients are already on Notion, you can now turn
            that data into a beautifully designed invoice you will be proud to
            send.
          </p>
        </div>

        {/* Split Preview Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#faf9f7] p-4 md:p-8 rounded-2xl border border-gray-200/80 shadow-sm mb-16">
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

              {/* Invoice Head */}
              <div className="mt-6 mb-8 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                    invoice
                  </h3>
                  <div className="text-xs font-mono text-gray-400 mt-1">
                    {curr.num}
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-gray-400">Issue Date</div>
                  <div className="font-medium text-gray-900 mb-2">
                    {curr.issue}
                  </div>
                  <div className="text-gray-400">Due Date</div>
                  <div className="font-medium text-gray-900">{curr.due}</div>
                </div>
              </div>

              {/* From / To */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-gray-400 mb-1">From</div>
                  <div className="font-semibold text-gray-900">
                    Reboot Studio
                  </div>
                  <div className="text-gray-500">hey@reboot.studio</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">To</div>
                  <div className="font-semibold text-gray-900">{curr.to}</div>
                  <div className="text-gray-500">{curr.address}</div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="pt-6 border-t border-gray-100 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Total Due</span>
              <span className="text-xl font-bold text-gray-950 font-mono">
                {curr.amount}
              </span>
            </div>
          </div>

          {/* Right: Notion Database Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-xs shadow-sm flex flex-col justify-between">
            <div>
              {/* Window mini top */}
              <div className="p-3 bg-[#f7f6f3] border-b border-gray-200 flex items-center justify-between">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <span>✈️</span> Invoices
                </span>
                <span className="text-[11px] text-gray-400">
                  Notion Database
                </span>
              </div>

              {/* Table */}
              <table className="w-full text-left">
                <thead className="bg-[#faf9f7] border-b border-gray-200 text-gray-500 text-[11px]">
                  <tr>
                    <th className="p-2.5 font-medium">Client</th>
                    <th className="p-2.5 font-medium">Aa Invoice Reference</th>
                    <th className="p-2.5 font-medium"># Number</th>
                    <th className="p-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    {
                      client: "Netflix",
                      ref: "New Invoice",
                      num: "20220189",
                      status: "Draft",
                      color: "bg-gray-100 text-gray-700",
                    },
                    {
                      client: "Figma",
                      ref: "Config 2023",
                      num: "20230188",
                      status: "Sent",
                      color: "bg-blue-100 text-blue-700",
                    },
                    {
                      client: "Apple",
                      ref: "Vision Pro Site",
                      num: "20230187",
                      status: "Sent",
                      color: "bg-blue-100 text-blue-700",
                    },
                    {
                      client: "Twitter",
                      ref: "Search Refactoring",
                      num: "20230186",
                      status: "Sent",
                      color: "bg-blue-100 text-blue-700",
                    },
                    {
                      client: "Spotify",
                      ref: "New Music Player",
                      num: "20230185",
                      status: "Paid",
                      color: "bg-emerald-100 text-emerald-700",
                    },
                    {
                      client: "Airtable",
                      ref: "New Product Site",
                      num: "20230184",
                      status: "Paid",
                      color: "bg-emerald-100 text-emerald-700",
                    },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      onClick={() => setSelectedInvoice(row.client)}
                      className={`cursor-pointer transition-colors ${selectedInvoice === row.client ? "bg-amber-50/70 font-medium" : "hover:bg-gray-50"}`}
                    >
                      <td className="p-2.5 font-semibold text-gray-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                        {row.client}
                      </td>
                      <td className="p-2.5 text-gray-600">{row.ref}</td>
                      <td className="p-2.5 font-mono text-gray-500">
                        {row.num}
                      </td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${row.color}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-[#faf9f7] border-t border-gray-200 text-[11px] text-gray-500 flex justify-between">
              <span>Click a row to preview invoice</span>
              <span className="font-medium text-gray-700">+ New</span>
            </div>
          </div>
        </div>

        {/* 3 Feature Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0 text-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-gray-900 text-sm">
                  Custom templates
                </h4>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                  SOON
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Match your brand identity using one of our ready-to-use
                templates.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0 text-blue-600">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">
                PDF export
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Export your Notion invoices to a professional PDF files.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0 text-amber-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">
                Custom status
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Create your own workflow to organize your invoices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
