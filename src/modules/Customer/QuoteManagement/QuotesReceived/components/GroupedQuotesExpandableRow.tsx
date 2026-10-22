import React from 'react';
import { ArrowRight, Check, MessageSquare, ExternalLink, CreditCard } from 'lucide-react';
import { encryptId } from '@/lib/encryption';
import { markQuoteAsReviewed } from '../utils/quotesReceivedHelpers';

interface GroupedQuotesExpandableRowProps {
  row: any;
  onNavigate: (path: string) => void;
  onAccept: (quoteId: number, quote: any) => void;
}

export const GroupedQuotesExpandableRow: React.FC<GroupedQuotesExpandableRowProps> = ({
  row,
  onNavigate,
  onAccept,
}) => {
  const quotes: any[] = row.quotes || [];
  const rawReqId = row.rawRequestId || row.quote_request_id || row.rawId;

  return (
    <div className="p-3.5 sm:p-4 bg-slate-50/90 dark:bg-[#151921] border-t border-slate-200/90 dark:border-slate-800 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Carrier Quotes for {row.requestId}
          </span>
          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 text-[#ff4a1f]">
            {quotes.length} {quotes.length === 1 ? 'Carrier Bid' : 'Carrier Bids'}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(`/customer/quotes/received/${encryptId(rawReqId)}`);
          }}
          className="text-xs font-bold text-[#ff4a1f] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Open Full Bids Comparison & Negotiation Tracker</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="overflow-x-auto rounded-[3px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12161c]">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 select-none">
            <tr>
              <th className="py-2 px-3">Quote ID</th>
              <th className="py-2 px-3">Carrier / Supplier</th>
              <th className="py-2 px-3">Offered Amount</th>
              <th className="py-2 px-3">Transit Time</th>
              <th className="py-2 px-3 text-center">Status</th>
              <th className="py-2 px-3 text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {quotes.map((q: any) => {
              const qRawId = q.rawId || q.id;
              const qAmount = q.amount_raw || q.amount || 0;
              const rawStatus = (q.status || '').toLowerCase().trim();
              const rawStatusRaw = (q.status_raw || '').toLowerCase().trim();
              const isBooked = rawStatus === 'booked' || rawStatusRaw === 'booked' || Boolean(q.is_booked || q.isBooked);
              const isAwaitingPayment = Boolean(
                q.is_awaiting_payment ||
                q.isAwaitingPayment ||
                rawStatus === 'awaiting_payment' ||
                rawStatusRaw === 'awaiting_payment' ||
                ((rawStatus === 'accepted' || rawStatusRaw === 'accepted') && !isBooked && !q.is_paid && !q.isPaid)
              );
              const isAccepted = isAwaitingPayment || isBooked || (q.status || '').toLowerCase().includes('accept') || q.status === 'Accepted';

              return (
                <tr key={qRawId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        markQuoteAsReviewed(qRawId);
                        onNavigate(`/customer/quotes/received/view/${encryptId(qRawId)}`);
                      }}
                      className="hover:text-[#ff4a1f] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{q.id || q.quoteId}</span>
                      <ExternalLink size={11} className="opacity-60" />
                    </button>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      {q.supplierAvatar ? (
                        <img
                          src={q.supplierAvatar}
                          alt={q.supplier}
                          className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] text-[10px] font-bold flex items-center justify-center">
                          {(q.supplier || 'S').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {q.supplier}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    €{Number(qAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                    <span className="text-[10.5px] font-semibold text-slate-500">EUR</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-semibold">
                    {q.transit || q.deliveryDate || '48h'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                      isBooked
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                        : isAwaitingPayment
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                        : isAccepted
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300'
                    }`}>
                      {isAwaitingPayment ? 'Awaiting Payment' : (q.status || 'New')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right pr-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(`/customer/quotes/negotiation/conversation/${encryptId(qRawId)}`);
                        }}
                        className="h-6 px-2 text-[11.5px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-[2px] flex items-center gap-1 transition-colors cursor-pointer"
                        title="Chat & Negotiate"
                      >
                        <MessageSquare size={11} />
                        <span>Chat</span>
                      </button>
                      {isAwaitingPayment ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(`/customer/quotes/received/checkout/${encryptId(qRawId)}`);
                          }}
                          className="h-6 px-2.5 text-[11.5px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2px] flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                          title="Complete Payment"
                        >
                          <CreditCard size={11} />
                          <span>Pay Now</span>
                        </button>
                      ) : !isAccepted ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAccept(qRawId, q);
                          }}
                          className="h-6 px-2.5 text-[11.5px] font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[2px] flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                          title="Accept Quote"
                        >
                          <Check size={11} />
                          <span>Accept</span>
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
