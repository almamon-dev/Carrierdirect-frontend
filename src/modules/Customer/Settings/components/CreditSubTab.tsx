import apiClient from "@/lib/axios";
import { PayLaterIncreaseModal } from "@/modules/Customer/Finance/PayLater/components/PayLaterIncreaseModal";
import { CorporateNet30DrawerModal } from "@/modules/Customer/QuoteManagement/QuotesReceived/components/CorporateNet30DrawerModal";
import { useToastStore } from "@/stores/useToastStore";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Info,
  Landmark,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { AddPaymentMethodModal } from "./AddPaymentMethodModal";
import { useState } from "react";

interface CreditSubTabProps {
  approvedLimit?: number;
  monthlyLimit?: number;
  weeklyLimit?: number;
  dailyLimit?: number;
  currentlyUsed?: number;
  availableBalance?: number;
  hasLinkedCard?: boolean;
  isEligible?: boolean;
  status?: string;
  onRefresh?: () => void;
}

export default function CreditSubTab({
  approvedLimit = 0,
  monthlyLimit = 40000,
  weeklyLimit = 15000,
  dailyLimit = 8000,
  currentlyUsed = 0,
  availableBalance = 0,
  hasLinkedCard = false,
  isEligible = true,
  status = 'inactive',
  onRefresh,
}: CreditSubTabProps) {
  const showToast = useToastStore((state) => state.showToast);

  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [isIncreaseModalOpen, setIsIncreaseModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatEuro = (amount: number) => {
    return `€ ${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleIncreaseSubmit = async (
    target: string,
    amount: string,
    reason: string
  ) => {
    if (!amount || Number(amount) <= 0) {
      showToast("Please enter a valid amount.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      let limitTypeKey = 'monthly';
      if (target === 'Weekly Limit') limitTypeKey = 'weekly';
      else if (target === 'Daily Limit') limitTypeKey = 'daily';

      await apiClient.post('/customer/pay-later/request', {
        requested_limit: parseFloat(amount),
        limit_type: limitTypeKey,
        reason,
      });

      showToast("Credit limit increase request submitted successfully!", "success");
      setIsIncreaseModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      showToast(err?.message || "Failed to submit request", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAutoPayEnabled = Boolean(hasLinkedCard);

  const toggleAutoPay = () => {
    if (!hasLinkedCard) {
      setIsAddCardModalOpen(true);
      return;
    }
    showToast(
      "Auto payment is mandatory for Corporate Net-30 credit terms.",
      "info"
    );
  };

  const usagePercent =
    approvedLimit > 0
      ? Math.min(100, Math.round((currentlyUsed / approvedLimit) * 100))
      : 0;

  return (
    <div className="space-y-4 pt-0.5 font-sans">
      {/* 1. Corporate Net-30 Credit Facility Card (Compact & rounded-[4px]) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] p-3.5 sm:p-4 shadow-2xs space-y-4">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[4px] bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-900/50">
              <Landmark size={17} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  Corporate Net-30 Credit Facility
                </h2>
                {status === 'approved' ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-[2px] text-[10.5px] font-semibold">
                    <CheckCircle2 size={10} /> Active
                  </span>
                ) : status === 'pending' || status === 'under_review' ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 rounded-[2px] text-[10.5px] font-semibold">
                    <Clock size={10} /> Pending Review
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-[2px] text-[10.5px] font-semibold">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                30-day deferred logistics payment facility for verified corporate shippers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-stretch sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsAgreementOpen(true)}
              className="flex-1 sm:flex-initial h-[34px] px-3.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-[4px] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <FileText size={14} className="text-slate-500 dark:text-slate-400" />
              <span>View Agreement</span>
            </button>

            <button
              type="button"
              onClick={() => setIsIncreaseModalOpen(true)}
              className="flex-1 sm:flex-initial h-[34px] px-4 bg-[#ff4a1f] hover:bg-[#e03d15] text-white text-xs font-semibold rounded-[4px] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <span>{status === 'approved' ? 'Request Limit Increase' : status === 'pending' || status === 'under_review' ? 'Application Under Review' : 'Apply for Pay Later'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {status !== 'approved' && (
          <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-[4px] flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <Info size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">
                {status === 'pending' || status === 'under_review'
                  ? 'Corporate Pay Later Application Under Review'
                  : 'Corporate Pay Later Facility Not Activated'}
              </span>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-snug">
                {status === 'pending' || status === 'under_review'
                  ? 'Your credit application has been submitted and is awaiting administrator verification. Once approved, your approved credit line and available balance will be activated.'
                  : 'You have not submitted an application for Corporate Net-30 revolving credit yet. Click "Apply for Pay Later" to request credit approval.'}
              </p>
            </div>
          </div>
        )}

        {/* 3 Metric Cards Row (Compact) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Stat 1: Approved Credit Limit */}
          <div className="flex items-start gap-2.5 p-2 rounded-[4px] bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/60">
            <div className="w-8 h-8 rounded-[4px] bg-red-50 dark:bg-red-950/30 text-[#ff4a1f] flex items-center justify-center font-bold text-sm shrink-0">
              €
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>Approved Credit Limit</span>
                <Info size={11} className="text-slate-400" />
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {formatEuro(approvedLimit)}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                Monthly revolving credit limit.
              </div>
            </div>
          </div>

          {/* Stat 2: Currently Used */}
          <div className="flex items-start gap-2.5 p-2 rounded-[4px] bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/60">
            <div className="w-8 h-8 rounded-[4px] bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center shrink-0">
              <CreditCard size={15} />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>Currently Used</span>
                <Info size={11} className="text-slate-400" />
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {formatEuro(currentlyUsed)}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                Active Net 30 unpaid invoices.
              </div>
            </div>
          </div>

          {/* Stat 3: Available Balance */}
          <div className="flex items-start gap-2.5 p-2 rounded-[4px] bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/60">
            <div className="w-8 h-8 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center shrink-0">
              <Clock size={15} />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>Available Balance</span>
                <Info size={11} className="text-slate-400" />
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {formatEuro(availableBalance)}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                Ready for instant freight orders.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid (Left 2 cards, Right 2 cards) - Compact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Credit Usage & Eligibility Requirements */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Card 1: Credit Usage */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] p-3.5 sm:p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <TrendingUp size={13} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Credit Usage
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    Usage this billing cycle (01 Oct – 31 Oct 2026)
                  </p>
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {formatEuro(currentlyUsed)}{" "}
                <span className="font-normal text-slate-400">used of</span>{" "}
                {formatEuro(approvedLimit)}
              </div>
            </div>

            {/* Progress Bar (Compact h-1.5) */}
            <div className="flex items-center gap-2.5">
              <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-[4px] overflow-hidden">
                <div
                  className="h-full bg-[#ff4a1f] rounded-[4px] transition-all duration-500"
                  style={{ width: `${Math.max(usagePercent, 0)}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 min-w-[24px] text-right">
                {usagePercent}%
              </span>
            </div>

            {/* Legend (Compact) */}
            <div className="flex items-center gap-5 pt-0.5 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-[2px] bg-[#ff4a1f]" />
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Used Amount</span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {formatEuro(currentlyUsed)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-[2px] bg-slate-300 dark:bg-slate-700" />
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Remaining Credit</span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {formatEuro(availableBalance)}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Eligibility Requirements (Compact) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] p-3.5 sm:p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                <ShieldCheck size={13} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Eligibility Requirements
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  Keep your account in good standing to maintain your credit facility.
                </p>
              </div>
            </div>

            <div className="space-y-1.5 pt-0.5">
              {/* Row 1 */}
              <div className="flex items-center justify-between py-1 border-b border-slate-100/70 dark:border-slate-800/60 last:border-b-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    Growth Logistics Subscription
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-[2px] text-[10.5px] font-semibold">
                  Active
                </span>
              </div>

              {/* Row 2 */}
              <div className="flex items-center justify-between py-1 border-b border-slate-100/70 dark:border-slate-800/60 last:border-b-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    Business Verification
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-[2px] text-[10.5px] font-semibold">
                  Verified
                </span>
              </div>

              {/* Row 3 */}
              <div className="flex items-center justify-between py-1 border-b border-slate-100/70 dark:border-slate-800/60 last:border-b-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    Backup Payment Card
                  </span>
                </div>
                {hasLinkedCard ? (
                  <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-[2px] text-[10.5px] font-semibold">
                    Added
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 rounded-[2px] text-[10.5px] font-semibold">
                      Card Required
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddCardModalOpen(true)}
                      className="text-xs font-bold text-[#ff4a1f] hover:underline cursor-pointer"
                    >
                      Link Card
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Credit Details & Need Higher Limit - Compact */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          {/* Card 1: Credit Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] p-3.5 sm:p-4 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <div className="w-6 h-6 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                <FileText size={13} />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Credit Details
              </h3>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Facility Type</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                  Net-30 (Invoice in 30 days)
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Status</span>
                <span className={`px-1.5 py-0.5 font-semibold rounded-[2px] text-[10.5px] border ${
                  status === 'approved'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                    : status === 'pending' || status === 'under_review'
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}>
                  {status === 'approved' ? 'Active Facility' : status === 'pending' || status === 'under_review' ? 'Pending Approval' : 'Not Activated'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Credit Limit</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                  {formatEuro(approvedLimit)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Available Balance</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                  {formatEuro(availableBalance)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Payment Term</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">30 Days</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Next Statement Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">01 Nov 2026</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Auto Payment</span>
                {hasLinkedCard ? (
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded-[2px] text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Enabled
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      (Mandatory for Net-30)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded-[2px] text-[10.5px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Card Required
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddCardModalOpen(true)}
                      className="text-[#ff4a1f] hover:underline font-bold text-xs inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      Enable
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Need a Higher Limit? (Compact) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] p-3.5 sm:p-4 shadow-2xs space-y-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-[4px] bg-orange-50 dark:bg-orange-950/50 text-[#ff4a1f] flex items-center justify-center shrink-0 border border-orange-200/50">
                <TrendingUp size={14} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Need a Higher Limit?
                </h3>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  If you need to increase your credit limit, submit a request for review.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsIncreaseModalOpen(true)}
              className="w-full h-[34px] px-3.5 bg-[#ff4a1f] hover:bg-[#e03d15] text-white text-xs font-semibold rounded-[4px] inline-flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <span>{status === 'approved' ? 'Request Limit Increase' : status === 'pending' || status === 'under_review' ? 'Application Under Review' : 'Apply for Pay Later'}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Corporate Net-30 Drawer Modal */}
      <CorporateNet30DrawerModal
        isOpen={isAgreementOpen}
        onClose={() => setIsAgreementOpen(false)}
        actionButtonText="Close Agreement"
        onApplyCreditLine={() => setIsAgreementOpen(false)}
      />

      {/* Request Limit Increase Modal */}
      <PayLaterIncreaseModal
        isOpen={isIncreaseModalOpen}
        onClose={() => setIsIncreaseModalOpen(false)}
        calculatedStats={{
          totalCreditLimit: monthlyLimit > 0 ? monthlyLimit : (approvedLimit > 0 ? approvedLimit : 40000),
          monthlyLimit: monthlyLimit > 0 ? monthlyLimit : (approvedLimit > 0 ? approvedLimit : 40000),
          weeklyLimit: weeklyLimit > 0 ? weeklyLimit : 15000,
          dailyLimit: dailyLimit > 0 ? dailyLimit : 8000,
        }}
        onSubmit={handleIncreaseSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Direct Add/Link Card Modal to activate Auto Payment */}
      <AddPaymentMethodModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        onAddSuccess={() => {
          setIsAddCardModalOpen(false);
          showToast("Payment card linked and Corporate Auto Payment enabled successfully!", "success");
          if (onRefresh) onRefresh();
        }}
      />
    </div>
  );
}
