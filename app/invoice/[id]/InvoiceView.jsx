"use client";

import { getInvoiceTotals, formatInr } from "@/lib/invoicesData";

function formatDate(iso) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function InvoiceView({ invoice }) {
  const { subtotal, tax, total } = getInvoiceTotals(invoice);

  const handlePrint = () => window.print();

  return (
    <div className="invoice-root min-h-screen bg-[#09090b] text-[#fafafa] px-4 py-10 md:py-14 print:bg-white print:text-black print:py-0 print:px-0">
      <div className="invoice-no-print mx-auto mb-6 flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#a1a1aa]">
          Private invoice — use Print / Save as PDF to send to your client.
        </p>
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-full border border-[#c9a96e]/40 bg-[#c9a96e]/10 px-5 py-2.5 text-sm font-medium text-[#e8d5b0] transition hover:bg-[#c9a96e]/20"
        >
          Print / Save PDF
        </button>
      </div>

      <article
        className="invoice-sheet mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#111114] shadow-2xl print:max-w-none print:rounded-none print:border-0 print:shadow-none print:bg-white"
      >
        <header className="border-b border-white/10 bg-gradient-to-br from-[#18181b] to-[#111114] px-8 py-10 print:border-black/10 print:bg-white">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a96e] print:text-[#8b6914]">
                Tax Invoice
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                {invoice.from.businessName}
              </h1>
              {invoice.from.addressLines.map((line) => (
                <p key={line} className="mt-1 text-sm text-[#a1a1aa] print:text-gray-600">
                  {line}
                </p>
              ))}
              <p className="mt-2 text-sm text-[#a1a1aa] print:text-gray-600">
                {invoice.from.email}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-3xl font-bold text-[#c9a96e] print:text-[#1a1a1a]">INVOICE</p>
              <dl className="mt-4 space-y-1 text-sm">
                <div className="flex justify-between gap-8 sm:justify-end">
                  <dt className="text-[#71717a] print:text-gray-500">Invoice #</dt>
                  <dd className="font-mono font-medium">{invoice.number}</dd>
                </div>
                <div className="flex justify-between gap-8 sm:justify-end">
                  <dt className="text-[#71717a] print:text-gray-500">Date</dt>
                  <dd>{formatDate(invoice.issueDate)}</dd>
                </div>
                <div className="flex justify-between gap-8 sm:justify-end">
                  <dt className="text-[#71717a] print:text-gray-500">Due date</dt>
                  <dd>{formatDate(invoice.dueDate)}</dd>
                </div>
                <div className="flex justify-between gap-8 sm:justify-end">
                  <dt className="text-[#71717a] print:text-gray-500">Status</dt>
                  <dd className="font-medium text-amber-400 print:text-gray-800">{invoice.status}</dd>
                </div>
              </dl>
            </div>
          </div>
        </header>

        <div className="grid gap-8 border-b border-white/10 px-8 py-8 sm:grid-cols-2 print:border-black/10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#c9a96e] print:text-gray-700">
              Bill to
            </p>
            <p className="mt-2 font-semibold">{invoice.to.businessName}</p>
            {invoice.to.contactLines.map((line) => (
              <p key={line} className="text-sm text-[#a1a1aa] print:text-gray-600">
                {line}
              </p>
            ))}
            {invoice.to.email && (
              <p className="mt-2 text-sm text-[#a1a1aa] print:text-gray-600">{invoice.to.email}</p>
            )}
            {invoice.to.phone && (
              <p className="text-sm text-[#a1a1aa] print:text-gray-600">{invoice.to.phone}</p>
            )}
            {invoice.to.projectUrl && (
              <p className="mt-2 text-sm text-[#c9a96e] print:text-gray-800 break-all">
                {invoice.to.projectUrl}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#c9a96e] print:text-gray-700">
              Prepared by
            </p>
            <p className="mt-2 font-semibold">{invoice.from.contactName}</p>
            <p className="text-sm text-[#a1a1aa] print:text-gray-600">{invoice.from.businessName}</p>
          </div>
        </div>

        <div className="px-8 py-8">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-[#71717a] print:border-black/20 print:text-gray-600">
                <th className="pb-3 pr-4 font-semibold">Description</th>
                <th className="pb-3 pr-4 text-right font-semibold w-16">Qty</th>
                <th className="pb-3 pr-4 text-right font-semibold w-28">Rate</th>
                <th className="pb-3 text-right font-semibold w-28">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, i) => (
                <tr key={i} className="border-b border-white/5 print:border-black/10">
                  <td className="py-4 pr-4 align-top">
                    <p className="font-medium">{item.description}</p>
                    {item.details && (
                      <p className="mt-1 text-xs leading-relaxed text-[#a1a1aa] print:text-gray-600">
                        {item.details}
                      </p>
                    )}
                  </td>
                  <td className="py-4 pr-4 text-right align-top tabular-nums">{item.qty}</td>
                  <td className="py-4 pr-4 text-right align-top tabular-nums">
                    {formatInr(item.rate)}
                  </td>
                  <td className="py-4 text-right align-top font-medium tabular-nums">
                    {formatInr(item.qty * item.rate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-8 flex justify-end">
            <dl className="w-full max-w-xs space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#a1a1aa] print:text-gray-600">Subtotal</dt>
                <dd className="tabular-nums font-medium">{formatInr(subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#a1a1aa] print:text-gray-600">{invoice.taxLabel}</dt>
                <dd className="tabular-nums font-medium">{formatInr(tax)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-[#c9a96e]/30 pt-3 text-base print:border-black/20">
                <dt className="font-semibold">Total due</dt>
                <dd className="text-xl font-bold text-[#c9a96e] tabular-nums print:text-black">
                  {formatInr(total)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="grid gap-8 border-t border-white/10 bg-[#0c0c0e] px-8 py-8 sm:grid-cols-2 print:border-black/10 print:bg-gray-50">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#c9a96e] print:text-gray-700">
              Bank transfer (INR)
            </p>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div>
                <span className="text-[#71717a] print:text-gray-500">Account name: </span>
                <span className="font-medium">{invoice.payment.accountName}</span>
              </div>
              <div>
                <span className="text-[#71717a] print:text-gray-500">Bank: </span>
                <span>{invoice.payment.bankName}</span>
              </div>
              <div>
                <span className="text-[#71717a] print:text-gray-500">Account no.: </span>
                <span className="font-mono">{invoice.payment.accountNumber}</span>
              </div>
              <div>
                <span className="text-[#71717a] print:text-gray-500">IFSC: </span>
                <span className="font-mono">{invoice.payment.ifsc}</span>
              </div>
              <div>
                <span className="text-[#71717a] print:text-gray-500">MICR: </span>
                <span className="font-mono">{invoice.payment.micr}</span>
              </div>
              <div>
                <span className="text-[#71717a] print:text-gray-500">Payment queries: </span>
                <span>{invoice.payment.email}</span>
              </div>
            </dl>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#c9a96e] print:text-gray-700">
              Notes
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-[#a1a1aa] print:text-gray-700">
              {invoice.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="border-t border-white/10 px-8 py-4 text-center text-xs text-[#71717a] print:border-black/10 print:text-gray-500">
          {invoice.from.businessName} · {invoice.from.website.replace("https://", "")}
        </footer>
      </article>

      <style jsx global>{`
        @media print {
          body {
            background: #fff !important;
          }
          .invoice-no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
