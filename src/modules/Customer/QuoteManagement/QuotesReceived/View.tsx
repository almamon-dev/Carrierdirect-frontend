import { useState } from 'react';
import {
    Loader2, AlertCircle, Euro, Package, ArrowLeft, Users
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';
import { DeclineOfferModal } from '../Negotiation/Chat/components/DeclineOfferModal';
import { CounterOfferModal } from '../Negotiation/Actions/components/CounterOfferModal';
import { useQuoteViewDetail } from './hooks/useQuoteViewDetail';
import { ViewQuoteCompare } from './sections/ViewQuoteCompare';
import { ViewQuotePricing } from './sections/ViewQuotePricing';
import { ViewQuoteRouteCargo } from './sections/ViewQuoteRouteCargo';
import { getQuoteStatusInfo } from './components/QuotesReceivedCells';
import { QuoteViewHeader } from './components/QuoteViewHeader';
import { QuoteViewSidebar, QuoteViewTab } from './components/QuoteViewSidebar';

const THREE_TABS: QuoteViewTab[] = [
    { id: 'suppliers', label: 'Suppliers Quoted', icon: Users },
    { id: 'pricing', label: 'Quote & Payment Breakdown', icon: Euro },
    { id: 'specs', label: 'Route & Cargo Specifications', icon: Package },
];

export default function QuoteView() {
    const navigate = useNavigate();
    const { quoteId, requestId } = useParams();
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
                <div className="flex flex-col items-center gap-3 text-slate-500 max-w-md text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[3px] shadow-sm">
                    <AlertCircle size={36} className="text-red-500" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Quote Not Found</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{error || 'Unable to display quote information.'}</p>
                    <Button variant="outline" size="sm" onClick={() => navigate('/customer/quotes/received')} className="mt-2 rounded-[3px]">
                        <ArrowLeft size={14} className="mr-1.5" /> Back to Quotes Received
                    </Button>
                </div>
            </div>
        );
    }

    const req = requestDetail || quote.quote_request || {};
    const statusInfo = getQuoteStatusInfo(quote);
    const isBooked = statusInfo.statusKey === 'booked' || (quote.status || '').toLowerCase() === 'booked';
    const isExpired = !isBooked && Boolean(statusInfo.isExpired || (quote as any).is_expired || (quote.status || '').toLowerCase() === 'expired' || (req.status || '').toLowerCase() === 'expired');
    const isPending = !isExpired && !isBooked && ['pending', 'new', 'submitted'].includes((quote.status_raw || quote.status || '').toLowerCase());
    const isNegotiating = !isExpired && !isBooked && (quote.revision_status === 'pending' || (quote.status || '').toLowerCase() === 'negotiating');
    const cleanQuoteId = String(quote.id || '');
    const cleanReqId = String(quote.quote_request_id || req.id || '');
    const allQuotes = siblingQuotes && siblingQuotes.length > 0 ? siblingQuotes : [quote];

    return (
        <div className="p-4 md:p-6 mx-auto bg-[#f8f9fa] dark:bg-[#12161b] min-h-screen pb-24 font-sans antialiased">
            <QuoteViewHeader
                quote={quote}
                req={req}
                statusInfo={statusInfo}
                isPending={isPending}
                isNegotiating={isNegotiating}
                isAccepting={isAccepting}
                cleanQuoteId={cleanQuoteId}
                cleanReqId={cleanReqId}
                onNavigateChat={() => navigate(`/customer/quotes/negotiation/conversation/${encryptId(quote.id)}`)}
                onOpenCounter={() => setIsCounterModalOpen(true)}
                onOpenReject={() => setIsRejectModalOpen(true)}
                onAccept={handleAcceptQuote}
            />

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <QuoteViewSidebar
                    tabs={THREE_TABS}
                    activeTab={activeTab}
                    onSelectTab={setActiveTab}
                    allQuotesCount={allQuotes.length}
                />

                <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3px] shadow-2xs w-full p-4 md:p-5 space-y-4">
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

                    {activeTab === 'pricing' && (
                        <ViewQuotePricing
                            quote={quote}
                            cleanQuoteId={cleanQuoteId}
                            cleanReqId={cleanReqId}
                            requestDetail={req}
                        />
                    )}

                    {activeTab === 'specs' && (
                        <ViewQuoteRouteCargo
                            quote={quote}
                            requestDetail={req}
                        />
                    )}
                </div>
            </div>

            <DeclineOfferModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                offerAmount={quote?.amount_raw || (quote?.amount ? parseFloat(quote.amount.replace(/[^0-9.]/g, '')) : undefined)}
                currency="€"
                onConfirm={handleRejectQuote}
            />

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
