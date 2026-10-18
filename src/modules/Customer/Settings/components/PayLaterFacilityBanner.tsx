import React from "react";
import { ShieldCheck, CheckCircle2, ArrowRight, Euro, CreditCard, Clock, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { PayLaterInfo } from "../types/paymentTypes";

const MetricCard = ({
  title,
  description,
  value,
  icon: Icon,
  colorClass,
}: {
  title: string;
  description: string;
  value: string;
  icon: any;
  colorClass: string;
}) => (
  <div className="bg-white dark:bg-[#1e2329] p-2.5 sm:p-3 rounded-[6px] border border-slate-200 dark:border-slate-800 hover:border-slate-300 transition-colors flex flex-col justify-between w-full shadow-2xs">
    <div className="flex justify-between items-center w-full mb-1.5">
      <div className={`w-7 h-7 rounded-[4px] shrink-0 flex items-center justify-center ${colorClass}`}>
        <Icon size={14} strokeWidth={2.2} />
      </div>
      <span className="text-[15px] sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
        {value}
      </span>
    </div>
    <div>
      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{title}</h3>
      <p className="text-[10.5px] text-slate-400 dark:text-slate-500 font-normal leading-snug mt-0.5 truncate">
        {description}
      </p>
    </div>
  </div>
);

interface PayLaterFacilityBannerProps {
  payLater: PayLaterInfo;
}

export const PayLaterFacilityBanner: React.FC<PayLaterFacilityBannerProps> = ({ payLater }) => {
  const renderStatusBadge = () => {
    if (payLater.status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10.5px] font-bold rounded border border-emerald-200 dark:border-emerald-800/60">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Active Facility
        </span>
      );
    }
    if (payLater.status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10.5px] font-bold rounded border border-amber-200 dark:border-amber-800/60">
          <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Approval Pending
        </span>
      );
    }
    if (payLater.status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-[10.5px] font-bold rounded border border-red-200 dark:border-red-800/60">
          <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" /> Request Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10.5px] font-bold rounded border border-slate-200 dark:border-slate-700">
        Inactive Facility
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-[#12161c] p-3 sm:p-3.5 rounded-[6px] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Pay Later Credit Terms
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
              30-day deferred logistics payment facility and revolving balance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {renderStatusBadge()}

          <Link
            to="/customer/finance/pay-later"
            className="inline-flex items-center gap-1 h-7 px-2.5 bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-[11px] rounded-[4px] shadow-2xs transition-all cursor-pointer"
          >
            Open Credit Hub <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <MetricCard
          title="Approved Limit"
          description="Approved revolving facility cap."
          value={payLater.approved_limit_formatted || "€ 0.00"}
          icon={Euro}
          colorClass="bg-orange-50 text-[#ff4a1f] dark:bg-orange-950/50 dark:text-orange-400"
        />

        <MetricCard
          title="Currently Used"
          description="Active Net 30 unpaid invoices."
          value={payLater.currently_used_formatted || "€ 0.00"}
          icon={CreditCard}
          colorClass="bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
        />

        <MetricCard
          title="Available Balance"
          description="Ready for instant freight orders."
          value={payLater.available_balance_formatted || "€ 0.00"}
          icon={ShieldCheck}
          colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
        />
      </div>
    </div>
  );
};

export default PayLaterFacilityBanner;
