import { InvoiceItem } from "../types";

export function mapSubscriptionInvoices(items: any[]): InvoiceItem[] {
  return items.map((inv: any) => {
    const dateStr = inv.billing_date || inv.payment_date || inv.date || (inv.created_at ? new Date(inv.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—");
    const formattedDateName = inv.created_at ? new Date(inv.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "2-digit" }) : "Invoice";
    return {
      id: inv.invoice_number || `SUB-${String(inv.id).padStart(5, "0")}`,
      date: dateStr,
      details: inv.plan_name ? `${inv.plan_name} (${inv.billing_cycle || inv.billing_period || "Monthly"})` : (inv.description || "Carrier Direct Subscription"),
      amount: (() => {
        if (inv.amount_formatted) return inv.amount_formatted;
        if (inv.total_amount_formatted) return inv.total_amount_formatted;
        const raw = String(inv.total_amount ?? inv.amount ?? inv.amount_raw ?? 0).replace(/[^0-9.-]/g, "");
        const num = parseFloat(raw);
        return `€${(isNaN(num) ? 0 : num).toFixed(2)} EUR`;
      })(),
      status: inv.status || "Paid",
      raw_status: inv.raw_status || inv.status || "paid",
      card_brand: inv.card_brand || "VISA",
      card_last4: inv.card_last4 || "4242",
      downloadText: `Invoice ${formattedDateName}`,
      rawInvoice: inv,
    };
  });
}
