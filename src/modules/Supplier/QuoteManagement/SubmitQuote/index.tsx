/**
 * Supplier Quote Management - Quote Request Details & Submit Offer Page
 * Displays full customer freight RFQ with customer profile, route overview,
 * 2-column cargo & vehicle specs tabs, and the quotation proposal form.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import Button from '@/components/ui/button';
import { useSubmitQuoteDetails } from './hooks/useSubmitQuoteDetails';
import { CustomerRouteCard } from './components/CustomerRouteCard';
import { SpecsTabs } from './components/SpecsTabs';
import { QuotationOfferForm } from './components/QuotationOfferForm';
import { QuoteSubmittedSuccessModal } from './components/QuoteSubmittedSuccessModal';
import { exportQuoteRequestPDF } from './utils/exportQuoteRequestPdf';
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

    if (loading) {
        return <SubmitQuoteSkeleton />;
    }

    const isExpired = Boolean(
        (requestDetails as any).is_expired ||
        (requestDetails.status || '').toLowerCase() === 'expired' ||
        (requestDetails.status || '').toLowerCase() === 'cancelled' ||
        (requestDetails.status || '').toLowerCase() === 'completed' ||
        (requestDetails as any).can_submit_quote === false
    );

    return (
        <div className="p-3.5 sm:p-5 w-full mx-auto min-h-screen font-sans antialiased space-y-4 bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Top Navigation & Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <button 
                        type="button"
                        onClick={() => navigate('/supplier/quotes/requests')} 
                        className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center transition-colors font-normal mb-1 cursor-pointer"
                    >
                        <ArrowLeft size={13} className="mr-1 text-slate-400" /> Back to Quote Requests
                    </button>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                            Quote Request: {requestDetails.id}
                        </h1>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                            isExpired
                                ? 'bg-rose-50/80 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
                                : 'bg-emerald-50/80 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isExpired ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            <span>{isExpired ? 'Expired' : (requestDetails.status || 'Active')}</span>
                            <span className="opacity-40">•</span>
                            <span className="font-normal opacity-90">{requestDetails.priority || 'Normal'}</span>
                        </span>
                    </div>
                </div>

                {/* Header Action Toolbar */}
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs font-medium rounded-[3px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1.5"
                        onClick={() => exportQuoteRequestPDF(requestDetails)}
                    >
                        <Download size={13} className="text-slate-400 shrink-0" />
                        <span>Export PDF</span>
                    </Button>
                </div>
            </div>

            {/* Split Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* LEFT PANEL: Customer, Route & Specifications */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-3.5">
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
