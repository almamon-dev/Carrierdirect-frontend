import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, CreditCard, Plus, Euro, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const MetricCard = ({ title, description, value, icon: Icon, colorClass }: { title: string; description: string; value: string; icon: any; colorClass: string }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex flex-col items-start cursor-pointer w-full">
        <div className="flex justify-between items-start w-full mb-3">
            <div className={`w-9 h-9 rounded-sm shrink-0 flex items-center justify-center ${colorClass}`}>
                <Icon size={18} strokeWidth={2} />
            </div>
            <span className="text-[20px] font-bold text-slate-800">{value}</span>
        </div>
        <h3 className="text-[13px] font-bold text-slate-800 mb-0.5">
            {title}
        </h3>
        <p className="text-[12px] text-slate-500 font-medium leading-snug">
            {description}
        </p>
    </div>
);

export default function PaymentTab() {
  return (
    <div className="space-y-4">
      
      {/* Pay Later Facility Banner Header */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pay Later Credit Terms</h3>
              <p className="text-xs text-slate-500">30-day deferred logistics payment facility and credit balance.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-sm border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active Facility
            </span>

            <Link
              to="/customer/finance/pay-later"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-xs rounded-sm shadow-sm transition-all cursor-pointer"
            >
              Open Credit Hub <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid matching Dashboard Style */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <MetricCard 
            title="Approved Limit"
            description="Admin approved corporate credit limit."
            value="€ 5,000"
            icon={Euro}
            colorClass="bg-brand-light text-brand"
          />

          <MetricCard 
            title="Currently Used"
            description="Active Net 30 due invoices."
            value="€ 1,250"
            icon={CreditCard}
            colorClass="bg-orange-50 text-orange-600"
          />

          <MetricCard 
            title="Available Balance"
            description="Balance available for instant booking."
            value="€ 3,750"
            icon={ShieldCheck}
            colorClass="bg-emerald-50 text-emerald-600"
          />
        </div>
      </div>

      {/* Masked Saved Payment Methods Card */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Saved Payment Methods</h3>
            <p className="text-xs text-slate-500">Manage payment methods for escrow bookings.</p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-sm shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Card
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          {/* Card 1 - Visa */}
          <div className="p-3.5 rounded-sm border border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] tracking-wider">
                VISA
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-slate-900 tracking-wider">
                  4532 •••• •••• 4092
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Exp 08 / 2028</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-sm border border-slate-200">
              Primary
            </span>
          </div>

          {/* Card 2 - Mastercard */}
          <div className="p-3.5 rounded-sm border border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded-sm bg-red-600 text-white flex items-center justify-center font-bold text-[10px] tracking-wider">
                MC
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-slate-900 tracking-wider">
                  5412 •••• •••• 8810
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Exp 11 / 2026</p>
              </div>
            </div>
            <button className="text-[11px] font-bold text-[#ff4a1f] hover:underline cursor-pointer">
              Set Primary
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
