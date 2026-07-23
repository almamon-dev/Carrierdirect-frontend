import React, { useState } from 'react';
import { 
  CreditCard, Building2, ShieldCheck, CheckCircle2, Lock, ArrowLeft, 
  Sparkles, Check, HelpCircle, ArrowRight, Tag, Wallet, MapPin, Truck, Calendar, FileText
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Badge from '@/components/ui/badge';
import Checkbox from '@/components/ui/checkbox';
import FormLabel from '@/components/ui/label';

export default function QuoteAcceptCheckout() {
  const navigate = useNavigate();
  const { quoteId } = useParams();
  const location = useLocation();

  // Safely extract quote details from location state or defaults
  const rawQuote = (location.state as any)?.quote;
  
  const supplierName = typeof rawQuote?.supplier === 'string' 
    ? rawQuote.supplier 
    : (rawQuote?.supplier?.name || 'Express Logistics BD Ltd.');
    
  const supplierRating = typeof rawQuote?.supplier === 'object' && rawQuote?.supplier?.rating 
    ? `${rawQuote.supplier.rating} ★` 
    : (rawQuote?.rating || '4.8 ★');
  
  const freightAmount = Number(rawQuote?.freightAmount ?? rawQuote?.pricing?.baseFreight ?? 40000);
  const insuranceAmount = Number(rawQuote?.insuranceAmount ?? rawQuote?.pricing?.insurance ?? 1500);
  const loadingUnloadingAmount = Number(rawQuote?.pricing?.loadingUnloading ?? 3500);
  const totalAmount = Number(rawQuote?.totalAmount ?? rawQuote?.pricing?.total ?? (freightAmount + insuranceAmount + loadingUnloadingAmount));

  const quote = {
    id: rawQuote?.id || quoteId || 'QT-8821',
    requestId: rawQuote?.requestId || 'REQ-9233',
    title: rawQuote?.title || 'Covered Van 14ft Freight Booking',
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
    cardName: 'Mamunur Rashid',
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
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Accept Quote & Secure Booking</h1>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {quote.id}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Authorize carrier booking for RFQ <span className="font-bold text-[#ff4a1f]">{quote.requestId}</span> with Escrow payment protection.
          </p>
        </div>

        <Button 
          variant="outline" 
          size="sm"
          icon={<ArrowLeft size={14} />}
          onClick={() => navigate(-1)}
        >
          Back to Quote Details
        </Button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Columns: Booking Overview & Payment Methods */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Carrier & Shipment Overview Card */}
          <div className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#ff4a1f] border border-orange-200 flex items-center justify-center font-bold text-base shrink-0">
                  {quote.supplier.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{quote.supplier}</h3>
                  <span className="text-xs text-slate-500 font-medium">{quote.rating} Rating • Verified Carrier</span>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Quote Firm Offer
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs sm:text-[13px] bg-slate-50 p-4 rounded-md border border-slate-200/80">
              <div>
                <span className="text-slate-500 font-medium block text-xs">Route:</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{quote.pickupCity} ➔ {quote.deliveryCity}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block text-xs">Pickup date:</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{quote.pickupDate}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block text-xs">Vehicle spec:</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{quote.vehicleType} ({quote.weight})</span>
              </div>
            </div>
          </div>

          {/* Payment Terms Selector Card */}
          <div className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={17} className="text-slate-700" /> Select Payment Term & Protection
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option 1: Pay Now (Escrow) */}
              <button
                type="button"
                onClick={() => setPaymentOption('pay_now')}
                className={`p-4 rounded-md border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  paymentOption === 'pay_now'
                    ? 'border-slate-900 bg-slate-50/60 shadow-2xs' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
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
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 w-fit">
                  Escrow Protected
                </span>
              </button>

              {/* Option 2: Pay Later (Corporate Credit) */}
              <button
                type="button"
                onClick={() => setPaymentOption('pay_later')}
                className={`p-4 rounded-md border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  paymentOption === 'pay_later'
                    ? 'border-slate-900 bg-slate-50/60 shadow-2xs' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
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
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 w-fit">
                  €25,500 Credit Limit
                </span>
              </button>

            </div>

            {/* Pay Now Sub-method Fields */}
            {paymentOption === 'pay_now' && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex gap-5 mb-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payNowMethod" 
                      checked={payNowMethod === 'card'} 
                      onChange={() => setPayNowMethod('card')} 
                      className="accent-[#ff4a1f]" 
                    />
                    <span>Credit / Debit Card</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payNowMethod" 
                      checked={payNowMethod === 'sepa'} 
                      onChange={() => setPayNowMethod('sepa')} 
                      className="accent-[#ff4a1f]" 
                    />
                    <span>SEPA Bank Transfer</span>
                  </label>
                </div>

                {payNowMethod === 'card' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormLabel required>Cardholder Name</FormLabel>
                      <Input value={cardData.cardName} onChange={(e) => setCardData({...cardData, cardName: e.target.value})} />
                    </div>
                    <div>
                      <FormLabel required>Card Number</FormLabel>
                      <Input value={cardData.cardNumber} onChange={(e) => setCardData({...cardData, cardNumber: e.target.value})} />
                    </div>
                    <div>
                      <FormLabel required>Expiry Date</FormLabel>
                      <Input value={cardData.expDate} onChange={(e) => setCardData({...cardData, expDate: e.target.value})} />
                    </div>
                    <div>
                      <FormLabel required>Security CVC</FormLabel>
                      <Input value={cardData.cvc} onChange={(e) => setCardData({...cardData, cvc: e.target.value})} />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-[13px] space-y-2">
                    <p className="font-bold text-slate-900">SEPA Eurozone Bank Escrow Account</p>
                    <p className="text-slate-600">IBAN: <span className="font-mono font-semibold text-slate-900">DE89 3704 0044 0532 0130 00</span></p>
                    <p className="text-slate-600">BIC / SWIFT: <span className="font-mono font-semibold text-slate-900">GEBAFR22XXX</span></p>
                  </div>
                )}
              </div>
            )}

            {/* Pay Later Approval Panel */}
            {paymentOption === 'pay_later' && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-md text-xs sm:text-[13px] space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <CheckCircle2 size={16} className="text-emerald-600" /> Corporate Net-30 Terms Pre-Approved
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  Booking will be confirmed immediately. Tax invoice for <span className="font-bold">€{quote.totalAmount.toLocaleString()}</span> will be issued to your corporate account, payable in 30 days.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Right 5 Columns: Cargo Booking Summary & Dynamic Terms Card */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 shadow-2xs space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <h2 className="text-sm font-bold text-slate-900">Cargo Booking Summary</h2>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Ready to Book
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500">Base freight transport</span>
                <span className="font-bold text-slate-900">€{quote.freightAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500">Loading & unloading labor</span>
                <span className="font-bold text-slate-900">€{quote.loadingUnloadingAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500">CMR cargo insurance</span>
                <span className="font-bold text-slate-900">€{quote.insuranceAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500">Platform Escrow protection</span>
                <span className="font-bold text-emerald-600">Free (Included)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-900">
                  {paymentOption === 'pay_later' ? 'Net-30 Invoice Total' : 'Escrow Hold Total'}
                </span>
                <span className="text-2xl font-extrabold text-[#ff4a1f]">€{quote.totalAmount.toLocaleString()}</span>
              </div>

              {/* Dynamic Terms & Conditions Agreement Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md space-y-2">
                <span className="text-xs font-bold text-slate-900 block">Terms & Conditions Agreement</span>
                <Checkbox
                  checked={agreedTerms}
                  onChange={(e: any) => setAgreedTerms(e.target.checked)}
                  label={
                    paymentOption === 'pay_later'
                      ? `I accept Net-30 Corporate Terms. Tax invoice for €${quote.totalAmount.toLocaleString()} will be issued due in 30 days.`
                      : `I accept freight booking terms and Escrow payout release rules upon signed Proof of Delivery (POD).`
                  }
                />
              </div>
              
              <Button
                isLoading={isProcessing}
                disabled={!agreedTerms}
                onClick={handleConfirmBooking}
                className="w-full h-11 text-xs sm:text-sm font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-md cursor-pointer flex items-center justify-center gap-2 rounded-md"
              >
                <Lock size={16} />
                <span>
                  {paymentOption === 'pay_later' ? 'Confirm Booking (Pay Later)' : `Authorize Escrow €${quote.totalAmount.toLocaleString()}`}
                </span>
              </Button>

              <div className="pt-2 text-center space-y-1 text-xs text-slate-500">
                <p className="flex items-center justify-center gap-1.5 font-semibold text-slate-700">
                  <ShieldCheck size={14} className="text-emerald-600" /> Carrier Protection Active
                </p>
                <p>
                  {paymentOption === 'pay_later' ? 'Invoice payable within 30 calendar days.' : 'Funds released to carrier only after POD delivery signature.'}
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Booking Confirmation Success Modal */}
      {isBookingSuccess && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white rounded-md max-w-md w-full border border-slate-200 shadow-2xl p-6 text-center space-y-4 relative overflow-hidden">
            
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-50 shadow-inner">
              <CheckCircle2 size={32} className="text-emerald-600 animate-pulse" />
            </div>

            <div>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1.5">
                Booking Confirmed & Active
              </span>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Carrier Booking Confirmed!</h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Order <span className="font-bold text-slate-900">ORD-2026-9918</span> has been placed with <span className="font-bold text-slate-900">{quote.supplier}</span>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-md border border-slate-200/80 text-left space-y-2 text-xs sm:text-[13px]">
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium">Order Number:</span>
                <span className="font-bold text-slate-900">ORD-2026-9918</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium">Payment Term:</span>
                <span className="font-bold text-emerald-600">{paymentOption === 'pay_later' ? 'Net-30 Invoice (Pay Later)' : 'Escrow Secured'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Pickup Date:</span>
                <span className="font-bold text-slate-800">{quote.pickupDate}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                className="w-full sm:w-1/2 h-10 text-xs font-semibold text-slate-700 cursor-pointer rounded-md"
                onClick={() => navigate('/customer/orders')}
              >
                Go to Orders List
              </Button>
              <Button 
                variant="primary" 
                className="w-full sm:w-1/2 h-10 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer shadow-md flex items-center justify-center gap-1.5 rounded-md"
                onClick={() => navigate('/customer/quotes/processing')}
              >
                <span>Track Shipment</span>
                <ArrowRight size={14} />
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
