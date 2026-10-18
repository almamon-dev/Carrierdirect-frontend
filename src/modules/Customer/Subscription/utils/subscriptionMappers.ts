import { InvoiceItem, SavedCard } from "../types";

export function mapRawCards(rawPm: any[]): SavedCard[] {
  if (!Array.isArray(rawPm)) return [];
  return rawPm.map((c: any) => ({
    id: String(c.id),
    cardType: c.type === "MC" ? "Credit Card" : (c.type === "AMEX" ? "Amex Card" : "Debit Card"),
    last4: c.last4 || "••••",
    brand: (c.type || "VISA") as "MC" | "VISA" | "AMEX",
    isDefault: Boolean(c.is_primary),
  }));
}

export function mapRawInvoices(items: any[]): InvoiceItem[] {
  if (!Array.isArray(items)) return [];
  return items.map((inv: any) => {
    const dateStr = inv.date || (inv.created_at ? new Date(inv.created_at).toLocaleDateString("en-GB") : "—");
    const formattedDateName = inv.created_at
      ? new Date(inv.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "2-digit" })
      : "Invoice";
    const raw = String(inv.total_amount ?? inv.amount ?? inv.amount_raw ?? 0).replace(/[^0-9.-]/g, "");
    const num = parseFloat(raw);

    return {
      id: inv.invoice_number || `SUB-${String(inv.id).padStart(5, "0")}`,
      date: dateStr,
      details: inv.plan_name ? `${inv.plan_name} (${inv.billing_cycle || "Monthly"})` : (inv.description || "Subscription"),
      amount: inv.amount_formatted || `€${(isNaN(num) ? 0 : num).toFixed(2)} EUR`,
      status: inv.status || "Paid",
      raw_status: inv.raw_status || inv.status || "paid",
      card_brand: inv.card_brand || "VISA",
      card_last4: inv.card_last4 || "4242",
      downloadText: `Invoice ${formattedDateName}`,
      rawInvoice: inv,
    };
  });
}
