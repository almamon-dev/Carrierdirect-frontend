import React, { useState } from 'react';
import { ArrowLeft, Lock, ArrowRight, ShieldCheck, Tag, HelpCircle } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Checkbox from '@/components/ui/checkbox';
import { AcceptCheckoutSummaryCard } from './components/AcceptCheckoutSummaryCard';
import { AcceptCheckoutPaymentCard } from './components/AcceptCheckoutPaymentCard';
import { AcceptCheckoutSuccessModal } from './components/AcceptCheckoutSuccessModal';

export default function QuoteAcceptCheckout() {
    const navigate = useNavigate();
    const { quoteId } = useParams();
    const location = useLocation();

    const rawQuote = (location.state as any)?.quote;
    const supplierName = typeof rawQuote?.supplier === 'string' ? rawQuote.supplier : (rawQuote?.supplier?.name || 'Carrier Partner');
    const supplierRating = typeof rawQuote?.supplier === 'object' && rawQuote?.supplier?.rating ? `${rawQuote.supplier.rating} ★` : (rawQuote?.rating || '4.8 ★');
    const freightAmount = Number(rawQuote?.freightAmount ?? rawQuote?.pricing?.baseFreight ?? 4000);
    const insuranceAmount = Number(rawQuote?.insuranceAmount ?? rawQuote?.pricing?.insurance ?? 150);
    const loadingUnloadingAmount = Number(rawQuote?.pricing?.loadingUnloading ?? 350);
    const totalAmount = Number(rawQuote?.totalAmount ?? rawQuote?.pricing?.total ?? (freightAmount + insuranceAmount + loadingUnloadingAmount));

    const quote = {
        id: rawQuote?.id || quoteId || 'QT-8821',
        requestId: rawQuote?.requestId || 'REQ-9233',
        supplier: supplierName,
        rating: supplierRating,
        pickupCity: rawQuote?.pickupCity || rawQuote?.pickup?.city || 'Dhaka',
        deliveryCity: rawQuote?.deliveryCity || rawQuote?.delivery?.city || 'Chittagong',
        pickupDate: rawQuote?.logistics?.pickupDate || rawQuote?.pickupDate || 'Jul 28, 2026',
        deliveryDate: rawQuote?.logistics?.deliveryDate || rawQuote?.deliveryDate || 'Jul 30, 2026',
        vehicleType: rawQuote?.logistics?.vehicle || rawQuote?.vehicleType || 'Covered Van (14ft)',
        weight: rawQuote?.cargo?.weight || rawQuote?.weight || '1,200 KG',
        freightAmount,
        insuranceAmount,
        loadingUnloadingAmount,
        totalAmount
    };

    const [paymentOption, setPaymentOption] = useState<'pay_now' | 'pay_later'>('pay_now');
    const [payNowMethod, setPayNowMethod] = useState<'card' | 'sepa'>('card');
    const [agreedTerms, setAgreedTerms] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isBookingSuccess, setIsBookingSuccess] = useState(false);
    const [cardData, setCardData] = useState({
        cardName: 'Corporate Customer',
        cardNumber: '4242 •••• •••• 4242',
        expDate: '12/28',
        cvc: '888',
    });

    const handleConfirmBooking = (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreedTerms) return;
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsBookingSuccess(true);
        }, 800);
    };

    return (
        <div className="p-4 md:p-6 w-full mx-auto font-sans antialiased min-h-screen pb-24 bg-[#f8f9fa] text-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Accept Quote & Secure Booking</h1>
                        <span className="inline-flex items-center px-3 py-0.5 rounded-[5px] text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {quote.id}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                        Authorize carrier booking for RFQ <span className="font-bold text-[#ff4a1f]">{quote.requestId}</span> with Escrow payment protection.
                    </p>
                </div>

                <Button variant="outline" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate(-1)} className="rounded-[5px]">
                    Back to Quote Details
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-6">
                    <AcceptCheckoutSummaryCard quote={quote} />
                    <AcceptCheckoutPaymentCard
                        paymentOption={paymentOption}
                        setPaymentOption={setPaymentOption}
                        payNowMethod={payNowMethod}
                        setPayNowMethod={setPayNowMethod}
                        cardData={cardData}
                        setCardData={setCardData}
                        totalAmount={quote.totalAmount}
                    />
                </div>

                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-[5px] p-5 sm:p-6 shadow-2xs space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h2 className="text-sm font-bold text-slate-900">Payment Breakdown</h2>
                            <span className="inline-flex items-center px-3 py-0.5 rounded-[5px] text-xs font-semibold bg-orange-50 text-[#ff4a1f] border border-orange-200">
                                Protected Rate
                            </span>
                        </div>

                        <div className="space-y-3 text-xs sm:text-[13px] text-slate-600">
                            <div className="flex justify-between"><span>Base Freight:</span><span className="font-bold text-slate-900">€{quote.freightAmount.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span>Goods Cargo Insurance:</span><span className="font-bold text-slate-900">€{quote.insuranceAmount.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span>Loading / Unloading:</span><span className="font-bold text-slate-900">€{quote.loadingUnloadingAmount.toLocaleString()}</span></div>
                            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                                <span className="font-bold text-slate-900">Total Authorized Amount:</span>
                                <span className="text-xl font-extrabold text-[#ff4a1f]">€{quote.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <form onSubmit={handleConfirmBooking} className="space-y-4 pt-2">
                            <Checkbox checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)} label="I agree to CarrierDirect terms & authorize carrier booking" />
                            <Button type="submit" disabled={!agreedTerms || isProcessing} className="w-full h-11 bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-bold text-sm shadow-md rounded-[5px] cursor-pointer flex items-center justify-center gap-2">
                                <Lock size={15} />
                                <span>{isProcessing ? 'Authorizing Booking...' : `Confirm & Authorize €${quote.totalAmount.toLocaleString()}`}</span>
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            <AcceptCheckoutSuccessModal isOpen={isBookingSuccess} quote={quote} />
        </div>
    );
}
