/** Client invoices — add new entries here; share /invoice/[id] privately (not in sitemap). */

const invoices = {
  "orion-metal-2026-001": {
    id: "orion-metal-2026-001",
    number: "NCT-INV-2026-077",
    issueDate: "2026-09-12",
    dueDate: "2026-09-26",
    currency: "INR",
    taxLabel: "Tax (0%)",
    taxRate: 0,
    status: "Unpaid",
    from: {
      businessName: "NexCraft Technologies",
      contactName: "Kaviya",
      addressLines: ["Chennai, Tamil Nadu", "India"],
      email: "nexcrafttech@gmail.com",
      website: "https://nexcrafttech.com",
    },
    to: {
      businessName: "Orion Metal Industries Pty Ltd",
      contactLines: [
        "1A Bibby Ct, Moorabbin VIC 3189",
        "Australia",
      ],
      email: "info@orionmetalindustries.com.au",
      phone: "0402 208 011",
      projectUrl: "https://orionmetalindustries.com.au/",
    },
    lineItems: [
      {
        description: "Website development — Orion Metal Industries corporate website",
        details:
          "Next.js marketing site: services, products, projects, blog, contact with file uploads, SEO, Supabase content layer, deployment on orionmetalindustries.com.au",
        qty: 1,
        rate: 15000,
      },
      {
        description: "Domain & email service",
        details: "Custom .com.au domain setup and business email configuration",
        qty: 1,
        rate: 4100,
      },
    ],
    notes: [
      "Thank you for your business.",
      "Please mention invoice number NCT-INV-2026-077 in the payment reference / NEFT remarks.",
    ],
    payment: {
      accountName: "Kaviya",
      bankName: "Bank of India",
      accountNumber: "837910110004549",
      ifsc: "BKID0008379",
      micr: "605013005",
      email: "anandanathurelangovan94@gmail.com",
    },
  },
};

export function getAllInvoiceIds() {
  return Object.keys(invoices);
}

export function getInvoiceById(id) {
  return invoices[id] || null;
}

export function getInvoiceTotals(invoice) {
  const subtotal = invoice.lineItems.reduce(
    (sum, item) => sum + item.qty * item.rate,
    0
  );
  const tax = Math.round(subtotal * (invoice.taxRate || 0));
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

export function formatInr(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default invoices;
