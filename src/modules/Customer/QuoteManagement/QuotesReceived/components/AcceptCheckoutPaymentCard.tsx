import React from 'react';
import { ShieldCheck, Lock, Building2, CheckCircle2 } from 'lucide-react';
import Input from '@/components/ui/input';
import FormLabel from '@/components/ui/label';

interface AcceptCheckoutPaymentCardProps {
    paymentOption: 'pay_now' | 'pay_later';
    setPaymentOption: (opt: 'pay_now' | 'pay_later') => void;
    payNowMethod: 'card' | 'sepa';
    setPayNowMethod: (m: 'card' | 'sepa') => void;
    cardData: { cardName: string; cardNumber: string; expDate: string; cvc: string };
    setCardData: React.Dispatch<React.SetStateAction<{ cardName: string; cardNumber: string; expDate: string; cvc: string }>>;
    totalAmount: number;
}

export const AcceptCheckoutPaymentCard: React.FC<AcceptCheckoutPaymentCardProps> = ({
    paymentOption,
    setPaymentOption,
    payNowMethod,
    setPayNowMethod,
    cardData,
    setCardData,
    totalAmount,
}) => {
    return (
        <div className="bg-white border border-slate-200 rounded-[5px] p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck size={17} className="text-slate-700" /> Select Payment Term & Protection
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setPaymentOption('pay_now')}
                    className={`p-4 rounded-[5px] border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        paymentOption === 'pay_now' ? 'border-slate-900 bg-slate-50/60 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <Lock size={16} className="text-slate-800" />
                            <span className="text-sm font-bold text-slate-900">Pay Now via Escrow</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentOption === 'pay_now' ? 'border-slate-900 bg-slate-900' : 'border-slate-300'}`}>
                            {paymentOption === 'pay_now' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Funds held safely in platform Escrow. Carrier receives payout only after POD delivery confirmation.
                    </p>
                    <span className="inline-flex items-center px-3 py-0.5 rounded-[5px] text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 w-fit">
                        Escrow Protected
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setPaymentOption('pay_later')}
                    className={`p-4 rounded-[5px] border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        paymentOption === 'pay_later' ? 'border-slate-900 bg-slate-50/60 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <Building2 size={16} className="text-slate-800" />
                            <span className="text-sm font-bold text-slate-900">Pay Later (Net-30 Credit)</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentOption === 'pay_later' ? 'border-slate-900 bg-slate-900' : 'border-slate-300'}`}>
                            {paymentOption === 'pay_later' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Use your corporate 30-day pay later credit line. No immediate credit card charge required today.
                    </p>
                    <span className="inline-flex items-center px-3 py-0.5 rounded-[5px] text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 w-fit">
                        €25,500 Credit Limit
                    </span>
                </button>
            </div>

            {paymentOption === 'pay_now' && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex gap-5 mb-2">
                        <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 cursor-pointer">
                            <input type="radio" name="payNowMethod" checked={payNowMethod === 'card'} onChange={() => setPayNowMethod('card')} className="accent-[#ff4a1f]" />
                            <span>Credit / Debit Card</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 cursor-pointer">
                            <input type="radio" name="payNowMethod" checked={payNowMethod === 'sepa'} onChange={() => setPayNowMethod('sepa')} className="accent-[#ff4a1f]" />
                            <span>SEPA Bank Transfer</span>
                        </label>
                    </div>

                    {payNowMethod === 'card' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <FormLabel required>Cardholder Name</FormLabel>
                                <Input value={cardData.cardName} onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })} />
                            </div>
                            <div>
                                <FormLabel required>Card Number</FormLabel>
                                <Input value={cardData.cardNumber} onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })} />
                            </div>
                            <div>
                                <FormLabel required>Expiry Date</FormLabel>
                                <Input value={cardData.expDate} onChange={(e) => setCardData({ ...cardData, expDate: e.target.value })} />
                            </div>
                            <div>
                                <FormLabel required>Security CVC</FormLabel>
                                <Input value={cardData.cvc} onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })} />
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-[5px] text-xs sm:text-[13px] space-y-2">
                            <p className="font-bold text-slate-900">SEPA Eurozone Bank Escrow Account</p>
                            <p className="text-slate-600">IBAN: <span className="font-mono font-semibold text-slate-900">DE89 3704 0044 0532 0130 00</span></p>
                            <p className="text-slate-600">BIC / SWIFT: <span className="font-mono font-semibold text-slate-900">GEBAFR22XXX</span></p>
                        </div>
                    )}
                </div>
            )}

            {paymentOption === 'pay_later' && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-[5px] text-xs sm:text-[13px] space-y-2">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold">
                        <CheckCircle2 size={16} className="text-emerald-600" /> Corporate Net-30 Terms Pre-Approved
                    </div>
                    <p className="text-emerald-800 leading-relaxed">
                        Booking will be confirmed immediately. Tax invoice for <span className="font-bold">€{totalAmount.toLocaleString()}</span> will be issued to your corporate account, payable in 30 days.
                    </p>
                </div>
            )}
        </div>
    );
};
