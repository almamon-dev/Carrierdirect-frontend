import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface InvoiceItemsAndTotalsProps {
  invoiceData: any;
}

export const InvoiceItemsAndTotals: React.FC<InvoiceItemsAndTotalsProps> = ({ invoiceData }) => {
  return (
    <>
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-[11px] text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold">
            <tr>
              <th className="py-2 px-2.5 w-8 text-center">#</th>
              <th className="py-2 px-2.5">Item Description</th>
              <th className="py-2 px-2.5 text-center w-14">Qty</th>
              <th className="py-2 px-2.5 text-right w-24">Rate</th>
              <th className="py-2 px-2.5 text-right w-28">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
            {[
              {
                id: 1,
                desc: 'Freight Transport Logistics Service',
                qty: 1,
                rate: invoiceData.amount || invoiceData.total_amount_formatted || '€ 2,136.70',
                amount: invoiceData.amount || invoiceData.total_amount_formatted || '€ 2,136.70',
              },
            ].map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-2.5 px-2.5 text-center text-slate-400 font-semibold">{item.id}</td>
                <td className="py-2.5 px-2.5">
                  <p className="font-bold text-slate-900 dark:text-slate-100">{item.desc}</p>
                  <p className="text-[10px] text-slate-500 font-normal">
                    Standard 24/7 priority support &amp; escrow protection included.
                  </p>
                </td>
                <td className="py-2.5 px-2.5 text-center text-slate-600 dark:text-slate-400 font-semibold">
                  {item.qty}
                </td>
                <td className="py-2.5 px-2.5 text-right text-slate-600 dark:text-slate-400">{item.rate}</td>
                <td className="py-2.5 px-2.5 text-right font-bold text-slate-900 dark:text-slate-100">
                  {item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-full sm:w-64 space-y-1.5 text-[11px] bg-slate-50/60 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subtotal:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {invoiceData.subtotal_formatted || invoiceData.amount || '€ 2,034.95'}
            </span>
          </div>
          {Number(invoiceData.platform_fee || 0) > 0 && (
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Platform Fee:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {invoiceData.platform_fee_formatted || `€ ${Number(invoiceData.platform_fee).toFixed(2)}`}
              </span>
            </div>
          )}
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>VAT (15%):</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Included</span>
          </div>
          <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Total Amount:</span>
            <span className="text-base font-extrabold text-[#ff4a1f]">
              {invoiceData.gross_amount_formatted ||
                invoiceData.total_amount_formatted ||
                invoiceData.amount ||
                '€ 2,136.70'}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Digitally Signed &amp; Issued by CarrierDirect SaaS Billing Engine</span>
        </div>
        <p className="text-slate-400">Questions? Contact support@carrierdirect.com</p>
      </div>
    </>
  );
};

export default InvoiceItemsAndTotals;
