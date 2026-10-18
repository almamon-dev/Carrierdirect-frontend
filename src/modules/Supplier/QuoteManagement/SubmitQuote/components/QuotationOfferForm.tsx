import CompliancePendingModal from '@/components/common/CompliancePendingModal';
import SupplierAccountConnectModal from '@/components/modals/supplier-connect-modal';
import Input from '@/components/ui/input';
import FormLabel from '@/components/ui/label';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { SubmissionMeta, useQuoteSubmit } from '../hooks/useQuoteSubmit';
import { useStripeConnectCheck } from '../hooks/useStripeConnectCheck';
import { CommercialRemarksSection } from './CommercialRemarksSection';
import { ExtraChargeItem, ExtraChargesSection } from './ExtraChargesSection';
import { OfferFormHeader } from './OfferFormHeader';
import { OfferSubmitButtons } from './OfferSubmitButtons';
import { OfferTermsSection } from './OfferTermsSection';
import { PriceBreakdownCard } from './PriceBreakdownCard';

export type { SubmissionMeta };

interface QuotationOfferFormProps {
    slug?: string;
    requestDetails: QuoteRequest;
    isEditing?: boolean;
    onCancelEdit?: () => void;
    onSubmittedSuccess: (total: string, meta?: SubmissionMeta) => void;
}

