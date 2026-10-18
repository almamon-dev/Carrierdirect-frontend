import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

export const MIN_WITHDRAWAL_AMOUNT = 50;

interface UseWithdrawModalStateProps {
    isOpen: boolean;
    availableBalance: number;
    initialAmount?: number | string;
    stripeAccount?: {
        is_connected: boolean;
        account_id?: string | null;
        country?: string;
    };
    onSuccess: () => void;
    onClose: () => void;
}

export function useWithdrawModalState({
    isOpen,
    availableBalance,
    initialAmount,
    stripeAccount,
    onSuccess,
    onClose,
}: UseWithdrawModalStateProps) {
    const isStripeConnected = Boolean(stripeAccount?.is_connected);

    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<'stripe' | 'bank'>('stripe');
    const [bankName, setBankName] = useState<string>('');
    const [accountHolder, setAccountHolder] = useState<string>('');
    const [iban, setIban] = useState<string>('');
    const [notes, setNotes] = useState<string>('');

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialAmount !== undefined && initialAmount !== null && Number(initialAmount) > 0) {
                setAmount(String(initialAmount));
            } else {
                setAmount('');
            }
            setError(null);
            setSuccessMessage(null);
            setMethod(isStripeConnected ? 'stripe' : 'bank');
        }
    }, [isOpen, isStripeConnected, initialAmount]);

    const numAmount = parseFloat(amount) || 0;
    const isBelowMin = numAmount > 0 && numAmount < MIN_WITHDRAWAL_AMOUNT;
    const isOverBalance = numAmount > availableBalance;
    const isValidAmount = numAmount >= MIN_WITHDRAWAL_AMOUNT && numAmount <= availableBalance;

    const handleSetMax = () => {
        if (availableBalance < MIN_WITHDRAWAL_AMOUNT) return;
        setAmount(availableBalance.toFixed(2));
        setError(null);
    };

    const handlePresetAmount = (preset: number) => {
        if (availableBalance < MIN_WITHDRAWAL_AMOUNT) return;
        const target = Math.min(preset, availableBalance);
        setAmount(target.toFixed(2));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (numAmount < MIN_WITHDRAWAL_AMOUNT) {
            setError(`Minimum withdrawal amount is €${MIN_WITHDRAWAL_AMOUNT.toFixed(2)}.`);
            return;
        }

        if (numAmount > availableBalance) {
            setError(`Requested amount (€${numAmount.toFixed(2)}) exceeds available balance (€${availableBalance.toFixed(2)}).`);
            return;
        }

        if (method === 'bank' && !iban.trim()) {
            setError('Please enter your IBAN / Account Number for bank transfer.');
            return;
        }

        setIsSubmitting(true);

        const paymentMethodLabel = method === 'stripe' ? 'Stripe Connect' : 'Bank Transfer';
        const accountDetails = method === 'stripe'
            ? `Stripe Account (${stripeAccount?.account_id || 'Connected Account'})`
            : `Bank: ${bankName || '-'}, Holder: ${accountHolder || '-'}, IBAN: ${iban}`;

        try {
            const res = await apiClient.post('/supplier/wallet/withdraw', {
                amount: numAmount,
                payment_method: paymentMethodLabel,
                account_details: accountDetails,
                notes: notes.trim() || undefined,
            });

            setSuccessMessage(res.data?.message || 'Withdrawal request submitted successfully! Funds will be reviewed and disbursed.');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (err: any) {
            console.error('Withdrawal submission error:', err);
            const msg = err?.response?.data?.message || err?.message || 'Failed to submit withdrawal request.';
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        amount,
        setAmount,
        method,
        setMethod,
        bankName,
        setBankName,
        accountHolder,
        setAccountHolder,
        iban,
        setIban,
        notes,
        setNotes,
        isSubmitting,
        error,
        setError,
        successMessage,
        numAmount,
        isBelowMin,
        isOverBalance,
        isValidAmount,
        handleSetMax,
        handlePresetAmount,
        handleSubmit,
    };
}
