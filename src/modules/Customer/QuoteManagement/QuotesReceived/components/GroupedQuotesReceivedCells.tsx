import React from 'react';
import { ChevronRight, FileText } from 'lucide-react';
import { encryptId } from '@/lib/encryption';

export const GroupedQuotesCountCell: React.FC<{
  row: any;
  onNavigate: (path: string) => void;
}> = ({ row, onNavigate }) => {
  const count = row.quotesCount || (row.quotes ? row.quotes.length : 1);
  const rawReqId = row.rawRequestId || row.quote_request_id || row.rawId;

  return (
    <div className="flex items-center min-h-[26px]">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(`/customer/quotes/received/${encryptId(rawReqId)}`);
        }}
        title={`Click to view and compare all ${count} carrier quotes`}
        className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-orange-50 dark:bg-[#ff4a1f]/15 hover:bg-orange-100 dark:hover:bg-[#ff4a1f]/25 border border-orange-200/80 dark:border-orange-500/30 text-[#ff4a1f] text-xs font-bold transition-all cursor-pointer shadow-2xs"
      >
        <FileText size={12} className="shrink-0 opacity-80" />
        <span>{count} {count === 1 ? 'Quote' : 'Quotes'}</span>
        <ChevronRight size={12} className="opacity-70 group-hover:translate-x-0.5 transition-transform shrink-0" />
      </button>
    </div>
  );
};

export const GroupedQuotesSuppliersCell: React.FC<{ row: any }> = ({ row }) => {
  const suppliers: any[] = row.suppliers || [];
  if (suppliers.length === 0) {
    const fallbackName = row.supplier?.full_name || row.supplier?.name || row.supplier_full_name || row.supplier || row.supplier_name || 'Carrier';
    return (
      <div className="flex items-center gap-2 min-h-[26px]">
        <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0">
          {fallbackName.charAt(0).toUpperCase()}
        </div>
        <span className="font-bold text-slate-800 dark:text-slate-200 text-[12.5px] whitespace-nowrap">
          {fallbackName}
        </span>
      </div>
    );
  }

  const firstSupplier = suppliers[0];
  const count = suppliers.length;

  return (
    <div className="flex items-center gap-2 min-h-[26px]">
      {/* Avatar Stack */}
      <div className="flex items-center -space-x-1.5 shrink-0">
        {suppliers.slice(0, 3).map((s, idx) => (
          <div
            key={idx}
            className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full border border-white dark:border-slate-900 bg-orange-100 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shadow-2xs overflow-hidden shrink-0"
            title={s.name}
          >
            {s.avatar ? (
              <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
            ) : (
              (s.name || 'S').charAt(0).toUpperCase()
            )}
          </div>
        ))}
      </div>

      {/* Names text */}
      <div className="whitespace-nowrap" title={suppliers.map((s: any) => s.name).join(', ')}>
        <span className="font-bold text-slate-900 dark:text-slate-100 text-[12.5px] whitespace-nowrap block leading-tight">
          {firstSupplier.name}
        </span>
        {count > 1 && (
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
            +{count - 1} other{count > 2 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
};

export const GroupedQuotesAmountCell: React.FC<{ row: any }> = ({ row }) => {
  const latest = row.latestAmount;
  const lowest = row.lowestAmount;
  const highest = row.highestAmount;
  const isNegotiable = (lowest === null || lowest === undefined || lowest === 0) &&
                       (highest === null || highest === undefined || highest === 0) &&
                       (latest === null || latest === undefined || latest === 0);

  if (isNegotiable) {
    return (
      <div className="flex items-center min-h-[26px]">
        <span className="whitespace-nowrap font-bold text-[12.5px] text-slate-500 dark:text-slate-400">
          Negotiable
        </span>
      </div>
    );
  }

  const formatEuro = (num: number) =>
    `€${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const displayAmount = latest ?? lowest ?? highest ?? 0;

  return (
    <div className="flex items-center min-h-[26px]">
      <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap text-[13px]">
        {formatEuro(displayAmount)}{' '}
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">EUR</span>
      </span>
    </div>
  );
};
