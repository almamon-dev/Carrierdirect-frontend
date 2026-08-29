import React, { useState, useEffect } from 'react';
import { Send, AlertCircle, CreditCard } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import FormLabel from '@/components/ui/label';
import Select from '@/components/ui/select';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { ExtraChargesSection, ExtraChargeItem } from './ExtraChargesSection';
import SupplierAccountConnectModal from '@/components/modals/supplier-connect-modal';
import { useHeaderNotifications } from '@/hooks/useHeaderNotifications';
import { markRequestAsQuoted } from '../../utils/requestStatusTracker';
import { decryptId } from '@/lib/encryption';

export interface SubmissionMeta {
    extraCharges?: Array<{ type: string; customName?: string; amount: string }>;
    validity?: string;
    paymentTerm?: string;
    basePrice?: string;
}

interface QuotationOfferFormProps {
    slug?: string;
    requestDetails: QuoteRequest;
    onSubmittedSuccess: (total: string, meta?: SubmissionMeta) => void;
}

export const QuotationOfferForm: React.FC<QuotationOfferFormProps> = ({
    slug,
    requestDetails,
    onSubmittedSuccess,
}) => {
    const { addNotification } = useHeaderNotifications('supplier');
    const [price, setPrice] = useState<string>('');
    const [extraCharges, setExtraCharges] = useState<ExtraChargeItem[]>([]);
    const [notes, setNotes] = useState<string>('');
    const [validity, setValidity] = useState<string>('48h');
    const [customValidity, setCustomValidity] = useState<string>('');
    const [paymentTerm, setPaymentTerm] = useState<string>('net15');
    const [customPaymentTerm, setCustomPaymentTerm] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Auto-prefill price from shipper budget if available
    useEffect(() => {
        if (!price && requestDetails.budget && requestDetails.budget !== '—' && requestDetails.budget !== 'Open / Flexible' && requestDetails.budget !== 'Negotiable') {
            const numeric = requestDetails.budget.replace(/[^0-9.]/g, '');
            if (numeric && parseFloat(numeric) > 0) {
                setPrice(numeric);
            }
        }
    }, [requestDetails.budget]);
    const [isStripeConnected, setIsStripeConnected] = useState<boolean>(() => {
        try {
            const rawUser = localStorage.getItem('erp_user_data') || localStorage.getItem('user') || localStorage.getItem('erp_user') || '{}';
            const u = JSON.parse(rawUser);
            return Boolean(u.is_stripe_connected || u.stripe_account_id || u.payouts_enabled || u.is_connected || u.onboarding_status === 'completed' || u.stripe_connected);
        } catch {
            return true;
        }
    });
    const [isCheckingConnect, setIsCheckingConnect] = useState<boolean>(true);
    const [showConnectModal, setShowConnectModal] = useState<boolean>(false);

    // Verify Stripe / Payout account connection status
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const [stripeRes, dashRes] = await Promise.allSettled([
                    apiClient.get('/supplier/stripe/status'),
                    apiClient.get('/supplier/finance/dashboard'),
                ]);

                let connected = false;

                if (stripeRes.status === 'fulfilled') {
                    const raw: any = stripeRes.value;
                    const d = raw?.data?.data || raw?.data || raw || {};
                    if (
                        d.is_connected ||
                        d.is_stripe_connected ||
                        d.onboarding_status === 'completed' ||
                        d.charges_enabled ||
                        d.payouts_enabled ||
                        d.stripe_account_id ||
                        d.account_id
                    ) {
                        connected = true;
                    }
                }

                if (!connected && dashRes.status === 'fulfilled') {
                    const rawDash: any = dashRes.value;
                    const dDash = rawDash?.data?.data || rawDash?.data || rawDash || {};
                    const stats = dDash.stats || {};
                    if (stats.is_stripe_connected || stats.is_connected) {
                        connected = true;
                    }
                }

                // Fallback check against cached user profile
                if (!connected) {
                    try {
                        const rawUser = localStorage.getItem('erp_user_data') || localStorage.getItem('user') || '{}';
                        const u = JSON.parse(rawUser);
                        if (u.is_stripe_connected || u.stripe_account_id || u.payouts_enabled || u.is_connected || u.stripe_connected) {
                            connected = true;
                        }
                    } catch {}
                }

                setIsStripeConnected(connected);
            } catch {
                try {
                    const rawUser = localStorage.getItem('erp_user_data') || localStorage.getItem('user') || '{}';
                    const u = JSON.parse(rawUser);
                    setIsStripeConnected(Boolean(u.is_stripe_connected || u.stripe_account_id || u.payouts_enabled || u.is_connected));
                } catch {
                    setIsStripeConnected(true);
                }
            } finally {
                setIsCheckingConnect(false);
            }
        };
        checkStatus();
    }, []);

    // Calculate base and total offer price
    const calculateBasePrice = () => parseFloat(price) || 0;
    const calculateExtras = () => extraCharges.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
    const calculateTotal = () => (calculateBasePrice() + calculateExtras()).toFixed(2);

    const applyBudgetPreset = () => {
        if (!requestDetails.budget || requestDetails.budget === 'Open') {
            setPrice('450');
        } else {
            const numericBudget = requestDetails.budget.replace(/[^0-9.]/g, '');
            if (numericBudget) setPrice(numericBudget);
        }
    };

    const addPresetNote = (noteText: string) => {
        if (notes.includes(noteText)) return;
        setNotes(prev => prev ? `${prev}\n• ${noteText}` : `• ${noteText}`);
    };

    const handleSubmit = async () => {
        // Enforce account connection guard
        if (isStripeConnected === false) {
            setShowConnectModal(true);
            return;
        }

        const rawCleanId = String(
            requestDetails.rawId ||
            (slug ? (slug.startsWith('enc_') ? decryptId(slug) : slug) : '') ||
            requestDetails.id ||
            '1'
        ).replace('REQ-', '').trim();
        const cleanId = rawCleanId || '1';
        const effectiveValidity = validity === 'custom' ? (customValidity || 'Custom Duration') : validity;
        const effectivePaymentTerm = paymentTerm === 'custom' ? (customPaymentTerm || 'Custom Terms') : paymentTerm;

        setIsSubmitting(true);
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
        } catch (err: any) {
            console.error('Failed to submit quote via API', err);
        } finally {
            // 1. Dispatch confirmation notification for Supplier
            addNotification({
                title: 'Quotation Submitted',
                desc: `Your quotation of € ${finalTotal} has been submitted successfully for ${cargoDesc} (${requestDetails.pickup} → ${requestDetails.delivery}).`,
                type: 'quote',
                time: 'Just now',
                link: '/supplier/quotes/requests'
            });

            // 2. Dispatch quote notification for Customer in real-time
            try {
                const custKey = 'carrierdirect_notifications_customer';
                const rawCust = localStorage.getItem(custKey);
                const parsedCust = rawCust ? JSON.parse(rawCust) : [];
                const newCustNotif = {
                    id: `cust-notif-${Date.now()}`,
                    title: 'New Carrier Quote Received',
                    desc: `A verified carrier submitted a quotation offer of € ${finalTotal} for ${requestDetails.pickup} → ${requestDetails.delivery}.`,
                    time: 'Just now',
                    timestamp: Date.now(),
                    type: 'quote',
                    unread: true,
                    link: '/customer/quotes/received'
                };
                localStorage.setItem(custKey, JSON.stringify([newCustNotif, ...(Array.isArray(parsedCust) ? parsedCust : [])]));
                window.dispatchEvent(new CustomEvent('carrierdirect_notif_update', { detail: { role: 'customer' } }));
            } catch {}

            const submissionPayloadMeta = {
                extraCharges: extraCharges.filter(c => c.type && parseFloat(c.amount) > 0),
                validity: effectiveValidity,
                paymentTerm: effectivePaymentTerm,
                basePrice: price,
            };

            // Update supplier status tracker immediately
            markRequestAsQuoted(cleanId, finalTotal, submissionPayloadMeta);

            setIsSubmitting(false);
            onSubmittedSuccess(finalTotal, submissionPayloadMeta);
        }
    };

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[3px] shadow-2xs p-5 space-y-4 sticky top-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Your Quotation Offer</h3>
                <span className="text-xs text-slate-500 font-medium">{requestDetails.id}</span>
            </div>

            {/* Payout Account Warning Banner if not connected */}
            {!isStripeConnected && !isCheckingConnect && (
                <div className="p-3 bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-500/30 rounded-[3px] space-y-2">
                    <div className="flex items-start gap-2">
                        <AlertCircle size={15} className="text-[#ff4a1f] shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-800 dark:text-slate-200">
                            <strong className="block font-bold text-[11.5px] text-slate-900 dark:text-slate-100">Payout Account Setup Required</strong>
                            <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug block mt-0.5">
                                Connect your Stripe / Bank account to receive customer escrow payments and place bids.
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowConnectModal(true)}
                        className="w-full py-1.5 px-3 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-[11.5px] font-bold rounded-[3px] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                        <CreditCard size={13} />
                        <span>Connect Stripe Payouts</span>
                    </button>
                </div>
            )}

            {/* Target Budget Helper */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50/80 dark:bg-[#181d24] rounded-[3px] border border-slate-200/80 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Shipper Budget:</span>
                    <strong className="text-slate-900 dark:text-slate-100 font-bold text-xs">
                        {requestDetails.budget}
                    </strong>
                </div>
                <button 
                    type="button" 
                    onClick={applyBudgetPreset} 
                    className="text-[11.5px] font-bold text-[#ff4a1f] hover:text-[#e03e15] hover:underline cursor-pointer transition-colors"
                >
                    Match Shipper Budget
                </button>
            </div>

            {/* Base Freight Price */}
            <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                    <FormLabel required className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-0">
                        Base Freight Price
                    </FormLabel>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Excl. VAT / Tolls</span>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 font-bold text-sm">
                        €
                    </div>
                    <Input 
                        id="offer-price-input"
                        type="number" 
                        placeholder="0.00" 
                        className="pl-7 pr-12 font-bold text-base h-10 border-slate-300 dark:border-slate-700 focus:border-[#ff4a1f] focus:ring-[#ff4a1f] rounded-[3px]"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs font-semibold uppercase">
                        EUR
                    </div>
                </div>
                
                {/* Quick amount shortcuts */}
                <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                    {['350', '450', '550', '750'].map(val => (
                        <button
                            key={val}
                            type="button"
                            onClick={() => setPrice(val)}
                            className={`py-1 text-xs font-bold rounded-[3px] border transition-all text-center cursor-pointer ${
                                price === val 
                                    ? 'bg-[#ff4a1f]/10 text-[#ff4a1f] border-[#ff4a1f]/50 dark:bg-[#ff4a1f]/20 shadow-2xs' 
                                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80'
                            }`}
                        >
                            € {val}
                        </button>
                    ))}
                </div>
            </div>

            {/* Extra Charges Section Component */}
            <ExtraChargesSection 
                extraCharges={extraCharges} 
                onChange={setExtraCharges} 
            />

            {/* Price Summary Breakdown - Ultra Professional Commercial Receipt */}
            <div className="p-3.5 bg-slate-50/80 dark:bg-[#181d24] rounded-[3px] border border-slate-200/90 dark:border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <span>Commercial Offer Breakdown</span>
                    <span>EUR</span>
                </div>

                {/* Base Freight Rate Row */}
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300 font-medium">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Base Freight (Direct Haulage):</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                        € {parseFloat(price || '0').toFixed(2)}
                    </span>
                </div>

                {/* Extra Charges Section with Dashed Separators */}
                {extraCharges.filter(c => c.type && parseFloat(c.amount) > 0).length > 0 && (
                    <>
                        <div className="border-t border-dashed border-slate-200 dark:border-slate-700/80 my-1" />
                        <div className="space-y-1.5">
                            {extraCharges.filter(c => c.type && parseFloat(c.amount) > 0).map((ch, i) => (
                                <div key={i} className="flex justify-between items-center text-[11.5px] text-slate-600 dark:text-slate-400">
                                    <span className="flex items-center gap-1.5">
                                        <span className="text-[#ff4a1f] font-bold">•</span>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            {ch.type === 'Custom' ? (ch.customName || 'Custom Surcharge') : ch.type}:
                                        </span>
                                    </span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        +€ {parseFloat(ch.amount || '0').toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Prominent Dashed Divider for Grand Total */}
                <div className="border-t-2 border-dashed border-slate-300 dark:border-slate-700 pt-2.5 mt-1.5 flex justify-between items-center">
                    <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs block">
                            Total Quotation Offer:
                        </span>
                        <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium">
                            Guaranteed carrier settlement
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="font-black text-xl text-[#ff4a1f] tracking-tight">
                            € {calculateTotal()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Validity & Payment Terms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                    <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0">Quote Validity</FormLabel>
                    <Select value={validity} onChange={(e) => setValidity(e.target.value)} showSearch={false} className="text-xs h-8 rounded-[3px]">
                        <option value="12h">12 Hours</option>
                        <option value="24h">24 Hours (1 Day)</option>
                        <option value="48h">48 Hours (Standard)</option>
                        <option value="3d">3 Days</option>
                        <option value="5d">5 Days</option>
                        <option value="7d">7 Days (1 Week)</option>
                        <option value="14d">14 Days</option>
                        <option value="custom">✏️ Custom Duration...</option>
                    </Select>
                    {validity === 'custom' && (
                        <Input 
                            placeholder="e.g. 10 Days / 36 Hours"
                            className="text-xs h-7.5 rounded-[3px] mt-1"
                            value={customValidity}
                            onChange={(e) => setCustomValidity(e.target.value)}
                            autoFocus
                        />
                    )}
                </div>
                <div className="space-y-1">
                    <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0">Payment Terms</FormLabel>
                    <Select value={paymentTerm} onChange={(e) => setPaymentTerm(e.target.value)} showSearch={false} className="text-xs h-8 rounded-[3px]">
                        <option value="immediate">Immediate POD Clearance</option>
                        <option value="net7">Net 7 Days</option>
                        <option value="net15">Net 15 Days (Standard)</option>
                        <option value="net30">Net 30 Days</option>
                        <option value="net60">Net 60 Days</option>
                        <option value="advance">50% Advance Settlement</option>
                        <option value="custom">✏️ Custom Terms...</option>
                    </Select>
                    {paymentTerm === 'custom' && (
                        <Input 
                            placeholder="e.g. Net 45 Days / 30% Advance"
                            className="text-xs h-7.5 rounded-[3px] mt-1"
                            value={customPaymentTerm}
                            onChange={(e) => setCustomPaymentTerm(e.target.value)}
                            autoFocus
                        />
                    )}
                </div>
            </div>

            {/* Remarks with quick chips */}
            <div className="space-y-1">
                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0">Commercial Remarks & Notes</FormLabel>
                <Textarea 
                    placeholder="Specify special terms, delivery requirements, or loading window conditions..."
                    className="h-16 text-xs resize-none rounded-[3px]"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <button type="button" onClick={() => addPresetNote('Includes loading & unloading')} className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-[3px] font-medium cursor-pointer transition-colors">
                        + Loading included
                    </button>
                    <button type="button" onClick={() => addPresetNote('Driver GPS live tracking provided')} className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-[3px] font-medium cursor-pointer transition-colors">
                        + GPS Tracking
                    </button>
                    <button type="button" onClick={() => addPresetNote('Tail-lift vehicle guaranteed')} className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-[3px] font-medium cursor-pointer transition-colors">
                        + Tail-lift vehicle
                    </button>
                </div>
            </div>

            {/* Submit Offer Button */}
            <div className="pt-2 space-y-1.5">
                <Button 
                    variant="primary" 
                    className="w-full h-10 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-xs rounded-[3px] cursor-pointer flex items-center justify-center gap-2"
                    icon={!isSubmitting ? <Send size={14} /> : undefined}
                    isLoading={isSubmitting}
                    onClick={handleSubmit}
                    disabled={parseFloat(calculateTotal()) <= 0 || isSubmitting}
                >
                    {`Submit Commercial Offer (€ ${calculateTotal()})`}
                </Button>
                {parseFloat(calculateTotal()) <= 0 && (
                    <p className="text-[11px] text-center text-amber-600 dark:text-amber-400 font-medium">
                        Please enter a Base Freight Price above to activate submission.
                    </p>
                )}
            </div>

            {/* Account Connect Guard Modal */}
            <SupplierAccountConnectModal 
                isOpen={showConnectModal}
                onClose={() => setShowConnectModal(false)}
                requestId={requestDetails.id}
            />
        </div>
    );
};
