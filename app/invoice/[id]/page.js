import { notFound } from "next/navigation";
import { getAllInvoiceIds, getInvoiceById } from "@/lib/invoicesData";
import InvoiceView from "./InvoiceView";

export function generateStaticParams() {
  return getAllInvoiceIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const invoice = getInvoiceById(id);
  if (!invoice) return { title: "Invoice not found" };
  return {
    title: `Invoice ${invoice.number}`,
    robots: { index: false, follow: false },
  };
}

export default async function InvoicePage({ params }) {
  const { id } = await params;
  const invoice = getInvoiceById(id);
  if (!invoice) notFound();
  return <InvoiceView invoice={invoice} />;
}
