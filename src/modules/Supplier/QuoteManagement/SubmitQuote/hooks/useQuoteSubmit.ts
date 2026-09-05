import { useState } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useHeaderNotifications } from '@/hooks/useHeaderNotifications';
import { markRequestAsQuoted } from '../../utils/requestStatusTracker';
import { decryptId } from '@/lib/encryption';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { ExtraChargeItem } from '../components/ExtraChargesSection';

export interface SubmissionMeta {
    extraCharges?: Array<{ type: string; customName?: string; amount: string }>;
    validity?: string;
    paymentTerm?: string;
    basePrice?: string;
}

interface UseQuoteSubmitProps {
    slug?: string;
    requestDetails: QuoteRequest;
    price: string;
    extraCharges: ExtraChargeItem[];
    validity: string;
    customValidity: string;
    paymentTerm: string;
    customPaymentTerm: string;
    notes: string;
    isExpired: boolean;
    isStripeConnected: boolean | null;
    setShowConnectModal: (show: boolean) => void;
    onSubmittedSuccess: (total: string, meta?: SubmissionMeta) => void;
}

export const useQuoteSubmit = ({
    slug,
    requestDetails,
    price,
    extraCharges,
    validity,
    customValidity,
    paymentTerm,
    customPaymentTerm,
    notes,
    isExpired,
    isStripeConnected,
    setShowConnectModal,
    onSubmittedSuccess,
}: UseQuoteSubmitProps) => {
    const { addNotification } = useHeaderNotifications('supplier');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const calculateBasePrice = () => parseFloat(price) || 0;
    const calculateExtras = () => extraCharges.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
    const calculateTotal = () => (calculateBasePrice() + calculateExtras()).toFixed(2);

    const handleSubmit = async () => {
        if (isExpired) {
            setErrorMessage('This quote request has expired and is no longer accepting submissions.');
            return;
        }
        if (isStripeConnected === false) {
            setShowConnectModal(true);
            return;
        }

        const rawCleanId = String(requestDetails.rawId || (slug ? (slug.startsWith('enc_') ? decryptId(slug) : slug) : '') || requestDetails.id || '1').replace('REQ-', '').trim();
        const cleanId = rawCleanId || '1';
        const effectiveValidity = validity === 'custom' ? (customValidity || 'Custom Duration') : validity;
        const effectivePaymentTerm = paymentTerm === 'custom' ? (customPaymentTerm || 'Custom Terms') : paymentTerm;

        setIsSubmitting(true);
        setErrorMessage(null);
        const finalTotal = calculateTotal();
        const cargoDesc = requestDetails.cargoItems?.[0]?.name || requestDetails.vehicleType || 'Cargo Shipment';

        try {
            await apiClient.post(ENDPOINTS.SUPPLIER.SUBMIT_QUOTE(cleanId), {
                amount: parseFloat(finalTotal),
                base_amount: parseFloat(price) || 0,
                estimated_time: effectiveValidity,
                payment_terms: effectivePaymentTerm,
                notes: notes || 'Standard offer',
                extra_charges: extraCharges
                    .filter(c => c.type && parseFloat(c.amount) > 0)
                    .map(c => ({
                        type: c.type,
                        custom_name: c.type === 'Custom' ? c.customName : c.type,
                        amount: parseFloat(c.amount) || 0
                    }))
            });

            addNotification({
                title: 'Quotation Submitted',
                desc: `Your quotation of € ${finalTotal} has been submitted successfully for ${cargoDesc} (${requestDetails.pickup} → ${requestDetails.delivery}).`,
                type: 'quote',
                time: 'Just now',
                link: '/supplier/quotes/requests'
            });

            const submissionPayloadMeta: SubmissionMeta = {
                extraCharges: extraCharges.filter(c => c.type && parseFloat(c.amount) > 0),
                validity: effectiveValidity,
                paymentTerm: effectivePaymentTerm,
                basePrice: price,
            };

            markRequestAsQuoted(cleanId, finalTotal, submissionPayloadMeta);
            setIsSubmitting(false);
            onSubmittedSuccess(finalTotal, submissionPayloadMeta);
        } catch (err: any) {
            console.error('Failed to submit quote via API', err);
            const msg = err?.response?.data?.message || err?.message || 'Failed to submit quote.';
            setErrorMessage(msg);
            setIsSubmitting(false);
        }
    };

    return {
        isSubmitting,
        errorMessage,
        calculateTotal,
        handleSubmit,
    };
};
