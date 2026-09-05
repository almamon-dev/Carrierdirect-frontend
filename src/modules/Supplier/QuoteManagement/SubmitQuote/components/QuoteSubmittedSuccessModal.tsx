import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, MessageSquare } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { SubmittedModalHeader } from './modal/SubmittedModalHeader';
import { SubmittedRouteSection } from './modal/SubmittedRouteSection';
import { SubmittedSpecsSection } from './modal/SubmittedSpecsSection';
import { SubmittedPricingSection } from './modal/SubmittedPricingSection';

interface SubmissionMeta {
    extraCharges?: Array<{ type: string; customName?: string; amount: string }>;
    validity?: string;
    paymentTerm?: string;
    basePrice?: string;
}

interface QuoteSubmittedSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    requestDetails: QuoteRequest;
    totalOffer: string;
    submissionMeta?: SubmissionMeta;
}

export const QuoteSubmittedSuccessModal: React.FC<QuoteSubmittedSuccessModalProps> = ({
    isOpen,
    onClose,
    requestDetails,
    totalOffer,
    submissionMeta,
}) => {
    const navigate = useNavigate();
    const customerName = requestDetails.customer || 'Verified Shipper';
    const cleanId = String(requestDetails.rawId || requestDetails.id || '').replace('REQ-', '').trim();
    const numericOffer = parseFloat(totalOffer || '0');

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-[3px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-[13px] sm:text-[13.5px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                            Quotation Proposal Submitted
                        </h3>
                        <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal">
                            Commercial offer sent to {customerName} for RFQ {requestDetails.id || `REQ-${cleanId}`}
                        </p>
                    </div>
                </div>
            }
            size="2xl"
            className="!max-w-3xl w-full"
            showCloseButton={true}
        >
            <div className="flex flex-col font-sans max-h-[82vh] overflow-y-auto overflow-x-hidden px-1 space-y-3">
                <SubmittedModalHeader requestDetails={requestDetails} customerName={customerName} cleanId={cleanId} />
                <SubmittedRouteSection requestDetails={requestDetails} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pt-0.5">
                    <SubmittedSpecsSection
                        requestDetails={requestDetails}
                        validity={submissionMeta?.validity}
                        paymentTerm={submissionMeta?.paymentTerm}
                    />

                    <SubmittedPricingSection
                        basePrice={submissionMeta?.basePrice}
                        extraCharges={submissionMeta?.extraCharges}
                        numericOffer={numericOffer}
                    />
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-end gap-2">
                    <Button variant="outline" size="sm" className="text-xs h-8 px-3 font-medium rounded-[3px] text-slate-700 dark:text-slate-200 cursor-pointer" onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        variant="outline" size="sm"
                        className="text-xs h-8 px-3 font-medium rounded-[3px] border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50/60 hover:bg-indigo-100/80 cursor-pointer flex items-center gap-1.5"
                        onClick={() => { onClose(); navigate('/supplier/quotes/negotiation'); }}
                    >
                        <MessageSquare size={13} className="text-indigo-600 dark:text-indigo-400" /> View Negotiation
                    </Button>
                    <Button
                        variant="primary" size="sm"
                        className="text-xs h-8 px-3 font-medium rounded-[3px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-2xs cursor-pointer flex items-center gap-1.5"
                        onClick={() => { onClose(); navigate('/supplier/quotes/requests'); }}
                    >
                        <ArrowLeft size={13} /> Back to Requests
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default QuoteSubmittedSuccessModal;
