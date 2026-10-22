import React from 'react';
import { Phone, Mail, Building2, ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

interface InvoicePaperDetailsProps {
  invoiceData: any;
  isPaid: boolean;
  isDue: boolean;
  isOverdue: boolean;
  isPayLater: boolean;
  displayInvId: string;
  displayOrderId: string;
}

export const InvoicePaperDetails: React.FC<InvoicePaperDetailsProps> = ({
  invoiceData,
  isPaid,
  isDue,
  isOverdue,
  isPayLater,
  displayInvId,
  displayOrderId,
}) => {
  return (
    <>
      <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Carrier<span className="text-[#ff4a1f]">Direct</span>
            </span>
            <span className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 ml-1">
              Enterprise
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5 leading-tight">
            <p className="font-semibold text-slate-700 dark:text-slate-300">CarrierDirect Logistics Tech</p>
            <p>123 Logistics Avenue, Industrial Cargo Hub</p>
            <div className="flex items-center gap-2 pt-0.5 text-[10.5px] text-slate-500">
              <span className="flex items-center gap-0.5"><Phone size={10} /> +880 1711-000000</span>
              <span>•</span>
              <span className="flex items-center gap-0.5"><Mail size={10} /> billing@carrierdirect.com</span>
            </div>
          </div>
        </div>

        <div className="text-right space-y-1">
          <div>
            <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 inline-block">
              TAX INVOICE
            </span>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              {displayInvId}
            </h1>
          </div>

          <div className="space-y-0.5 text-[11px]">
            <div className="flex justify-end gap-2 text-slate-600 dark:text-slate-400">
              <span className="font-normal text-slate-400">Order:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-200">#{displayOrderId}</span>
            </div>
            <div className="flex justify-end gap-2 text-slate-600 dark:text-slate-400">
              <span className="font-normal text-slate-400">Issue Date:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                {invoiceData.issue_date || invoiceData.date || '18 Jul 2026'}
              </span>
            </div>
            <div className="flex justify-end gap-2 text-slate-600 dark:text-slate-400">
              <span className="font-normal text-slate-400">Due Date:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                {invoiceData.due_date || invoiceData.dueDate || '30 Jul 2026'}
              </span>
            </div>
            <div className="flex justify-end gap-2 items-center pt-0.5">
              <span className="font-normal text-slate-400">Status:</span>
              {isPaid && (
                <StatusBadge status="Paid" />
              )}
              {isDue && !isOverdue && isPayLater && (
                <StatusBadge status="Net-30 Due" />
              )}
              {isDue && !isOverdue && !isPayLater && (
                <StatusBadge status="Due" label="Payment Due" />
              )}
              {isOverdue && (
                <StatusBadge status="Overdue" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
        <div className="bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 space-y-0.5">
          <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
            <Building2 size={12} className="text-[#ff4a1f]" /> Billed To
          </span>
          <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">
            {invoiceData.customer_company || invoiceData.customer_name || 'Customer Logistics BD'}
          </p>
          {invoiceData.customer_name && invoiceData.customer_name !== invoiceData.customer_company && (
            <p className="text-slate-600 dark:text-slate-300">Attn: {invoiceData.customer_name}</p>
          )}
          <p className="text-slate-500 dark:text-slate-400">
            {invoiceData.customer_address || 'Plot-1088, Industrial Zone, Dhaka'}
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Carrier: {invoiceData.supplier_name || invoiceData.supplier || 'Express Freight Logistics'}
          </p>
        </div>

        <div className="bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 space-y-0.5">
          <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
            <ShieldCheck size={12} className="text-[#ff4a1f]" /> Settlement Information
          </span>
          <p className="font-bold text-slate-900 dark:text-slate-100">
            {invoiceData.payment_method || (isPaid ? 'Credit Card / Escrow Cleared' : 'Escrow Secured Settlement')}
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Transaction Ref: TXN-{String(displayInvId).replace(/[^0-9]/g, '') || '892147'}
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Issued on: {invoiceData.issue_date || invoiceData.date || '18 Jul 2026'}
          </p>
          <p className="text-emerald-700 dark:text-emerald-400 font-semibold text-[10.5px]">
            Escrow Guaranteed &amp; Verified
          </p>
        </div>
      </div>
    </>
  );
};

export default InvoicePaperDetails;
