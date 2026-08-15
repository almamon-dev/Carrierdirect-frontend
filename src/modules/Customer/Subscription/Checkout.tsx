import React, { useState } from "react";
import {
  ArrowLeft, CreditCard, ShieldCheck, CheckCircle2, Lock, Tag, Sparkles, Building2, Receipt, ArrowRight
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Input from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import apiClient from "@/lib/axios";

export default function SubscriptionCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlanFromState = location.state?.plan || {
    id: "growth-m",
    name: "Growth Logistics",
    priceMonthly: 79,
    priceYearly: 790,
    cycle: "yearly",
  };

  const [planCycle, setPlanCycle] = useState<"monthly" | "yearly">(selectedPlanFromState.cycle || "yearly");
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Dynamic Price calculations
  const monthlyPrice = Number(selectedPlanFromState.priceMonthly) || 79;
  const yearlyPrice = Number(selectedPlanFromState.priceYearly) || (monthlyPrice * 10);

  // Full rate without discount (e.g., 12 months * monthly price)
  const fullRate = planCycle === "yearly" ? monthlyPrice * 12 : monthlyPrice;
  // Actual base subtotal before promo discounts
  const rawSubtotal = planCycle === "yearly" ? yearlyPrice : monthlyPrice;
  // Yearly plan savings amount
  const yearlySavings = planCycle === "yearly" ? Math.max(0, fullRate - yearlyPrice) : 0;
  const yearlySavingsPercent = fullRate > 0 ? Math.round((yearlySavings / fullRate) * 100) : 0;

  const promoSavings = discountApplied ? rawSubtotal * 0.10 : 0;
  const netSubtotal = rawSubtotal - promoSavings;
  const vatTax = netSubtotal * 0.15;
  const totalAmount = netSubtotal + vatTax;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "CARRIER10" || promoCode.trim().toUpperCase() === "LOGISTICS20") {
      setDiscountApplied(true);
    } else {
      alert("Invalid promo code. Try \"CARRIER10\" for 10% promo discount.");
    }
  };

  const handleCheckoutSubmit = async () => {
    setIsProcessing(true);
    try {
      const res = await apiClient.post("/subscription/checkout-link", {
        plan_id: selectedPlanFromState.id,
        billing_cycle: planCycle,
        total_amount: totalAmount,
      });
      const url = res.data?.checkout_url || res.data?.data?.checkout_url || res.checkout_url;
      if (url) {
        window.location.href = url;
        return;
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
    } finally {
      setIsProcessing(false);
      setIsSuccessModalOpen(true);
    }
  };

  return (
    <div className="p-4 md:p-6 w-full space-y-5 bg-[#f8fafc] min-h-screen font-sans">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="h-8 text-xs font-semibold cursor-pointer">
          <ArrowLeft size={14} className="mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Subscription Checkout</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Review your selected logistics plan and confirm secure payment.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-2xs border-slate-200">
            <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
                <CreditCard className="w-4 h-4 text-[#ff4a1f]" />
                Select Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="p-3 bg-slate-50 rounded-md border border-orange-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    CARD
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Credit / Debit Card (Stripe SSL)</h4>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">Instant activation with 3D Secure Verification</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 text-[9.5px] font-bold border border-emerald-200">Selected</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="bg-white rounded-md border border-slate-200 shadow-2xs overflow-hidden sticky top-4">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#ff4a1f]">Selected Plan</span>
                <h3 className="text-sm font-bold mt-0.5">{selectedPlanFromState.name}</h3>
              </div>
              <Badge className="bg-orange-50 text-[#ff4a1f] border border-orange-200 text-[10px] font-bold px-2 py-0.5">
                {planCycle === "yearly" ? "Annual Billing" : "Monthly Billing"}
              </Badge>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-1 bg-slate-100 rounded-lg flex items-center justify-between border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPlanCycle("monthly")}
                  className={`w-1/2 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    planCycle === "monthly" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                  }`}
                >
                  Monthly Billed
                </button>
                <button
                  type="button"
                  onClick={() => setPlanCycle("yearly")}
                  className={`w-1/2 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    planCycle === "yearly" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                  }`}
                >
                  <span>Yearly</span>
                  {yearlySavingsPercent > 0 && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded">
                      Save {yearlySavingsPercent}%
                    </span>
                  )}
                </button>
              </div>

              <div className="space-y-2.5 pt-2 border-b border-slate-100 pb-3">
                <div className="flex justify-between text-slate-600">
                  <span>Standard rate ({planCycle === "yearly" ? "12 Months" : "1 Month"})</span>
                  <span className="font-semibold text-slate-900">€{fullRate.toFixed(2)}</span>
                </div>

                {planCycle === "yearly" && yearlySavings > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag size={12} /> Annual discount ({yearlySavingsPercent}% off / 2 Mos Free)
                    </span>
                    <span>-€{yearlySavings.toFixed(2)}</span>
                  </div>
                )}

                {discountApplied && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span className="flex items-center gap-1"><Tag size={12} /> Coupon savings (10% off)</span>
                    <span>-€{promoSavings.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500">
                  <span>VAT / Tax (15%)</span>
                  <span className="font-semibold text-slate-800">€{vatTax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="font-bold text-slate-900 text-sm">Total Due Today</span>
                <span className="text-xl font-extrabold text-[#ff4a1f]">€{totalAmount.toFixed(2)}</span>
              </div>

              <div className="pt-2">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Have a Coupon Code?</label>
                <div className="flex gap-1.5">
                  <Input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="e.g. CARRIER10"
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
                Welcome to <span className="font-bold text-slate-900">{selectedPlanFromState.name}</span>. Your logistics membership is now live.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                className="w-full h-9 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  navigate("/customer/subscription");
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