export const QuotationOfferForm: React.FC<QuotationOfferFormProps> = ({
    slug,
    requestDetails,
    isEditing = false,
    onCancelEdit,
    onSubmittedSuccess,
}) => {
    const navigate = useNavigate();
    const [price, setPrice] = useState<string>('');
    const [extraCharges, setExtraCharges] = useState<ExtraChargeItem[]>([]);
    const [notes, setNotes] = useState<string>('');
    const [validity, setValidity] = useState<string>('48h');
    const [customValidity, setCustomValidity] = useState<string>('');
    const [paymentTerm, setPaymentTerm] = useState<string>('net15');
    const [customPaymentTerm, setCustomPaymentTerm] = useState<string>('');

    const { isStripeConnected, isCheckingConnect, showConnectModal, setShowConnectModal } = useStripeConnectCheck();
    const [showComplianceModal, setShowComplianceModal] = useState<boolean>(false);

    const isWon = Boolean(
        (requestDetails as any).is_won ||
        (requestDetails.status || '').toLowerCase() === 'won' ||
        (requestDetails.status || '').toLowerCase() === 'booked' ||
        (requestDetails as any).quote_submitted?.status === 'accepted' ||
        (requestDetails as any).quote_submitted?.status === 'won'
    );

    const isExpired = !isWon && Boolean(
        (requestDetails as any).is_expired ||
        (requestDetails.status || '').toLowerCase() === 'expired' ||
        (requestDetails.status || '').toLowerCase() === 'cancelled' ||
        (requestDetails.status || '').toLowerCase() === 'lost' ||
        (requestDetails as any).can_submit_quote === false
    );

    useEffect(() => {
        const submitted = (requestDetails as any).quote_submitted;
        if (submitted && (submitted.base_amount || submitted.amount)) {
            setPrice(String(submitted.base_amount || submitted.amount));
            if (submitted.notes) setNotes(submitted.notes);
            if (submitted.extra_charges && Array.isArray(submitted.extra_charges)) {
                setExtraCharges(submitted.extra_charges);
            }
            if (submitted.validity) setValidity(submitted.validity);
            if (submitted.payment_term) setPaymentTerm(submitted.payment_term);
        } else if (!price && requestDetails.budget && requestDetails.budget !== '—' && requestDetails.budget !== 'Open / Flexible' && requestDetails.budget !== 'Negotiable') {
            const numeric = requestDetails.budget.replace(/[^0-9.]/g, '');
            if (numeric && parseFloat(numeric) > 0) setPrice(numeric);
        }
    }, [requestDetails]);

    const { isSubmitting, errorMessage, calculateTotal, handleSubmit } = useQuoteSubmit({
        slug,
        requestDetails,
        price,
        extraCharges,
        validity,
        customValidity,
        paymentTerm,
        customPaymentTerm,
        notes,
        isExpired: isExpired || isWon,
        isStripeConnected,
        setShowConnectModal,
        setShowComplianceModal,
        onSubmittedSuccess,
    });

    const applyBudgetPreset = () => {
        if (isExpired || isWon) return;
        const numericBudget = (requestDetails.budget || '').replace(/[^0-9.]/g, '');
        if (numericBudget) setPrice(numericBudget);
        else setPrice('450');
    };

    const basePriceNum = parseFloat(price) || 0;
    const totalAmountNum = parseFloat(calculateTotal()) || 0;

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs p-3.5 sm:p-4 space-y-3 sticky top-6 font-sans w-full overflow-hidden">
            {isEditing && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                        Editing Your Offer
                    </span>
                    {onCancelEdit && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                        >
                            <X size={13} />
                            <span>Cancel</span>
                        </button>
                    )}
                </div>
            )}

            <OfferFormHeader
                requestId={requestDetails.id}
                isWon={isWon}
                isExpired={isExpired}
                errorMessage={errorMessage}
                isStripeConnected={isStripeConnected}
                isCheckingConnect={isCheckingConnect}
                onOpenConnect={() => setShowConnectModal(true)}
            />

            <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                    <FormLabel required className="font-semibold text-slate-800 dark:text-slate-200 mb-0 text-xs shrink-0">Base Freight Price</FormLabel>
                    {requestDetails.budget && requestDetails.budget !== '—' && (
                        <div className="flex items-center gap-1.5 text-[11px] truncate">
                            <span className="text-slate-400">Budget: <strong className="font-semibold text-slate-700 dark:text-slate-300">{requestDetails.budget}</strong></span>
                            {!isExpired && !isWon && <button type="button" onClick={applyBudgetPreset} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium hover:underline cursor-pointer">(Match)</button>}
                        </div>
                    )}
                </div>
                <Input
                    id="offer-price-input"
                    type="number"
                    disabled={isExpired || isWon}
                    placeholder="0.00"
                    icon={<span className="text-slate-400 dark:text-slate-500 font-medium text-xs">€</span>}
                    rightIcon={<span className="text-slate-400 text-[11px] font-normal">EUR</span>}
                    className="font-semibold text-xs !h-8 border-slate-300 dark:border-slate-700 rounded-[3px]"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>

            {!isExpired && !isWon && <ExtraChargesSection extraCharges={extraCharges} onChange={setExtraCharges} />}

            <OfferTermsSection
                validity={validity} setValidity={setValidity}
                customValidity={customValidity} setCustomValidity={setCustomValidity}
                paymentTerm={paymentTerm} setPaymentTerm={setPaymentTerm}
                customPaymentTerm={customPaymentTerm} setCustomPaymentTerm={setCustomPaymentTerm}
                isExpired={isExpired || isWon}
            />

            <CommercialRemarksSection notes={notes} onChange={setNotes} isExpired={isExpired || isWon} />

            {totalAmountNum > 0 && (
                <PriceBreakdownCard
                    basePrice={basePriceNum}
                    extraCharges={extraCharges}
                    totalAmount={totalAmountNum}
                    isExpired={isExpired || isWon}
                    isStripeConnected={isStripeConnected}
                    onOpenConnect={() => setShowConnectModal(true)}
                />
            )}

            <OfferSubmitButtons
                isWon={isWon}
                isExpired={isExpired}
                isEditing={isEditing}
                onCancelEdit={onCancelEdit}
                isSubmitting={isSubmitting}
                totalAmountNum={totalAmountNum}
                onSubmit={handleSubmit}
            />

            <SupplierAccountConnectModal isOpen={showConnectModal} onClose={() => setShowConnectModal(false)} requestId={requestDetails.id} />
            <CompliancePendingModal isOpen={showComplianceModal} onClose={() => setShowComplianceModal(false)} />
        </div>
    );
};

export default QuotationOfferForm;
