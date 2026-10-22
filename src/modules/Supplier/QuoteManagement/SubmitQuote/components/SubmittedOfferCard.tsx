import Button from '@/components/ui/button';
import apiClient from '@/lib/axios';
import { encryptId } from '@/lib/encryption';
import { useToastStore } from '@/stores/useToastStore';
import { Edit3, MessageSquare, CreditCard, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuoteRequest } from '../../data/quoteRequestsData';

interface SubmittedOfferCardProps {
    requestDetails: QuoteRequest;
    onEditOffer: () => void;
    onOfferWithdrawn?: () => void;
}

export const SubmittedOfferCard: React.FC<SubmittedOfferCardProps> = ({
    requestDetails,
    onEditOffer,
    onOfferWithdrawn,
}) => {
    const navigate = useNavigate();
    const showToast = useToastStore((state) => state.showToast);
    const quote = (requestDetails as any).quote_submitted || {};

    const cleanId = String(requestDetails.rawId || requestDetails.slug || requestDetails.id || '').replace('REQ-', '').trim();
    const quoteId = quote.id || quote.quote_id;

    const baseAmountNum = parseFloat(String(quote.base_amount ?? quote.amount ?? 0));
    const extraCharges = Array.isArray(quote.extra_charges) ? quote.extra_charges : [];
    const extraChargesTotal = extraCharges.reduce((acc: number, c: any) => acc + (parseFloat(String(c.amount || 0)) || 0), 0);
    const totalAmountNum = parseFloat(String(quote.amount || (baseAmountNum + extraChargesTotal)));

    const VALIDITY_MAP: Record<string, string> = { '24h': '24 Hours', '48h': '48 Hours', '72h': '72 Hours', '7d': '7 Days', '14d': '14 Days' };
    const formatValidity = (v?: string) => (v ? (VALIDITY_MAP[v] || v) : '48 Hours');

    const TERM_MAP: Record<string, string> = { immediate: 'Due on Receipt', due_on_receipt: 'Due on Receipt', net7: 'Net 7 Days', net15: 'Net 15 Days', net30: 'Net 30 Days', net60: 'Net 60 Days' };
    const formatPaymentTerm = (p?: string) => (p ? (TERM_MAP[p] || p) : 'Net 15 Days');

    const validityDisplay = formatValidity(quote.validity || quote.estimated_time);
    const paymentTermDisplay = formatPaymentTerm(quote.payment_term);
    const remarks = quote.notes || 'Standard offer';

    const rawQuoteStatus = String(quote.status || quote.status_raw || quote.status_label || '').toLowerCase().trim();
    const isWon = Boolean(
        (requestDetails as any).is_won ||
        (requestDetails.status || '').toLowerCase() === 'won' ||
        rawQuoteStatus === 'accepted' ||
        rawQuoteStatus === 'won'
    );
    const isPaid = Boolean(
        (requestDetails as any).is_paid ||
        (requestDetails as any).isPaid ||
        quote.is_paid ||
        quote.isPaid ||
        (requestDetails as any).payment_status === 'Paid' ||
        quote.payment_status === 'Paid' ||
        ((requestDetails as any).order?.status === 'confirmed' && (requestDetails as any).order?.is_paid)
    );
    const isTerminal = ['accepted', 'booked', 'won', 'completed', 'rejected', 'declined', 'cancelled', 'lost', 'expired'].includes(rawQuoteStatus);
    const hasNegotiation = rawQuoteStatus === 'negotiating' || rawQuoteStatus === 'negotiation' || quote.revision_status === 'pending' || Boolean((requestDetails as any).hasNegotiation);
    const apiCanEdit = quote.is_editable ?? quote.can_edit ?? (requestDetails as any).can_edit_quote;
    const canEditOffer = apiCanEdit !== undefined 
        ? Boolean(apiCanEdit) 
        : (!isTerminal && !hasNegotiation && (rawQuoteStatus === 'submitted' || rawQuoteStatus === 'pending' || rawQuoteStatus === 'quoted' || rawQuoteStatus === 'active' || rawQuoteStatus === 'open' || rawQuoteStatus === 'draft'));

    const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
    const [showWithdrawConfirm, setShowWithdrawConfirm] = useState<boolean>(false);

    const handleWithdrawQuote = async () => {
        if (!quoteId) {
            showToast('Unable to identify quote ID to withdraw.', 'error');
            return;
        }
        setIsWithdrawing(true);
        try {
            await apiClient.delete(`/supplier/quotes/${quoteId}`);
            showToast('Quote offer withdrawn successfully.', 'success');
            setShowWithdrawConfirm(false);
            if (onOfferWithdrawn) onOfferWithdrawn();
            else navigate('/supplier/quotes/requests');
        } catch (err: any) {
            try {
                await apiClient.post(`/supplier/quotes/${quoteId}/withdraw`);
                showToast('Quote offer withdrawn successfully.', 'success');
                setShowWithdrawConfirm(false);
                if (onOfferWithdrawn) onOfferWithdrawn();
                else navigate('/supplier/quotes/requests');
            } catch (err2: any) {
                const msg = err?.response?.data?.message || err2?.response?.data?.message || 'Unable to withdraw offer at this time.';
                showToast(msg, 'error');
                setShowWithdrawConfirm(false);
            }
        } finally {
            setIsWithdrawing(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs p-3.5 space-y-2.5 font-sans">
            {/* Header: Submitted Offer & REQ-ID */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Submitted Offer
                    </h3>
                    {isWon && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                            Accepted
                        </span>
                    )}
                    {isWon && !isPaid && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700 flex items-center gap-1">
                            <CreditCard size={9.5} />
                            <span>Awaiting Payment</span>
                        </span>
                    )}
                    {isWon && isPaid && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700 flex items-center gap-1">
                            <CheckCircle2 size={9.5} />
                            <span>Paid</span>
                        </span>
                    )}
                </div>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    {requestDetails.id || `REQ-${cleanId}`}
                </span>
            </div>

            {/* Offer Key Details */}
            <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between py-0.5">
                    <span className="text-slate-600 dark:text-slate-400">Base Freight Price</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                        €{baseAmountNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>

                <div className="flex items-center justify-between py-0.5">
                    <span className="text-slate-600 dark:text-slate-400">Extra Charges</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {extraCharges.length > 0 ? (
                            `+€${extraChargesTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        ) : (
                            'No extra charges'
                        )}
                    </span>
                </div>

                <div className="flex items-center justify-between py-0.5 pt-1 border-t border-slate-100/80 dark:border-slate-800/60">
                    <span className="text-slate-500 dark:text-slate-400 text-[11.5px]">Validity</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium text-[11.5px]">
                        {validityDisplay}
                    </span>
                </div>

                <div className="flex items-center justify-between py-0.5">
                    <span className="text-slate-500 dark:text-slate-400 text-[11.5px]">Payment Term</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium text-[11.5px]">
                        {paymentTermDisplay}
                    </span>
                </div>

                <div className="flex items-center justify-between py-1 border-t border-slate-100/80 dark:border-slate-800/60">
                    <span className="text-slate-500 dark:text-slate-400 text-[11.5px]">Payment Status</span>
                    {isWon ? (
                        isPaid ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                                <CheckCircle2 size={11} className="text-emerald-600 dark:text-emerald-400" />
                                <span>Paid (Escrow Secured)</span>
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-300 dark:border-amber-700 animate-pulse">
                                <CreditCard size={11} className="text-amber-600 dark:text-amber-400" />
                                <span>Awaiting Payment</span>
                            </span>
                        )
                    ) : (
                        <span className="text-slate-600 dark:text-slate-300 font-medium text-[11.5px]">
                            Pending Acceptance
                        </span>
                    )}
                </div>
            </div>

            {/* Commercial Remarks Box (Compact) */}
            {remarks && (
                <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">
                        Commercial Remarks
                    </span>
                    <div 
                        className="px-2.5 py-1.5 rounded-[3px] bg-slate-50 dark:bg-[#181d24] border border-slate-200/70 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2"
                        title={remarks}
                    >
                        {remarks}
                    </div>
                </div>
            )}

            {/* Total Quotation Amount */}
            <div className="pt-2 pb-0.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Total Quotation Amount
                </span>
                <span className="text-base font-extrabold text-[#059669] dark:text-emerald-400">
                    € {totalAmountNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>

            {/* Action Buttons: Edit Offer & Negotiation */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                {canEditOffer && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onEditOffer}
                        className="w-auto px-3.5 h-8 text-xs font-semibold rounded-[3px] border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                    >
                        <Edit3 size={13} className="text-slate-600 dark:text-slate-300 shrink-0" />
                        <span>Edit Offer</span>
                    </Button>
                )}

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        const targetId = (requestDetails as any).quote_submitted?.id || requestDetails.quoteId || requestDetails.rawId || requestDetails.slug || requestDetails.id;
                        const rawId = String(targetId).replace('REQ-', '').replace('QT-', '').trim();
                        navigate(`/supplier/quotes/negotiation/conversation/${encryptId(rawId)}`);
                    }}
                    className="w-auto px-3.5 h-8 text-xs font-semibold rounded-[3px] border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/50 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                >
                    <MessageSquare size={13} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Negotiation</span>
                </Button>
            </div>
        </div>
    );
};
