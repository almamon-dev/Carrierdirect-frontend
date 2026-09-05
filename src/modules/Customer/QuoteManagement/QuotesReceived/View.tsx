import React, { useState } from 'react';
import {
    Loader2, AlertCircle, Euro, Truck, Package, Layers,
    MessageSquare, Check, XCircle, ChevronRight, Users, ArrowLeft, TrendingDown
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';
import { DeclineOfferModal } from '../Negotiation/Chat/components/DeclineOfferModal';
import { CounterOfferModal } from '../Negotiation/Actions/components/CounterOfferModal';
import { useQuoteViewDetail } from './hooks/useQuoteViewDetail';
import { ViewQuoteCompare } from './sections/ViewQuoteCompare';
import { ViewQuotePricing } from './sections/ViewQuotePricing';
import { ViewQuoteRouteCargo } from './sections/ViewQuoteRouteCargo';

export default function QuoteView() {
    const navigate = useNavigate();
    const { quoteId, requestId } = useParams();
    // Tab 1 (First Step): 'suppliers' (All suppliers who quoted on this request)
    const [activeTab, setActiveTab] = useState<string>('suppliers');
    const [isCounterModalOpen, setIsCounterModalOpen] = useState<boolean>(false);

    const {
        loading,
        error,
        quote,
        setQuote,
        requestDetail,
        siblingQuotes,
        isRejectModalOpen,
        setIsRejectModalOpen,
        isAccepting,
        handleAcceptQuote,
        handleRejectQuote,
    } = useQuoteViewDetail(quoteId, requestId);

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <Loader2 size={30} className="animate-spin text-[#ff4a1f]" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loading quotation specifications...</span>
                </div>
            </div>
        );
    }

    if (error || !quote) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3 text-slate-500 max-w-md text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[5px] shadow-sm">
                    <AlertCircle size={36} className="text-red-500" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Quote Not Found</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{error || 'Unable to display quote information.'}</p>
                    <Button variant="outline" size="sm" onClick={() => navigate('/customer/quotes/received')} className="mt-2 rounded-[5px]">
                        <ArrowLeft size={14} className="mr-1.5" /> Back to Quotes Received
                    </Button>
                </div>
            </div>
        );
    }

    const req = requestDetail || quote.quote_request || {};
    const isPending = (quote.status_raw || quote.status || '').toLowerCase() === 'pending';
    const isNegotiating = quote.revision_status === 'pending' || (quote.status || '').toLowerCase() === 'negotiating';
    const cleanQuoteId = String(quote.id || '');
    const cleanReqId = String(quote.quote_request_id || req.id || '');

    // List of quotes to compare (at least current quote if siblingQuotes is empty)
    const allQuotes = siblingQuotes && siblingQuotes.length > 0 ? siblingQuotes : [quote];

    // EXACT 3 CLEAN TABS
    const THREE_TABS = [
        { id: 'suppliers', label: 'Suppliers Quoted', icon: Users },
        { id: 'pricing', label: 'Quote & Payment Breakdown', icon: Euro },
        { id: 'specs', label: 'Route & Cargo Specifications', icon: Package },
    ];

    return (
        <div className="p-4 md:p-6 mx-auto bg-[#f8f9fa] dark:bg-[#12161b] min-h-screen pb-24 font-sans antialiased">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Quote {quote.quote_id || `QT-${cleanQuoteId.padStart(4, '0')}`}
                        </h1>
                        <Badge variant={isPending ? 'warning' : 'secondary'} className="text-[11px] font-semibold rounded-[5px]">
                            {quote.status || 'Pending Review'}
                        </Badge>
                    </div>
                    <p className="text-[13px] font-medium text-[#ff4a1f] mt-0.5">
                        For Request REQ-{cleanReqId || '—'}: {req?.request_title || 'Transportation quote specifications & supplier offer.'}
                    </p>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-[34px] text-[12px] border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer font-medium rounded-[5px]"
                        onClick={() => navigate(`/customer/quotes/negotiation/conversation/${encryptId(quote.id)}`)}
                    >
                        <MessageSquare size={14} className="text-[#ff4a1f]" />
                        <span>Chat & Negotiate</span>
                    </Button>

                    {(isPending || isNegotiating) && (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-[34px] text-[12px] border-orange-200 dark:border-orange-900/50 bg-orange-50/40 dark:bg-orange-950/20 text-[#ff4a1f] hover:bg-orange-100/60 dark:hover:bg-orange-900/40 flex items-center gap-1.5 cursor-pointer font-bold rounded-[5px]"
                                onClick={() => setIsCounterModalOpen(true)}
                            >
                                <TrendingDown size={14} />
                                <span>Counter Offer</span>
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-[34px] text-[12px] border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100/60 dark:hover:bg-red-900/40 flex items-center gap-1.5 cursor-pointer font-medium rounded-[5px]"
                                onClick={() => setIsRejectModalOpen(true)}
                            >
                                <XCircle size={14} />
                                <span>Decline Offer</span>
                            </Button>

                            <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                disabled={isAccepting}
                                className="h-[34px] text-[12px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white flex items-center gap-1.5 cursor-pointer font-bold shadow-2xs disabled:opacity-50 rounded-[5px]"
                                onClick={handleAcceptQuote}
                            >
                                {isAccepting ? (
                                    <Loader2 size={14} className="animate-spin text-white" />
                                ) : (
                                    <Check size={14} className="stroke-[2.5]" />
                                )}
                                <span>Accept & Book ({quote.amount})</span>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Main Layout: Sidebar on Left, Content on Right (Identical to create/new) */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Left Sidebar Navigation */}
                <div className="w-full lg:w-[260px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[5px] overflow-hidden shadow-2xs">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                            Specifications
                        </h3>
                    </div>
                    <div className="flex flex-col">
                        {THREE_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isSelected = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium transition-colors border-l-[3px] cursor-pointer ${
                                        isSelected
                                            ? 'border-l-[#ff4a1f] bg-orange-50/50 dark:bg-orange-950/20 text-[#ff4a1f] font-semibold'
                                            : 'border-l-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon size={15} className={isSelected ? 'text-[#ff4a1f]' : 'text-slate-400'} />
                                        <span>{tab.label}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {tab.id === 'suppliers' && allQuotes.length > 0 && (
                                            <span className="bg-orange-100 dark:bg-orange-950/60 text-[#ff4a1f] text-[10px] px-1.5 py-0.2 rounded-[5px] font-bold">
                                                {allQuotes.length}
                                            </span>
                                        )}
                                        {isSelected && <ChevronRight size={14} className="text-[#ff4a1f]" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[5px] shadow-2xs w-full p-5 md:p-6 space-y-6">
                    {/* TAB 1: Suppliers Who Quoted / Compare Offers */}
                    {activeTab === 'suppliers' && (
                        <ViewQuoteCompare
                            currentQuote={quote}
                            siblingQuotes={allQuotes}
                            onSelectQuote={(sq, targetTab) => {
                                setQuote(sq);
                                setActiveTab(targetTab || 'pricing');
                            }}
                            onAcceptQuote={(sq) => {
                                setQuote(sq);
                                handleAcceptQuote();
                            }}
                        />
                    )}

                    {/* TAB 2: Quote Details, User Details & Payment Breakdown */}
                    {activeTab === 'pricing' && (
                        <ViewQuotePricing
                            quote={quote}
                            cleanQuoteId={cleanQuoteId}
                            cleanReqId={cleanReqId}
                            requestDetail={req}
                        />
                    )}

                    {/* TAB 3: Route, Cargo & Shipping Specifications */}
                    {activeTab === 'specs' && (
                        <ViewQuoteRouteCargo
                            quote={quote}
                            requestDetail={req}
                        />
                    )}
                </div>
            </div>

            {/* Decline Offer Modal */}
            <DeclineOfferModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                offerAmount={quote?.amount_raw || (quote?.amount ? parseFloat(quote.amount.replace(/[^0-9.]/g, '')) : undefined)}
                currency="€"
                onConfirm={handleRejectQuote}
            />

            {/* Modern Submit Counter Offer Modal */}
            <CounterOfferModal
                isOpen={isCounterModalOpen}
                onClose={() => setIsCounterModalOpen(false)}
                originalOfferAmount={quote?.amount_raw || quote?.amount}
                targetBudget={req?.budget || req?.target_budget}
                carrierName={quote?.supplier_name || quote?.supplier?.company_name || quote?.supplier?.name}
                currency="€"
                onSubmit={(amt, note) => {
                    navigate(`/customer/quotes/negotiation/conversation/${encryptId(quote.id)}`, {
                        state: { autoCounterAmount: amt, autoCounterNote: note }
                    });
                }}
            />
        </div>
    );
}
