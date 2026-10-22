import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Star, CheckCircle2, User } from 'lucide-react';
import { encryptId } from '@/lib/encryption';
import { StatusBadge } from '@/components/common/StatusBadge';

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
    pallets?: string | number;
    budget?: string;
}

interface RecentQuotesListProps {
    quotes: RecentQuoteRow[];
    isLoading?: boolean;
}

export const RecentQuotesList: React.FC<RecentQuotesListProps> = ({ quotes, isLoading = false }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-[#1e2329] p-2.5 sm:p-3 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-1.5 -mx-2.5 px-2.5">
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                    <h3 className="text-xs sm:text-[12.5px] font-bold text-slate-800 dark:text-slate-200">
                        Recent Quote Requests
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={() => navigate('/supplier/quotes/requests')}
                    className="text-[11px] font-bold text-brand hover:underline focus:outline-none transition-colors cursor-pointer"
                >
                    See All
                </button>
            </div>

            <div className="w-full">
                {/* Column Headers */}
                <div className="grid grid-cols-12 gap-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 pb-1 border-b border-slate-100 dark:border-slate-800 tracking-wider">
                    <span className="col-span-2">Request #</span>
                    <span className="col-span-3">Customer</span>
                    <span className="col-span-2">Created</span>
                    <span className="col-span-1 text-center">Pallets</span>
                    <span className="col-span-2 text-center">Budget</span>
                    <span className="col-span-2 text-right">Status</span>
                </div>

                <div className="flex flex-col text-xs text-slate-500 dark:text-slate-400 justify-start">
                    {isLoading ? (
                        <div className="space-y-2 py-1">
                            {[1, 2].map((i) => (
                                <div key={i} className="grid grid-cols-12 gap-1 items-center py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800 last:border-0">
                                    <div className="col-span-2 h-3 w-10 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                                    <div className="col-span-3 h-3 w-16 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                                    <div className="col-span-2 h-3 w-10 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                                    <div className="col-span-1 h-3 w-4 mx-auto bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                                    <div className="col-span-2 h-3 w-12 mx-auto bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                                    <div className="col-span-2 h-3.5 w-10 ml-auto bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : quotes.length === 0 ? (
                        <div className="py-4 flex flex-col items-center justify-center text-center">
                            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-1">
                                <FileText size={14} />
                            </div>
                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                No recent quote requests found
                            </p>
                        </div>
                    ) : (
                        quotes.slice(0, 2).map((quote, idx) => {
                            const rawBudget = quote.budget || 'Negotiable';
                            const displayBudget = rawBudget.toLowerCase().includes('negotiable')
                                ? 'Negotiable'
                                : rawBudget;

                            return (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        const rawId = String(quote.slug || quote.id).replace('REQ-', '').trim();
                                        navigate(rawId ? `/supplier/quotes/requests/${encryptId(rawId)}` : '/supplier/quotes/requests');
                                    }}
                                    className="grid grid-cols-12 gap-1 items-center py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800/80 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 px-1 rounded transition-colors cursor-pointer"
                                >
                                    {/* 1. Request ID */}
                                    <div className="col-span-2 min-w-0">
                                        <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] truncate block" title={quote.id}>
                                            {quote.id}
                                        </span>
                                    </div>

                                    {/* 2. Customer Avatar & Name */}
                                    <div className="col-span-3 min-w-0 flex items-center gap-1">
                                        {quote.customerAvatar ? (
                                            <img
                                                src={quote.customerAvatar}
                                                alt={quote.customerName || 'Customer'}
                                                className="w-4 h-4 rounded-full object-cover shrink-0 aspect-square border border-slate-200 dark:border-slate-700"
                                                onError={(e) => {
                                                    (e.currentTarget as HTMLElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] flex items-center justify-center text-[9px] font-bold shrink-0 aspect-square border border-orange-200/50 dark:border-orange-500/20">
                                                {quote.customerName ? quote.customerName.charAt(0).toUpperCase() : <User size={9} />}
                                            </div>
                                        )}
                                        <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate block" title={quote.customerName || 'Customer'}>
                                            {quote.customerName || 'Customer'}
                                        </span>
                                    </div>

                                    {/* 3. Created At */}
                                    <div className="col-span-2 min-w-0">
                                        <span className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate block">
                                            {quote.createdAt || 'Today'}
                                        </span>
                                    </div>

                                    {/* 4. Pallets */}
                                    <div className="col-span-1 text-center min-w-0">
                                        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                            {quote.pallets ?? 8}
                                        </span>
                                    </div>

                                    {/* 5. Budget */}
                                    <div className="col-span-2 text-center min-w-0">
                                        <span className="text-[10.5px] font-bold text-slate-800 dark:text-slate-200 truncate block" title={displayBudget}>
                                            {displayBudget}
                                        </span>
                                    </div>

                                    {/* 6. Status Badge */}
                                    <div className="col-span-2 text-right min-w-0 flex justify-end">
                                        <StatusBadge status={quote.status || 'Open'} />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
