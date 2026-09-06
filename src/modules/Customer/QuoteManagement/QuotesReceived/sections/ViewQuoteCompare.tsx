import React, { useState, useMemo } from 'react';
import {
    Star, ShieldCheck, Layers, MessageSquare, Check, ArrowUpDown, Eye, Trophy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TabHeader from '@/components/ui/tab-header';
import Select from '@/components/ui/select';
import { encryptId } from '@/lib/encryption';
import { QuoteData } from '../types/quoteViewDetailTypes';

interface ViewQuoteCompareProps {
    currentQuote: QuoteData;
    siblingQuotes: QuoteData[];
    onSelectQuote: (quote: QuoteData, targetTab?: string) => void;
    onAcceptQuote: (quote: QuoteData) => void;
}

export const ViewQuoteCompare: React.FC<ViewQuoteCompareProps> = ({
    currentQuote,
    siblingQuotes,
    onSelectQuote,
    onAcceptQuote,
}) => {
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState<string>('lowest_price');

    // Parse amounts & ratings for comparison
    const parsedQuotes = useMemo(() => {
        return siblingQuotes.map((sq) => {
            const rawAmt = sq.amount_raw || parseFloat(String(sq.amount || 0).replace(/[^0-9.]/g, '')) || 0;
            const ratingNum = Number(sq.rating || sq.supplier?.rating || 4.8);
            const transitHours = (() => {
                const str = String(sq.estimated_delivery || sq.estimated_time || '').toLowerCase();
                const num = parseInt(str.replace(/[^0-9]/g, '')) || 48;
                if (str.includes('d') || str.includes('day')) return num * 24;
                return num;
            })();
            return {
                ...sq,
                numericAmount: rawAmt,
                numericRating: ratingNum,
                numericTransit: transitHours,
            };
        });
    }, [siblingQuotes]);

    // Sorted quotes
    const sortedQuotes = useMemo(() => {
        const list = [...parsedQuotes];
        if (sortBy === 'lowest_price') return list.sort((a, b) => a.numericAmount - b.numericAmount);
        if (sortBy === 'highest_price') return list.sort((a, b) => b.numericAmount - a.numericAmount);
        if (sortBy === 'top_rated') return list.sort((a, b) => b.numericRating - a.numericRating);
        if (sortBy === 'fastest') return list.sort((a, b) => a.numericTransit - b.numericTransit);
        return list;
    }, [parsedQuotes, sortBy]);

    return (
        <div className="space-y-2 animate-in fade-in duration-300">
            {/* Header & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800">
                <TabHeader
                    title={`Suppliers Quoted (${siblingQuotes.length})`}
                    icon={Layers}
                    className="pb-0 mb-0 border-b-0"
                />

                <div className="flex items-center gap-2">
                    <span className="text-[11.5px] text-slate-500 dark:text-slate-400 whitespace-nowrap">Sort:</span>
                    <div className="w-[175px]">
                        <Select
                            value={sortBy}
                            onChange={(val) => {
                                const v = typeof val === 'object' && val?.target ? val.target.value : val;
                                setSortBy(v);
                            }}
                            showSearch={false}
                            icon={ArrowUpDown}
                            placeholder="Sort bids..."
                            className="rounded-[4px] text-[11.5px]"
                        >
                            <option value="lowest_price">Price: Low to High</option>
                            <option value="highest_price">Price: High to Low</option>
                            <option value="top_rated">Top Rated Carrier</option>
                            <option value="fastest">Fastest Transit</option>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Clean, Seamless Flush Comparative Table */}
            <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="w-full text-left text-[11.5px] text-slate-700 dark:text-slate-300 font-sans">
                    <thead className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <tr>
                            <th className="py-1.5 px-2 min-w-[175px]">Carrier</th>
                            <th className="py-1.5 px-2 text-center min-w-[65px]">Rating</th>
                            <th className="py-1.5 px-2 min-w-[120px]">Vehicle</th>
                            <th className="py-1.5 px-2 min-w-[75px]">Transit</th>
                            <th className="py-1.5 px-2 min-w-[85px]">Payment</th>
                            <th className="py-1.5 px-2 text-right min-w-[95px]">Total Price</th>
                            <th className="py-1.5 px-2 text-right min-w-[175px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-transparent">
                        {sortedQuotes.map((sq) => {
                            const isSelected = sq.id === currentQuote.id;
                            const carrierName = sq.supplier_name || sq.supplier?.company_name || sq.supplier?.name || `Carrier #${sq.id}`;
                            const avatar = sq.supplier?.profile_picture || (sq as any).supplier_avatar || (sq as any).profile_picture;
                            const statusLower = (sq.status_raw || sq.status || (sq.id === currentQuote.id ? (currentQuote.status_raw || currentQuote.status) : '') || '').toLowerCase();
                            const isWon = statusLower === 'accepted' || statusLower === 'won' || statusLower === 'completed';
                            const isPending = statusLower === 'pending';

                            return (
                                <tr
                                    key={sq.id}
                                    className={`transition-colors ${
                                        isWon
                                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                                            : isSelected
                                            ? 'bg-slate-50/80 dark:bg-slate-800/40'
                                            : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                                    }`}
                                >
                                    {/* Carrier Info */}
                                    <td className="py-1.5 px-2">
                                        <div className="flex items-center gap-2">
                                            {avatar ? (
                                                <img
                                                    src={avatar.startsWith('http') || avatar.startsWith('/') ? avatar : `/storage/${avatar}`}
                                                    alt={carrierName}
                                                    className="w-6 h-6 min-w-[24px] min-h-[24px] aspect-square rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs"
                                                    onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                                                />
                                            ) : (
                                                <div className={`w-6 h-6 min-w-[24px] min-h-[24px] aspect-square rounded-full flex items-center justify-center text-[10.5px] font-bold shrink-0 ${
                                                    isWon
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                                                        : 'bg-orange-100 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] border border-orange-200/60 dark:border-orange-500/20'
                                                }`}>
                                                    {carrierName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5 leading-tight">
                                                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-[11.5px] truncate">
                                                        {carrierName}
                                                    </span>
                                                    {(sq.supplier?.is_verified ?? true) && (
                                                        <span title="Verified Carrier" className="inline-flex">
                                                            <ShieldCheck size={11.5} className="text-emerald-500 shrink-0" />
                                                        </span>
                                                    )}
                                                    {isWon && (
                                                        <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[9.5px] font-bold px-1.5 py-0.5 rounded-[3px] border border-emerald-200 dark:border-emerald-800">
                                                            <Trophy size={9.5} className="text-emerald-600 dark:text-emerald-400" />
                                                            <span>Winner</span>
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-mono leading-none block mt-0.5">
                                                    {sq.quote_id || `QT-${sq.id}`}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Rating */}
                                    <td className="py-1.5 px-2 text-center">
                                        <div className="inline-flex items-center gap-0.5 text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                                            <Star size={10.5} className="fill-amber-400 text-amber-400" />
                                            <span>{sq.numericRating.toFixed(1)}</span>
                                        </div>
                                    </td>

                                    {/* Vehicle */}
                                    <td className="py-1.5 px-2 text-slate-700 dark:text-slate-300">
                                        <span className="truncate max-w-[120px] block" title={sq.quote_request?.vehicle_type || 'Standard Van'}>
                                            {sq.quote_request?.vehicle_type || 'Covered Van (20ft)'}
                                        </span>
                                    </td>

                                    {/* Transit Time */}
                                    <td className="py-1.5 px-2 text-slate-600 dark:text-slate-400">
                                        {sq.estimated_delivery || '48 Hours'}
                                    </td>

                                    {/* Payment Terms */}
                                    <td className="py-1.5 px-2 text-slate-600 dark:text-slate-400">
                                        {sq.payment_terms || 'Net 15 Days'}
                                    </td>

                                    {/* Total Price */}
                                    <td className="py-1.5 px-2 text-right">
                                        <span className={`font-bold text-[12px] ${
                                            isWon ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
                                        }`}>
                                            {sq.amount}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="py-1.5 px-2 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                type="button"
                                                className="h-[25px] px-2 text-[10.5px] rounded-[4px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
                                                onClick={() => navigate(`/customer/quotes/negotiation/conversation/${encryptId(sq.id)}`)}
                                                title="Chat & Negotiate"
                                            >
                                                <MessageSquare size={10.5} className="text-slate-400" />
                                                <span>Chat</span>
                                            </button>

                                            <button
                                                type="button"
                                                className={`h-[25px] px-2 text-[10.5px] rounded-[4px] border font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                                                    isSelected
                                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 font-semibold'
                                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                                                }`}
                                                onClick={() => onSelectQuote(sq, 'pricing')}
                                            >
                                                <Eye size={10.5} className={isSelected ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'} />
                                                <span>{isSelected ? 'Viewing' : 'View Specs'}</span>
                                            </button>

                                            {isWon ? (
                                                <span className="h-[25px] px-2 text-[10.5px] rounded-[4px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold flex items-center gap-1 shrink-0">
                                                    <Check size={11} className="stroke-[3] text-emerald-600 dark:text-emerald-400" />
                                                    <span>Won</span>
                                                </span>
                                            ) : isPending ? (
                                                <button
                                                    type="button"
                                                    className="h-[25px] px-2 text-[10.5px] rounded-[4px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-semibold flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
                                                    onClick={() => onAcceptQuote(sq)}
                                                >
                                                    <Check size={10.5} className="stroke-[2.5]" />
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

