import React, { useState, useMemo } from 'react';
import {
    Star, ShieldCheck, Layers, MessageSquare, Check, ArrowUpDown, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TabHeader from '@/components/ui/tab-header';
import Button from '@/components/ui/button';
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
        <div className="space-y-3 animate-in fade-in duration-300">
            {/* Header & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
                <TabHeader
                    title={`Suppliers Quoted (${siblingQuotes.length})`}
                    icon={Layers}
                    className="pb-0 mb-0 border-b-0"
                />

                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Sort:</span>
                    <div className="w-[200px]">
                        <Select
                            value={sortBy}
                            onChange={(val) => {
                                const v = typeof val === 'object' && val?.target ? val.target.value : val;
                                setSortBy(v);
                            }}
                            showSearch={false}
                            icon={ArrowUpDown}
                            placeholder="Sort bids..."
                            className="rounded-[5px] text-xs"
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
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300 font-sans">
                    <thead className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400">
                        <tr>
                            <th className="py-2.5 px-2 min-w-[170px]">Carrier</th>
                            <th className="py-2.5 px-2 text-center min-w-[70px]">Rating</th>
                            <th className="py-2.5 px-2 min-w-[120px]">Vehicle</th>
                            <th className="py-2.5 px-2 min-w-[80px]">Transit</th>
                            <th className="py-2.5 px-2 min-w-[90px]">Payment</th>
                            <th className="py-2.5 px-2 text-right min-w-[100px]">Total Price</th>
                            <th className="py-2.5 px-2 text-right min-w-[170px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-transparent">
                        {sortedQuotes.map((sq) => {
                            const isSelected = sq.id === currentQuote.id;
                            const carrierName = sq.supplier_name || sq.supplier?.company_name || sq.supplier?.name || `Carrier #${sq.id}`;
                            const isPending = (sq.status_raw || sq.status || '').toLowerCase() === 'pending';

                            return (
                                <tr
                                    key={sq.id}
                                    className={`transition-colors ${
                                        isSelected
                                            ? 'bg-slate-50/80 dark:bg-slate-800/40'
                                            : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                                    }`}
                                >
                                    {/* Carrier Info */}
                                    <td className="py-2.5 px-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-[5px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex items-center justify-center shrink-0">
                                                {carrierName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                                                    <span>{carrierName}</span>
                                                    {(sq.supplier?.is_verified ?? true) && (
                                                        <span title="Verified Carrier" className="inline-flex">
                                                            <ShieldCheck size={12} className="text-emerald-500 shrink-0" />
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10.5px] text-slate-400 font-mono">
                                                    {sq.quote_id || `QT-${sq.id}`}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Rating */}
                                    <td className="py-2.5 px-2 text-center">
                                        <div className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            <Star size={11} className="fill-amber-400 text-amber-400" />
                                            <span>{sq.numericRating.toFixed(1)}</span>
                                        </div>
                                    </td>

                                    {/* Vehicle */}
                                    <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300">
                                        <span className="truncate max-w-[120px] block" title={sq.quote_request?.vehicle_type || 'Standard Van'}>
                                            {sq.quote_request?.vehicle_type || 'Covered Van (20ft)'}
                                        </span>
                                    </td>

                                    {/* Transit Time */}
                                    <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">
                                        {sq.estimated_delivery || '48 Hours'}
                                    </td>

                                    {/* Payment Terms */}
                                    <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">
                                        {sq.payment_terms || 'Net 15 Days'}
                                    </td>

                                    {/* Total Price */}
                                    <td className="py-2.5 px-2 text-right">
                                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                                            {sq.amount}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="py-2.5 px-2 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="h-6 text-[11px] px-2 rounded-[5px] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                                                onClick={() => navigate(`/customer/quotes/negotiation/conversation/${encryptId(sq.id)}`)}
                                                title="Chat & Negotiate"
                                            >
                                                <MessageSquare size={11} className="mr-1 text-slate-500" />
                                                <span>Chat</span>
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className={`h-6 text-[11px] px-2 rounded-[5px] font-medium border-slate-200 dark:border-slate-700 ${
                                                    isSelected ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300'
                                                }`}
                                                onClick={() => onSelectQuote(sq, 'pricing')}
                                            >
                                                <Eye size={11} className="mr-1 text-slate-500" />
                                                <span>{isSelected ? 'Viewing' : 'View Specs'}</span>
                                            </Button>

                                            {isPending && (
                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    size="sm"
                                                    className="h-6 text-[11px] px-2 rounded-[5px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-semibold"
                                                    onClick={() => onAcceptQuote(sq)}
                                                >
                                                    <Check size={11} className="mr-1 stroke-[2.5]" />
                                                    <span>Accept</span>
                                                </Button>
                                            )}
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
