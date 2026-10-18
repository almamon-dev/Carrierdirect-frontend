import React from 'react';
import { ArrowLeft, Star, Printer, Download } from 'lucide-react';
import Button from '@/components/ui/button';

interface InvoiceViewHeaderProps {
  isPaid: boolean;
  onBack: () => void;
  onRateSupplier: () => void;
  onExport: () => void;
}

export const InvoiceViewHeader: React.FC<InvoiceViewHeaderProps> = ({
  isPaid,
  onBack,
  onRateSupplier,
  onExport,
}) => {
  return (
    <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-2 mb-3">
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 gap-1.5 font-semibold h-7.5 px-2 text-xs cursor-pointer"
      >
        <ArrowLeft size={13} /> Back to Invoices
      </Button>

      <div className="flex items-center gap-1.5">
        {isPaid && (
          <Button
            variant="outline"
            onClick={onRateSupplier}
            className="gap-1 font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100 h-7.5 px-2.5 text-xs shadow-2xs cursor-pointer"
          >
            <Star size={12} className="fill-amber-400 text-amber-400" /> Rate Carrier
          </Button>
        )}
        <Button
          variant="outline"
          onClick={onExport}
          className="gap-1 font-semibold bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 h-7.5 px-2.5 text-xs shadow-2xs cursor-pointer"
        >
          <Printer size={12} /> Print
        </Button>
        <Button
          onClick={onExport}
          className="gap-1 font-semibold bg-[#ff4a1f] hover:bg-[#e63d15] text-white h-7.5 px-3 text-xs shadow-2xs cursor-pointer"
        >
          <Download size={12} /> Download PDF
        </Button>
      </div>
    </div>
  );
};

export default InvoiceViewHeader;
