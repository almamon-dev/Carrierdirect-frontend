/**
 * Supplier Quote Management - Quote Request Details & Submit Offer Page
 * Displays full customer freight RFQ with customer profile, route overview,
 * 2-column cargo & vehicle specs tabs, and the quotation proposal form.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, XCircle, Send } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { useSubmitQuoteDetails } from './hooks/useSubmitQuoteDetails';
import { CustomerRouteCard } from './components/CustomerRouteCard';
import { SpecsTabs } from './components/SpecsTabs';
import { QuotationOfferForm } from './components/QuotationOfferForm';
import { DeclineModal } from './components/DeclineModal';
import { QuoteSubmittedSuccessModal } from './components/QuoteSubmittedSuccessModal';
import { DeclinedView } from './components/SubmissionStatusViews';
import SubmitQuoteSkeleton from './SubmitQuoteSkeleton';
import { encryptId, decryptId } from '@/lib/encryption';

export default function SubmitQuote() {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug?: string }>();

    // Auto-encrypt plain URL parameters (e.g. /supplier/quotes/requests/122 -> /supplier/quotes/requests/enc_...)
    useEffect(() => {
        if (slug && (!slug.startsWith('enc_') || slug.length < 50)) {
            const raw = decryptId(slug).replace('REQ-', '').trim();
            if (raw) {
                const enc = encryptId(raw);
                try {
                    sessionStorage.setItem('carrierdirect_last_quote_session_id', raw);
                } catch {}
                navigate(`/supplier/quotes/requests/${enc}`, { replace: true });
            }
        }
    }, [slug, navigate]);

    // Fetch and normalize quote request details
    const { loading, requestDetails } = useSubmitQuoteDetails(slug);

    // Interaction & modal states
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [submittedTotal, setSubmittedTotal] = useState<string>('0.00');
    const [submissionMeta, setSubmissionMeta] = useState<any>({});
    const [declined, setDeclined] = useState<boolean>(false);
    const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false);

    if (loading) {
        return <SubmitQuoteSkeleton />;
    }

    if (declined) {
        return <DeclinedView requestDetails={requestDetails} />;
    }

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-5 bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Top Navigation & Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <button 
                        type="button"
                        onClick={() => navigate('/supplier/quotes/requests')} 
                        className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 flex items-center transition-colors font-medium mb-1 cursor-pointer"
                    >
                        <ArrowLeft size={13} className="mr-1" /> Back to Quote Requests
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Quote Request: {requestDetails.id}
                        </h1>
                        <Badge 
                            variant="secondary" 
                            className="bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60 font-semibold text-xs px-2 py-0.5"
                        >
                            {requestDetails.status || 'active'}
                        </Badge>
                        <Badge 
                            variant="secondary" 
                            className="bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 font-semibold text-xs px-2 py-0.5"
                        >
                            {requestDetails.priority || 'Normal'}
                        </Badge>
                    </div>
                </div>

                {/* Header Action Toolbar */}
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        onClick={() => alert(`Exporting ${requestDetails.id}...`)}
                    >
                        <Download size={13} className="mr-1 text-slate-500" /> Export PDF
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-800 cursor-pointer"
                        onClick={() => setShowDeclineModal(true)}
                    >
                        <XCircle size={13} className="mr-1" /> Decline
                    </Button>
                    <Button 
                        variant="primary" 
                        size="sm" 
                        className="h-8 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-2xs cursor-pointer"
                        onClick={() => {
                            const el = document.getElementById('offer-price-input');
                            if (el) el.focus();
                        }}
                    >
                        <Send size={13} className="mr-1" /> Submit Quote
                    </Button>
                </div>
            </div>

            {/* Split Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* LEFT PANEL: Customer, Route & Specifications */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                    {/* Card 1 & 2: Shipper Details, Target Budget & Route */}
                    <CustomerRouteCard requestDetails={requestDetails} />

                    {/* Card 3: 2-Column Specs Tabs (Cargo Dimensions + Vehicle Specs) */}
                    <SpecsTabs requestDetails={requestDetails} />
                </div>

                {/* RIGHT PANEL: Quotation Offer Submission Form */}
                <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
                    <QuotationOfferForm 
                        slug={slug}
                        requestDetails={requestDetails}
                        onSubmittedSuccess={(total, meta) => {
                            setSubmittedTotal(total);
                            if (meta) setSubmissionMeta(meta);
                            setSubmitted(true);
                        }}
                    />
                </div>
            </div>

            {/* Decline Confirmation Modal */}
            <DeclineModal 
                isOpen={showDeclineModal}
                requestId={requestDetails.id}
                onClose={() => setShowDeclineModal(false)}
                onConfirmDecline={() => {
                    setShowDeclineModal(false);
                    setDeclined(true);
                }}
            />

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
