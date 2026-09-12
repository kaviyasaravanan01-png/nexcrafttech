"use client";

import Image from "next/image";
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
    <div className="invoice-root min-h-screen bg-[#09090b] text-[#fafafa] px-4 py-10 sm:px-6 md:py-14 print:bg-white print:text-black print:py-0 print:px-0">
      <div className="invoice-no-print mx-auto mb-8 flex max-w-[880px] flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-[#a1a1aa]">
          Private invoice — use Print / Save as PDF to send to your client.
        </p>
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-full border border-[#c9a96e]/40 bg-[#c9a96e]/10 px-6 py-3 text-sm font-medium text-[#e8d5b0] transition hover:bg-[#c9a96e]/20"
        >
          Print / Save PDF
        </button>
      </div>

      <article
        className="invoice-sheet mx-auto max-w-[880px] overflow-hidden rounded-2xl border border-white/10 bg-[#111114] shadow-2xl print:max-w-none print:rounded-none print:border-0 print:shadow-none print:bg-white"
      >
        {/* Header */}
        <header className="border-b border-white/10 px-8 py-10 sm:px-10 sm:py-12 print:border-black/10 print:bg-white">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              <div className="flex shrink-0 items-center justify-center">
                <Image
                  src="/nct-logo.svg"
                  alt="NexCraft Technologies"
                  width={88}
                  height={88}
                  className="h-[88px] w-[88px] rounded-full print:h-20 print:w-20"
                  priority
                />
              </div>
              <div className="min-w-0 space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a96e] print:text-[#8b6914]">
                    Tax Invoice
                  </p>
                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-[1.75rem] print:text-black">
                    {invoice.from.businessName}
                  </h1>
                </div>
                <div className="space-y-1 text-[15px] leading-relaxed text-[#a1a1aa] print:text-gray-600">
                  {invoice.from.addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <p className="pt-1">{invoice.from.email}</p>
                  <p className="text-[#c9a96e]/80 print:text-gray-700">
                    {invoice.from.website.replace("https://", "")}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="w-full shrink-0 rounded-xl border border-white/10 bg-[#0c0c0e]/80 p-6 sm:max-w-[320px] sm:p-7 print:border-black/15 print:bg-gray-50"
            >
              <p className="text-right text-2xl font-bold tracking-tight text-[#c9a96e] print:text-[#1a1a1a]">
                INVOICE
              </p>
              <dl className="mt-5 space-y-3 text-[15px]">
                <div className="flex items-baseline justify-between gap-6 border-b border-white/5 pb-3 print:border-black/10">
                  <dt className="text-[#71717a] print:text-gray-500">Invoice #</dt>
                  <dd className="font-mono text-right font-semibold">{invoice.number}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 border-b border-white/5 pb-3 print:border-black/10">
                  <dt className="text-[#71717a] print:text-gray-500">Date</dt>
                  <dd className="text-right">{formatDate(invoice.issueDate)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 border-b border-white/5 pb-3 print:border-black/10">
                  <dt className="text-[#71717a] print:text-gray-500">Due date</dt>
                  <dd className="text-right">{formatDate(invoice.dueDate)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 pt-1">
                  <dt className="text-[#71717a] print:text-gray-500">Status</dt>
                  <dd className="font-semibold text-amber-400 print:text-gray-900">{invoice.status}</dd>
                </div>
              </dl>
            </div>
          </div>
        </header>

        {/* Bill to */}
        <section className="border-b border-white/10 px-8 py-10 sm:px-10 print:border-black/10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c9a96e] print:text-gray-700">
            Bill to
          </p>
          <div className="mt-5 max-w-xl space-y-2 text-[15px] leading-relaxed">
            <p className="text-lg font-semibold text-white print:text-black">{invoice.to.businessName}</p>
            {invoice.to.contactLines.map((line) => (
              <p key={line} className="text-[#a1a1aa] print:text-gray-600">{line}</p>
            ))}
            {invoice.to.email && (
              <p className="pt-2 text-[#a1a1aa] print:text-gray-600">{invoice.to.email}</p>
            )}
            {invoice.to.phone && (
              <p className="text-[#a1a1aa] print:text-gray-600">{invoice.to.phone}</p>
            )}
            {invoice.to.projectUrl && (
              <p className="pt-2 break-all text-[#c9a96e] print:text-gray-800">{invoice.to.projectUrl}</p>
            )}
          </div>
        </section>

        {/* Line items */}
        <section className="px-8 py-10 sm:px-10">
          <div className="hidden border-b border-white/10 pb-4 text-[11px] font-semibold uppercase tracking-wider text-[#71717a] sm:grid sm:grid-cols-12 sm:gap-4 print:border-black/20 print:text-gray-600">
            <span className="col-span-7">Description</span>
            <span className="col-span-1 text-right">Qty</span>
            <span className="col-span-2 text-right">Rate</span>
            <span className="col-span-2 text-right">Amount</span>
          </div>

          <div className="divide-y divide-white/10 print:divide-black/10">
            {invoice.lineItems.map((item, i) => (
              <div key={i} className="py-7 first:pt-5 sm:py-8">
                <div className="sm:grid sm:grid-cols-12 sm:items-start sm:gap-4">
                  <div className="col-span-7 min-w-0 pr-2">
                    <p className="text-[15px] font-semibold leading-snug text-white print:text-black">
                      {item.description}
                    </p>
                    {item.details && (
                      <p className="mt-3 text-sm leading-relaxed text-[#a1a1aa] print:text-gray-600">
                        {item.details}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-6 border-t border-white/5 pt-4 sm:col-span-5 sm:mt-0 sm:grid sm:grid-cols-5 sm:gap-4 sm:border-0 sm:pt-2 print:border-black/10">
                    <div className="sm:col-span-1 sm:text-right">
                      <span className="text-xs uppercase text-[#71717a] sm:hidden print:text-gray-500">Qty </span>
                      <span className="tabular-nums text-[15px] font-medium">{item.qty}</span>
                    </div>
                    <div className="sm:col-span-2 sm:text-right">
                      <span className="text-xs uppercase text-[#71717a] sm:hidden print:text-gray-500">Rate </span>
                      <span className="tabular-nums text-[15px]">{formatInr(item.rate)}</span>
                    </div>
                    <div className="sm:col-span-2 sm:text-right">
                      <span className="text-xs uppercase text-[#71717a] sm:hidden print:text-gray-500">Amount </span>
                      <span className="tabular-nums text-[15px] font-semibold">
                        {formatInr(item.qty * item.rate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-end border-t border-white/10 pt-8 print:border-black/15">
            <dl className="w-full max-w-sm space-y-4 text-[15px]">
              <div className="flex justify-between gap-8">
                <dt className="text-[#a1a1aa] print:text-gray-600">Subtotal</dt>
                <dd className="tabular-nums font-medium">{formatInr(subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-8">
                <dt className="text-[#a1a1aa] print:text-gray-600">{invoice.taxLabel}</dt>
                <dd className="tabular-nums font-medium">{formatInr(tax)}</dd>
              </div>
              <div className="flex justify-between gap-8 border-t-2 border-[#c9a96e]/40 pt-5 text-lg print:border-black/25">
                <dt className="font-bold">Total due</dt>
                <dd className="text-2xl font-bold tabular-nums text-[#c9a96e] print:text-black">
                  {formatInr(total)}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Payment & notes */}
        <section className="grid gap-10 border-t border-white/10 bg-[#0c0c0e] px-8 py-10 sm:grid-cols-2 sm:gap-12 sm:px-10 sm:py-12 print:border-black/10 print:bg-gray-50">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c9a96e] print:text-gray-700">
              Bank transfer (INR)
            </p>
            <dl className="mt-5 space-y-3 text-[15px] leading-relaxed">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                <dt className="min-w-[8.5rem] shrink-0 text-[#71717a] print:text-gray-500">Account name</dt>
                <dd className="font-semibold">{invoice.payment.accountName}</dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                <dt className="min-w-[8.5rem] shrink-0 text-[#71717a] print:text-gray-500">Bank</dt>
                <dd>{invoice.payment.bankName}</dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                <dt className="min-w-[8.5rem] shrink-0 text-[#71717a] print:text-gray-500">Account no.</dt>
                <dd className="font-mono font-medium tracking-wide">{invoice.payment.accountNumber}</dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                <dt className="min-w-[8.5rem] shrink-0 text-[#71717a] print:text-gray-500">IFSC</dt>
                <dd className="font-mono">{invoice.payment.ifsc}</dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                <dt className="min-w-[8.5rem] shrink-0 text-[#71717a] print:text-gray-500">MICR</dt>
                <dd className="font-mono">{invoice.payment.micr}</dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                <dt className="min-w-[8.5rem] shrink-0 text-[#71717a] print:text-gray-500">Payment queries</dt>
                <dd className="break-all">{invoice.payment.email}</dd>
              </div>
            </dl>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c9a96e] print:text-gray-700">
              Notes
            </p>
            <ul className="mt-5 list-disc space-y-3 pl-5 text-[15px] leading-relaxed text-[#a1a1aa] print:text-gray-700">
              {invoice.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="border-t border-white/10 px-8 py-5 text-center text-xs text-[#71717a] sm:px-10 print:border-black/10 print:text-gray-500">
          {invoice.from.businessName} · {invoice.from.website.replace("https://", "")}
        </footer>
      </article>

      <style jsx global>{`
        @media print {
          @page {
            margin: 14mm;
          }
          body {
            background: #fff !important;
          }
          .invoice-no-print {
            display: none !important;
          }
          .invoice-sheet {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
