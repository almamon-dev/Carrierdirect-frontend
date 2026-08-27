import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Star, CheckCircle2, User } from 'lucide-react';

export interface RecentQuoteRow {
    id: string;
    slug?: string | number;
    status: string;
    color: string;
    customerName?: string;
    customerAvatar?: string;
    createdAt?: string;
    customerRating?: number | string;
    completedOrdersCount?: number | string;
}

interface RecentQuotesListProps {
    quotes: RecentQuoteRow[];
    isLoading?: boolean;
}

export const RecentQuotesList: React.FC<RecentQuotesListProps> = ({ quotes, isLoading = false }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 -mx-4 px-4">
                <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                    Recent Quote Requests
                </h3>
                <button
                    type="button"
                    onClick={() => navigate('/supplier/quotes/requests')}
                    className="text-[12px] font-bold text-brand hover:underline focus:outline-none transition-colors cursor-pointer"
                >
                    See All
                </button>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-12 gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider">
                <span className="col-span-2">Request</span>
                <span className="col-span-3">Customer</span>
                <span className="col-span-2">Created</span>
                <span className="col-span-2 text-center">Rating</span>
                <span className="col-span-1 text-center">Orders</span>
                <span className="col-span-2 text-right">Status</span>
            </div>

            <div className="flex flex-col text-[13px] text-slate-500 dark:text-slate-400 flex-1 justify-center min-h-[140px]">
                {isLoading ? (
                    <div className="space-y-3 py-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="grid grid-cols-12 gap-1.5 items-center py-2 border-b border-dashed border-slate-200 dark:border-slate-800 last:border-0">
                                <div className="col-span-2 h-3.5 w-10 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                                <div className="col-span-3 h-3.5 w-16 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                                <div className="col-span-2 h-3.5 w-10 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                                <div className="col-span-2 h-3.5 w-7 mx-auto bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                                <div className="col-span-1 h-3.5 w-5 mx-auto bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                                <div className="col-span-2 h-4 w-10 ml-auto bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : quotes.length === 0 ? (
                    <div className="py-6 flex flex-col items-center justify-center text-center">
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-2">
                            <FileText size={18} />
                        </div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            No recent quote requests found
                        </p>
                    </div>
                ) : (
                    quotes.slice(0, 5).map((quote, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(quote.slug ? `/supplier/quotes/requests/${quote.slug}` : '/supplier/quotes/requests')}
                            className="grid grid-cols-12 gap-1.5 items-center py-2.5 border-b border-dashed border-slate-300 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 -mx-1 px-1 rounded transition-colors cursor-pointer"
                        >
                            {/* 1. Request ID */}
                            <div className="col-span-2 min-w-0">
                                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate block" title={quote.id}>
                                    {quote.id}
                                </span>
                            </div>

                            {/* 2. Customer Avatar & Name */}
                            <div className="col-span-3 min-w-0 flex items-center gap-1.5">
                                {quote.customerAvatar ? (
                                    <img
                                        src={quote.customerAvatar}
                                        alt={quote.customerName || 'Customer'}
                                        className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0 border border-orange-200/50 dark:border-orange-500/20">
                                        {quote.customerName ? quote.customerName.charAt(0).toUpperCase() : <User size={10} />}
                                    </div>
                                )}
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate block" title={quote.customerName || 'Customer'}>
                                    {quote.customerName || 'Customer'}
                                </span>
                            </div>

                            {/* 3. Created At */}
                            <div className="col-span-2 min-w-0">
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                                    {quote.createdAt || 'Today'}
                                </span>
                            </div>

                            {/* 4. Requester Average Rating */}
                            <div className="col-span-2 flex items-center justify-center gap-0.5">
                                <Star size={11} className="text-amber-400 fill-amber-400 shrink-0" />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    {quote.customerRating !== undefined && quote.customerRating !== null
                                        ? Number(quote.customerRating).toFixed(1)
                                        : '5.0'}
                                </span>
                            </div>

                            {/* 5. Requester Completed Orders Count */}
                            <div className="col-span-1 flex items-center justify-center">
                                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded" title={`${quote.completedOrdersCount ?? 0} completed orders`}>
                                    <CheckCircle2 size={10} className="text-emerald-500 shrink-0" />
                                    {quote.completedOrdersCount ?? 0}
                                </span>
                            </div>

                            {/* 6. Status Badge */}
                            <div className="col-span-2 text-right">
                                <span className={`${quote.color} px-1.5 py-0.5 rounded text-[10px] font-bold inline-block`}>
                                    {quote.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
