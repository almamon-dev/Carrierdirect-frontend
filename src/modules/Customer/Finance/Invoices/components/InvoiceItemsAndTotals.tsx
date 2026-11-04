import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface InvoiceItemsAndTotalsProps {
  invoiceData: any;
}

export const InvoiceItemsAndTotals: React.FC<InvoiceItemsAndTotalsProps> = ({ invoiceData }) => {
  const isSubscription = invoiceData.invoice_type === 'subscription' || Boolean(invoiceData.subscription_id);
  const distance = invoiceData.distance || (invoiceData.total_distance_km ? `${invoiceData.total_distance_km} km` : (isSubscription ? '-' : '428 km'));
  const cycleOrDistance = isSubscription ? (invoiceData.billing_period || 'Monthly') : distance;

  const totalAmount = invoiceData.gross_amount_formatted || invoiceData.total_amount_formatted || invoiceData.amount || '€ 120.00';
  const rawTotal = parseFloat(String(totalAmount).replace(/[^0-9.]/g, '')) || 120;
  
  const rawPlatformFee = Number(invoiceData.platform_fee || invoiceData.platform_charge || 0);
  const platformFeeFormatted = invoiceData.platform_fee_formatted || invoiceData.platform_charge_formatted || (rawPlatformFee > 0 ? `€ ${rawPlatformFee.toFixed(2)}` : null);
  const platformFeePercent = invoiceData.platform_fee_percent || invoiceData.platform_charge_percent || 10;

  const subtotal = invoiceData.subtotal_formatted || (rawPlatformFee > 0 ? `€ ${(rawTotal - rawPlatformFee).toFixed(2)}` : totalAmount);
  const amountPaid = invoiceData.amount_paid_formatted || invoiceData.amount_paid || (invoiceData.status === 'Paid' ? totalAmount : '€ 0.00');
  const dueAmount = invoiceData.due_amount_formatted || (invoiceData.status === 'Paid' ? '€ 0.00' : totalAmount);

  return (
    <>
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <table className="w-full text-[11px] text-left border-collapse">
          <thead className="bg-[#172B3F] text-white">
            <tr>
              <th className="py-2.5 px-3 w-10 text-center font-medium">#</th>
              <th className="py-2.5 px-3 text-left font-medium">Description</th>
              <th className="py-2.5 px-3 text-center w-24 font-medium">{isSubscription ? 'Billing Cycle' : 'Distance'}</th>
              <th className="py-2.5 px-3 text-center w-16 font-medium">Qty</th>
              <th className="py-2.5 px-3 text-right w-24 font-medium">Unit Price</th>
              <th className="py-2.5 px-3 text-right w-28 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1b2027]">
            {[
              {
                id: 1,
                desc: invoiceData.description || invoiceData.plan_name || invoiceData.service_type || 'Freight Transport Logistics Service',
                route: invoiceData.route || (invoiceData.pickup_city && invoiceData.delivery_city ? `${invoiceData.pickup_city} → ${invoiceData.delivery_city}` : 'Standard priority support & escrow protection included.'),
                qty: invoiceData.quantity || 1,
                unitPrice: subtotal,
                amount: subtotal,
              },
            ].map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3 px-3 text-center text-slate-400 font-semibold">{item.id}</td>
                <td className="py-3 px-3 text-left">
                  <p className="font-bold text-slate-900 dark:text-slate-100">{item.desc}</p>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                    {item.route}
                  </p>
                </td>
                <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400 font-medium">
                  {cycleOrDistance}
                </td>
                <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400 font-semibold">
                  {item.qty}
                </td>
                <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400">{item.unitPrice}</td>
                <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                  {item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-full sm:w-72 space-y-1.5 text-[11px] bg-slate-50/60 dark:bg-slate-800/40 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subtotal:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {subtotal}
            </span>
          </div>
          {(rawPlatformFee > 0 || platformFeeFormatted) && (
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Platform Charge ({platformFeePercent}%):</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {platformFeeFormatted || `€ ${rawPlatformFee.toFixed(2)}`}
              </span>
            </div>
          )}
          {Number(invoiceData.tax_amount || 0) > 0 && (
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Tax / VAT:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {invoiceData.tax_amount_formatted || `€ ${Number(invoiceData.tax_amount).toFixed(2)}`}
              </span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Total Amount:</span>
            <span className="text-base font-extrabold text-[#FF5A1F]">
              {totalAmount}
            </span>
          </div>
          <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
            <span>Amount Paid:</span>
            <span>{amountPaid}</span>
          </div>
          <div className="flex justify-between text-slate-700 dark:text-slate-300 font-bold border-t border-slate-200/60 dark:border-slate-700/60 pt-1">
            <span>Due Amount:</span>
            <span>{dueAmount}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Digitally Signed &amp; Issued by CarrierDirect SaaS Billing Engine</span>
        </div>
        <p className="text-slate-400">Questions? Contact support@carrierdirect.io</p>
      </div>
    </>
  );
};

export default InvoiceItemsAndTotals;
