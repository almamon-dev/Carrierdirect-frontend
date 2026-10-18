import React from 'react';
import { encryptId } from '@/lib/encryption';

export const QuotesReceivedQuoteIdCell: React.FC<{ row: any; onNavigate: (path: string) => void }> = ({
  row,
  onNavigate,
}) => {
  const rawId = row.rawId || row.id;
  const quoteText =
    row.quote_id ||
    row.quoteId ||
    (rawId ? (String(rawId).startsWith('QT-') ? rawId : `QT-${String(rawId).padStart(4, '0')}`) : 'QT-0000');

  return (
    <div className="flex items-center min-h-[26px]">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(`/customer/quotes/received/view/${encryptId(rawId)}`);
        }}
        className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-left whitespace-nowrap cursor-pointer text-[13px] tracking-tight transition-colors leading-none"
      >
        {quoteText}
      </button>
    </div>
  );
};

export const QuotesReceivedRequestIdCell: React.FC<{ row: any; onNavigate: (path: string) => void }> = ({
  row,
  onNavigate,
}) => {
  const reqIdVal = row.quote_request_id || row.quote_request?.id || row.rawId || row.requestId || row.request_id;
  const reqIdText =
    row.request_id ||
    row.requestId ||
    (reqIdVal ? (String(reqIdVal).startsWith('REQ-') ? reqIdVal : `REQ-${String(reqIdVal).padStart(4, '0')}`) : 'REQ-0000');

  return (
    <div className="flex items-center min-h-[26px]">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          const cleanReqId = String(reqIdVal || '').replace('REQ-', '');
          if (cleanReqId) onNavigate(`/customer/quotes/create/view/${cleanReqId}`);
        }}
        className="font-bold text-slate-800 dark:text-slate-200 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] hover:underline whitespace-nowrap cursor-pointer text-[13px] text-left leading-none transition-colors"
      >
        {reqIdText}
      </button>
    </div>
  );
};
