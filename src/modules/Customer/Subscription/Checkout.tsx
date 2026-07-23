import React, { useState } from 'react';
import { 
  CreditCard, Building2, ShieldCheck, CheckCircle2, Lock, ArrowLeft, 
  Sparkles, Check, HelpCircle, ArrowRight, Tag, Wallet, Globe, RefreshCw
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Badge from '@/components/ui/badge';
import FormLabel from '@/components/ui/label';

export default function SubscriptionCheckout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Selected Plan state (passed from Subscription page or default Business)
  const selectedPlanFromState = (location.state as any)?.plan || {
    id: 'business',
    name: 'Business Shipper Plan',
    priceMonthly: 49,
    priceYearly: 39,
    cycle: 'yearly'
  };

  const [planCycle, setPlanCycle] = useState<'monthly' | 'yearly'>(selectedPlanFromState.cycle || 'yearly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sepa' | 'paylater'>('card');
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Form Fields
  const [cardData, setCardData] = useState({
    cardName: 'Mamunur Rashid',
    cardNumber: '4242 •••• •••• 4242',
    expDate: '12/28',
    cvc: '888',
    companyName: 'Walton Group BD Ltd.',
    vatNumber: 'BIN-987654321',
    billingEmail: 'billing@walton.bd',
    address: 'Plot 42, Sector 4, Uttara Industrial Area',
    city: 'Dhaka',
    zip: '1230',
    country: 'Bangladesh'
  });

  const fillSamplePaymentData = () => {
    setCardData({
      cardName: 'Walton Corporate Freight Inc.',
      cardNumber: '5412 7500 9821 4242',
      expDate: '09/29',
      cvc: '321',
      companyName: 'Walton Logistics Ltd.',
      vatNumber: 'BIN-992183741',
      billingEmail: 'accounts@walton-logistics.com',
      address: 'Walton Corporate Tower, 12 EPZ Road',
      city: 'Dhaka',
      zip: '1230',
      country: 'Bangladesh'
    });
    setPromoCode('LOGISTICS20');
    setDiscountApplied(true);
  };

  // Detailed Price Calculations
  const baseMonthlyRate = selectedPlanFromState.priceMonthly || 49;
  const baseYearlyMonthlyRate = selectedPlanFromState.priceYearly || 39;
  
  // Base raw price before discount
  const rawSubtotal = planCycle === 'yearly' ? baseMonthlyRate * 12 : baseMonthlyRate;
  
  // 20% Annual Plan Savings
  const yearlySavings = planCycle === 'yearly' ? (baseMonthlyRate - baseYearlyMonthlyRate) * 12 : 0;
  const subtotalAfterYearlySavings = rawSubtotal - yearlySavings;
  
  // Promo Coupon Discount (20%)
  const promoSavings = discountApplied ? subtotalAfterYearlySavings * 0.2 : 0;
  const finalSubtotal = subtotalAfterYearlySavings - promoSavings;
  
  // VAT 15%
  const vatTax = finalSubtotal * 0.15;
  const totalAmount = finalSubtotal + vatTax;

  const handleApplyPromo = () => {
    if (promoCode.trim().toLowerCase() === 'logistics20' || promoCode.trim()) {
      setDiscountApplied(true);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccessModalOpen(true);
    }, 1000);
  };

  return (
    <div className="p-4 md:p-6 w-full mx-auto font-sans antialiased min-h-screen pb-24 bg-[#f8f9fa]">
      
      {/* Top Standard Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Complete Your Subscription Upgrade</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Select your preferred payment method and confirm billing details to activate your plan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/customer/subscription')}
            className="h-9 px-3 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft size={14} className="mr-1.5" /> Back to Plans
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={fillSamplePaymentData}
            className="h-9 px-3.5 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Auto-Fill Demo Data</span>
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Columns: Payment Method & Billing Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Payment Method Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <CreditCard size={15} className="text-[#ff4a1f]" /> Select payment method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, subtitle: 'Visa, Mastercard' },
                { id: 'sepa', label: 'SEPA Direct Debit', icon: Building2, subtitle: 'Bank Transfer' },
                { id: 'paylater', label: 'Pay Later Credit', icon: ShieldCheck, subtitle: 'Net 30 Days' },
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                      isSelected 
                        ? 'border-[#ff4a1f] bg-orange-50/50 ring-2 ring-[#ff4a1f]/20 shadow-2xs' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon size={18} className={isSelected ? 'text-[#ff4a1f]' : 'text-slate-400'} />
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#ff4a1f] bg-[#ff4a1f]' : 'border-slate-300'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">{method.label}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{method.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment Fields (Card View) */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormLabel required>Name on Card</FormLabel>
                    <Input 
                      value={cardData.cardName} 
                      onChange={(e) => setCardData({...cardData, cardName: e.target.value})} 
                      placeholder="e.g. Mamunur Rashid" 
                    />
                  </div>
                  <div>
                    <FormLabel required>Card Number</FormLabel>
                    <Input 
                      value={cardData.cardNumber} 
                      onChange={(e) => setCardData({...cardData, cardNumber: e.target.value})} 
                      placeholder="4242 4242 4242 4242" 
                    />
                  </div>
                  <div>
                    <FormLabel required>Expiration Date</FormLabel>
                    <Input 
                      value={cardData.expDate} 
                      onChange={(e) => setCardData({...cardData, expDate: e.target.value})} 
                      placeholder="MM/YY" 
                    />
                  </div>
                  <div>
                    <FormLabel required>Security Code (CVC)</FormLabel>
                    <Input 
                      value={cardData.cvc} 
                      onChange={(e) => setCardData({...cardData, cvc: e.target.value})} 
                      placeholder="123" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Fields (SEPA Direct Debit) */}
            {paymentMethod === 'sepa' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-800">SEPA IBAN Direct Debit Transfer</span>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">Eurozone Standard</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <FormLabel required>IBAN Account Number</FormLabel>
                    <Input placeholder="DE89 3704 0044 0532 0130 00" defaultValue="BE68 5390 0754 7034" />
                  </div>
                  <div>
                    <FormLabel required>SWIFT / BIC Code</FormLabel>
                    <Input placeholder="BNPAFFRPXXX" defaultValue="GEBAFR22XXX" />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Fields (Pay Later) */}
            {paymentMethod === 'paylater' && (
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <ShieldCheck size={16} /> Corporate Net-30 Invoicing Line Active
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Your business account has an approved credit line. The subscription fee will be appended to your monthly corporate consolidated invoice.
                </p>
              </div>
            )}

          </div>

          {/* Business & Billing Profile Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Building2 size={15} className="text-slate-400" /> Billing address & tax information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel required>Company Registered Name</FormLabel>
                <Input 
                  value={cardData.companyName} 
                  onChange={(e) => setCardData({...cardData, companyName: e.target.value})} 
                />
              </div>
              <div>
                <FormLabel>VAT / Tax BIN Number</FormLabel>
                <Input 
                  value={cardData.vatNumber} 
                  onChange={(e) => setCardData({...cardData, vatNumber: e.target.value})} 
                />
              </div>
              <div>
                <FormLabel required>Invoice Recipient Email</FormLabel>
                <Input 
                  value={cardData.billingEmail} 
                  onChange={(e) => setCardData({...cardData, billingEmail: e.target.value})} 
                />
              </div>
              <div>
                <FormLabel required>Country</FormLabel>
                <Input 
                  value={cardData.country} 
                  onChange={(e) => setCardData({...cardData, country: e.target.value})} 
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <FormLabel required>Street Billing Address</FormLabel>
                <Input 
                  value={cardData.address} 
                  onChange={(e) => setCardData({...cardData, address: e.target.value})} 
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Order Summary Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden sticky top-6">
            
            {/* Clean Card Header matching Left cards */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Selected plan</span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{selectedPlanFromState.name}</h3>
              </div>
              <Badge className="bg-orange-50 text-[#ff4a1f] border border-orange-200 text-[10px] font-bold px-2 py-0.5">
                {planCycle === 'yearly' ? 'Annual Plan' : 'Monthly Plan'}
              </Badge>
            </div>

            <div className="p-5 space-y-4 text-xs">
              
              {/* Cycle Toggle */}
              <div className="p-1 bg-slate-100 rounded-lg flex items-center justify-between border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPlanCycle('monthly')}
                  className={`w-1/2 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    planCycle === 'monthly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Monthly Billed
                </button>
                <button
                  type="button"
                  onClick={() => setPlanCycle('yearly')}
                  className={`w-1/2 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    planCycle === 'yearly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  <span>Yearly</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded">20% Off</span>
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 pt-2 border-b border-slate-100 pb-3">
                <div className="flex justify-between text-slate-600">
                  <span>Base plan rate ({planCycle === 'yearly' ? '12 Months' : '1 Month'})</span>
                  <span className="font-semibold text-slate-900">€{rawSubtotal.toFixed(2)}</span>
                </div>
                
                {planCycle === 'yearly' && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span className="flex items-center gap-1"><Tag size={12}/> Annual plan discount (20% off)</span>
                    <span>-€{yearlySavings.toFixed(2)}</span>
                  </div>
                )}

                {discountApplied && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span className="flex items-center gap-1"><Tag size={12}/> Promo coupon savings (20% off)</span>
                    <span>-€{promoSavings.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500">
                  <span>VAT / Tax (15%)</span>
                  <span className="font-semibold text-slate-800">€{vatTax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-baseline pt-1">
                <span className="font-bold text-slate-900 text-sm">Total Due Today</span>
                <span className="text-xl font-extrabold text-[#ff4a1f]">€{totalAmount.toFixed(2)}</span>
              </div>

              {/* Promo Code Input */}
              <div className="pt-2">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Have a Coupon Code?</label>
                <div className="flex gap-1.5">
                  <Input 
                    value={promoCode} 
                    onChange={(e) => setPromoCode(e.target.value)} 
                    placeholder="e.g. LOGISTICS20" 
                    className="h-8.5 text-xs"
                  />
                  <Button 
                    type="button"
                    onClick={handleApplyPromo}
                    className="h-8.5 text-xs px-3 font-semibold bg-slate-900 text-white cursor-pointer"
                  >
                    Apply
                  </Button>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3">
                <Button
                  variant="primary"
                  isLoading={isProcessing}
                  onClick={handleCheckoutSubmit}
                  className="w-full h-10 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock size={14} />
                  <span>Confirm & Pay €{totalAmount.toFixed(2)}</span>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="pt-3 border-t border-slate-100 text-center space-y-1.5 text-[10.5px] text-slate-500">
                <p className="flex items-center justify-center gap-1 font-semibold text-slate-700">
                  <ShieldCheck size={13} className="text-emerald-600" /> Instant Activation & Cancel Anytime
                </p>
                <p>Protected by PCI-DSS Level 1 Banking Compliance.</p>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Subscription Activation Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 text-center space-y-4 relative overflow-hidden">
            
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-50 shadow-inner">
              <CheckCircle2 size={32} className="text-emerald-600 animate-pulse" />
            </div>

            <div>
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold mb-1.5 px-2.5 py-0.5">
                Payment Successful
              </Badge>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Subscription Activated!</h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Welcome to <span className="font-bold text-slate-900">{selectedPlanFromState.name}</span>. Unlimited RFQs and corporate features are now unlocked.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium">Receipt ID:</span>
                <span className="font-bold text-slate-900">INV-CST-2026-005</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium">Amount Billed:</span>
                <span className="font-bold text-emerald-600">€{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className="font-bold text-emerald-600">Active (Auto-renews yearly)</span>
              </div>
            </div>

            <div className="pt-2">
              <Button 
                variant="primary" 
                className="w-full h-9 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  navigate('/customer/subscription');
                }}
              >
                <span>Return to Subscription Dashboard</span>
                <ArrowRight size={14} />
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
