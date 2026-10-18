import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';

export const MIN_WITHDRAWAL_AMOUNT = 50;

export function useWithdrawFundsState() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const showToast = useToastStore((state) => state.showToast);

    const [walletData, setWalletData] = useState<any>(null);
    const [isLoadingWallet, setIsLoadingWallet] = useState<boolean>(true);

    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<'stripe' | 'bank'>('stripe');
    const [bankName, setBankName] = useState<string>('');
    const [accountHolder, setAccountHolder] = useState<string>('');
    const [iban, setIban] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [agreedTerms, setAgreedTerms] = useState<boolean>(false);

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchWalletDetails = async () => {
        setIsLoadingWallet(true);
        try {
            const res = await apiClient.get('/supplier/wallet');
            const data = res.data?.data || res.data || {};
            setWalletData(data);

            const isStripeConn = Boolean(
                data.stripe_account?.is_connected ||
                data.connected_account?.is_connected
            );
            setMethod(isStripeConn ? 'stripe' : 'bank');

            const queryAmt = searchParams.get('amount');
            if (queryAmt && !isNaN(Number(queryAmt)) && Number(queryAmt) >= MIN_WITHDRAWAL_AMOUNT) {
                setAmount(Number(queryAmt).toFixed(2));
            }
        } catch (err: any) {
            console.error('Failed to load wallet details:', err);
            setError(err?.response?.data?.message || err?.message || 'Unable to load wallet balance.');
        } finally {
            setIsLoadingWallet(false);
        }
    };

    useEffect(() => {
        fetchWalletDetails();
    }, []);

    const availableBalance: number = typeof walletData?.stats?.available_balance === 'number'
        ? walletData.stats.available_balance
        : (parseFloat(String(walletData?.stats?.available_balance || 0).replace(/[^0-9.-]/g, '')) || 0);

    const stripeAccount = walletData?.stripe_account || walletData?.connected_account;
    const isStripeConnected = Boolean(stripeAccount?.is_connected);

    const numAmount = parseFloat(amount) || 0;
    const isBelowMin = numAmount > 0 && numAmount < MIN_WITHDRAWAL_AMOUNT;
    const isOverBalance = numAmount > availableBalance;
    const isValidAmount = numAmount >= MIN_WITHDRAWAL_AMOUNT && numAmount <= availableBalance;

    const handleSelectPreset = (preset: number) => {
        if (availableBalance < MIN_WITHDRAWAL_AMOUNT) return;
        const target = Math.min(preset, availableBalance);
        setAmount(target.toFixed(2));
        setError(null);
    };

    const handleSetMax = () => {
        if (availableBalance < MIN_WITHDRAWAL_AMOUNT) return;
        setAmount(availableBalance.toFixed(2));
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
            setError(`Requested amount (€${numAmount.toFixed(2)}) exceeds your available balance (€${availableBalance.toFixed(2)}).`);
            return;
        }

        if (method === 'bank' && !iban.trim()) {
            setError('Please provide a valid IBAN / Account Number for SEPA bank transfer.');
            return;
        }

        if (!agreedTerms) {
            setError('You must read and agree to the Withdrawal Terms & Conditions before requesting.');
            return;
        }

        setIsSubmitting(true);

        const paymentMethodLabel = method === 'stripe' ? 'Stripe Connect' : 'Bank Transfer';
        const accountDetails = method === 'stripe'
            ? `Stripe Express (${stripeAccount?.account_id || 'Connected Account'})`
            : `Bank: ${bankName || '-'}, Holder: ${accountHolder || '-'}, IBAN: ${iban.trim()}`;

        try {
            const res = await apiClient.post('/supplier/wallet/withdraw', {
                amount: numAmount,
                payment_method: paymentMethodLabel,
                account_details: accountDetails,
                notes: notes.trim() || undefined,
            });

            const msg = res.data?.message || 'Withdrawal request submitted successfully! Funds will be reviewed and disbursed.';
            setSuccessMessage(msg);
            showToast(msg, 'success');

            setTimeout(() => {
                navigate('/supplier/wallet');
            }, 1800);
        } catch (err: any) {
            console.error('Withdrawal submission error:', err);
            const msg = err?.response?.data?.message || err?.message || 'Failed to submit withdrawal request.';
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        navigate,
        walletData,
        isLoadingWallet,
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
        agreedTerms,
        setAgreedTerms,
        isSubmitting,
        error,
        setError,
        successMessage,
        availableBalance,
        stripeAccount,
        isStripeConnected,
        numAmount,
        isBelowMin,
        isOverBalance,
        isValidAmount,
        handleSelectPreset,
        handleSetMax,
        handleSubmit,
    };
}
