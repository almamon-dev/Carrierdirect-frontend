import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSubmitQuoteDetails } from './hooks/useSubmitQuoteDetails';
import { CustomerRouteCard } from './components/CustomerRouteCard';
import { SpecsTabs } from './components/SpecsTabs';
import { QuotationOfferForm } from './components/QuotationOfferForm';
import { QuoteRequestTimeline } from './components/QuoteRequestTimeline';
import { SubmittedOfferCard } from './components/SubmittedOfferCard';
import { QuoteSubmittedSuccessModal } from './components/QuoteSubmittedSuccessModal';
import { SubmitQuoteHeader } from './components/SubmitQuoteHeader';
import SubmitQuoteSkeleton from './SubmitQuoteSkeleton';
import { encryptId, decryptId } from '@/lib/encryption';

export default function SubmitQuote() {
    const navigate = useNavigate();
    const location = useLocation();
    const { slug } = useParams<{ slug?: string }>();

    const isFromMyQuotes = location.pathname.includes('/my-quotes') || location.state?.from === 'my-quotes';

    // Auto-encrypt plain URL parameters
    useEffect(() => {
        if (slug && (!slug.startsWith('enc_') || slug.length < 50)) {
            const raw = decryptId(slug).replace('REQ-', '').trim();
            if (raw) {
                const enc = encryptId(raw);
                const basePath = isFromMyQuotes
                    ? '/supplier/quotes/my-quotes'
                    : '/supplier/quotes/requests';
                navigate(`${basePath}/${enc}`, { replace: true, state: location.state });
            }
        }
    }, [slug, navigate, isFromMyQuotes, location.state]);

    // Fetch and normalize quote request details
    const { loading, requestDetails } = useSubmitQuoteDetails(slug);

    // Interaction & modal states
    const [isEditingOffer, setIsEditingOffer] = useState<boolean>(false);
    const [showBanner, setShowBanner] = useState<boolean>(true);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [submittedTotal, setSubmittedTotal] = useState<string>('0.00');
    const [submissionMeta, setSubmissionMeta] = useState<any>({});

    useEffect(() => {
        if (location.state?.editMode && !loading && requestDetails) {
            const quote = (requestDetails as any).quote_submitted;
            const rawQuoteStatus = String(quote?.status || '').toLowerCase().trim();
            const isTerminal = ['accepted', 'booked', 'won', 'completed', 'rejected', 'declined', 'cancelled', 'lost', 'expired'].includes(rawQuoteStatus);
            const hasNegotiation = rawQuoteStatus === 'negotiating' || rawQuoteStatus === 'negotiation' || quote?.revision_status === 'pending';
            const apiCanEdit = quote?.is_editable ?? quote?.can_edit ?? (requestDetails as any).can_edit_quote;
            const canEdit = apiCanEdit !== undefined
                ? Boolean(apiCanEdit)
                : (!isTerminal && !hasNegotiation && (rawQuoteStatus === 'submitted' || rawQuoteStatus === 'pending' || rawQuoteStatus === 'quoted' || rawQuoteStatus === 'active' || rawQuoteStatus === 'open' || rawQuoteStatus === 'draft'));

            if (canEdit) {
                setIsEditingOffer(true);
            }
        }
    }, [location.state, loading, requestDetails]);

    if (loading) {
        return <SubmitQuoteSkeleton />;
    }

    const quoteSubmitted = (requestDetails as any).quote_submitted;

    const isWon = Boolean(
        (requestDetails as any).is_won ||
        (requestDetails.status || '').toLowerCase() === 'won' ||
        (requestDetails.status || '').toLowerCase() === 'booked' ||
        quoteSubmitted?.status === 'accepted' ||
        quoteSubmitted?.status === 'won'
    );

    const isExpired = !isWon && Boolean(
        (requestDetails as any).is_expired ||
        (requestDetails.status || '').toLowerCase() === 'expired' ||
        (requestDetails.status || '').toLowerCase() === 'cancelled' ||
        (requestDetails.status || '').toLowerCase() === 'lost' ||
        (requestDetails as any).can_submit_quote === false
    );

    const isQuoted = isWon ||
        (requestDetails.status || '').toLowerCase() === 'quoted' ||
        (requestDetails.status || '').toLowerCase() === 'done' ||
        Boolean((requestDetails as any).isQuoted || (requestDetails as any).hasQuoted || quoteSubmitted);

    const submittedAt = quoteSubmitted?.submitted_at || quoteSubmitted?.created_at || requestDetails.requestDate || '';

    return (
        <div className="p-3 sm:p-5 w-full mx-auto min-h-screen font-sans antialiased space-y-3.5 sm:space-y-4 bg-[#f8fafc] dark:bg-[#12161c]">
            <SubmitQuoteHeader
                requestDetails={requestDetails}
                isFromMyQuotes={isFromMyQuotes}
                isQuoted={isQuoted}
                isWon={isWon}
                isExpired={isExpired}
                submittedAt={submittedAt}
                showBanner={showBanner}
                onDismissBanner={() => setShowBanner(false)}
            />

            {/* Split Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start">
                {/* LEFT PANEL: Customer, Route, Specifications & Timeline */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-3 sm:space-y-4">
                    <CustomerRouteCard requestDetails={requestDetails} />
                    <SpecsTabs requestDetails={requestDetails} />
                    {isQuoted && (
                        <QuoteRequestTimeline requestDetails={requestDetails} />
                    )}
                </div>

                {/* RIGHT PANEL: Submitted Offer Card OR Quotation Offer Form */}
                <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
                    {isQuoted && !isEditingOffer ? (
                        <SubmittedOfferCard 
                            requestDetails={requestDetails} 
                            onEditOffer={() => setIsEditingOffer(true)} 
                        />
                    ) : (
                        <QuotationOfferForm 
                            slug={slug}
                            requestDetails={requestDetails}
                            isEditing={isEditingOffer}
                            onCancelEdit={() => setIsEditingOffer(false)}
                            onSubmittedSuccess={(total, meta) => {
                                setSubmittedTotal(total);
                                if (meta) setSubmissionMeta(meta);
                                setSubmitted(true);
                                setIsEditingOffer(false);
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Quotation Submitted Centered Success Modal */}
            <QuoteSubmittedSuccessModal
                isOpen={submitted}
                onClose={() => setSubmitted(false)}
                requestDetails={requestDetails}
                totalOffer={submittedTotal}
                submissionMeta={submissionMeta}
            />
        </div>
    );
}
