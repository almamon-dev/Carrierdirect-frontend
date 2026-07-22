import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, ArrowDownRight, ArrowUpRight, History, CreditCard, AlertCircle, FileText, Send, Euro, Calendar } from 'lucide-react';
import Input from '@/components/ui/input';

interface CreditHistoryItem {
  id: string;
  date: string;
  orderRef: string;
  type: 'deduction' | 'repayment';
  description: string;
  amount: string;
  remainingAvailable: string;
  status: 'Deducted' | 'Cleared' | 'Pending Net 30';
}

const mockCreditHistory: CreditHistoryItem[] = [
  {
    id: '1',
    date: '2026-07-22 09:30 AM',
    orderRef: '#ORD-1042',
    type: 'deduction',
    description: 'London to Manchester Freight Booking (Auto-Deducted)',
    amount: '-€ 450',
    remainingAvailable: '€ 3,750',
    status: 'Pending Net 30'
  },
  {
    id: '2',
    date: '2026-07-18 02:15 PM',
    orderRef: '#ORD-1019',
    type: 'deduction',
    description: 'Full Van Removal Service (Birmingham)',
    amount: '-€ 800',
    remainingAvailable: '€ 4,200',
    status: 'Pending Net 30'
  },
  {
    id: '3',
    date: '2026-07-10 11:00 AM',
    orderRef: '#PAY-9902',
    type: 'repayment',
    description: 'Invoice #INV-2041 Repayment Cleared',
    amount: '+€ 1,500',
    remainingAvailable: '€ 5,000',
    status: 'Cleared'
  },
  {
    id: '4',
    date: '2026-07-02 04:45 PM',
    orderRef: '#ORD-0988',
    type: 'deduction',
    description: 'Pallet Delivery (Glasgow Hub)',
    amount: '-€ 650',
    remainingAvailable: '€ 3,500',
    status: 'Cleared'
  }
];

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

export default function PayLaterFacilityPage() {
  const [payLaterStatus] = useState({
    status: 'Approved',
    approvedLimit: '€ 5,000',
    outstandingBalance: '€ 1,250',
    availableCredit: '€ 3,750',
    nextDueDate: '15 Aug 2026',
    daysRemaining: 24,
  });

  const [filterType, setFilterType] = useState<'all' | 'deduction' | 'repayment'>('all');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestedAmount, setRequestedAmount] = useState('10000');
  const [requestReason, setRequestReason] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const filteredHistory = mockCreditHistory.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const handleRequestIncrease = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setIsRequestModalOpen(false);
    }, 2500);
  };

  return (
    <div className="p-4 md:p-6 w-full space-y-4 bg-[#f8fafc] min-h-screen">
      
      {/* Standard Project Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[18px] font-bold text-slate-900 mb-0.5">
            Pay Later Management
          </h1>
          <p className="text-[13px] text-slate-500">
            Track and manage your credit lines and pay later requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-sm border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {payLaterStatus.status}
          </span>

          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-xs rounded-sm shadow-sm transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" /> Request Higher Credit Limit
          </button>
        </div>
      </div>

      {/* Metric Cards Grid matching Dashboard Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Approved Credit Limit"
          description="Total approved corporate credit line."
          value={payLaterStatus.approvedLimit}
          icon={Euro}
          colorClass="bg-brand-light text-brand"
        />

        <MetricCard 
          title="Outstanding Balance"
          description="Active unpaid Net 30 invoices."
          value={payLaterStatus.outstandingBalance}
          icon={CreditCard}
          colorClass="bg-orange-50 text-orange-600"
        />

        <MetricCard 
          title="Available Balance"
          description="Credit available for instant bookings."
          value={payLaterStatus.availableCredit}
          icon={ShieldCheck}
          colorClass="bg-emerald-50 text-emerald-600"
        />

        <MetricCard 
          title="Next Due Date"
          description={`${payLaterStatus.daysRemaining} days remaining until payment due.`}
          value={payLaterStatus.nextDueDate}
          icon={Calendar}
          colorClass="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Guidance Alert */}
      <div className="p-4 bg-white rounded-lg border border-slate-200 flex items-start gap-3 shadow-xs">
        <AlertCircle className="w-5 h-5 text-[#ff4a1f] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-800 space-y-0.5">
          <h4 className="font-bold text-slate-900 text-xs">Automatic Credit Check & Balance Protection</h4>
          <p className="text-slate-600 leading-relaxed">
            Whenever you submit a shipment quote request or confirm an order, our system automatically checks your available credit balance (<span className="font-bold text-slate-900">{payLaterStatus.availableCredit}</span>). Orders exceeding your available credit limit will be flagged to prevent over-limit transactions.
          </p>
        </div>
      </div>

      {/* Request Higher Limit Modal */}
      {isRequestModalOpen && (
        <form onSubmit={handleRequestIncrease} className="bg-white p-4 sm:p-5 rounded-lg border border-orange-200 shadow-sm space-y-3.5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#ff4a1f]" />
              Submit Credit Limit Increase Request
            </h4>
            <span className="text-[11px] font-semibold text-slate-500">Admin Approval Workflow</span>
          </div>

          {requestSubmitted ? (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-sm border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Credit Limit Increase Request Submitted! Admin will review shortly.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Requested Credit Limit (€) *"
                  type="number"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(e.target.value)}
                  placeholder="10000"
                  required
                />

                <div className="flex flex-col gap-1">
                  <label className="text-[14px] font-bold text-[#202223]">Reason for Increase</label>
                  <input
                    type="text"
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                    placeholder="e.g. Scaling monthly logistics volume"
                    className="flex h-[42px] w-full rounded-sm border border-[#d1d1d1] bg-white px-3 py-1.5 text-[14px] font-medium text-[#202223] focus:outline-none focus:border-[#4273f5]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="h-8 px-3.5 rounded-sm border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-sm bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  Submit for Admin Review
                </button>
              </div>
            </>
          )}
        </form>
      )}

      {/* Payment History & Credit Transaction Records Table */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-2.5 gap-2">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-700" />
            <div>
              <h3 className="text-xs font-bold text-slate-900">Payment History & Credit Transaction Records</h3>
              <p className="text-[11px] text-slate-500">Complete ledger of credit deductions, job bookings, and cleared repayments.</p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-sm text-xs font-bold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-sm transition-all cursor-pointer ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setFilterType('deduction')}
              className={`px-3 py-1 rounded-sm transition-all cursor-pointer ${
                filterType === 'deduction' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Deductions (-€)
            </button>
            <button
              onClick={() => setFilterType('repayment')}
              className={`px-3 py-1 rounded-sm transition-all cursor-pointer ${
                filterType === 'repayment' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Repayments (+€)
            </button>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-bold">
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Order / Ref</th>
                <th className="py-2.5 px-3">Transaction Details</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-right font-semibold">Available Credit</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-700 whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                    {item.orderRef}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {item.description}
                  </td>
                  <td className={`py-3 px-3 text-right font-bold whitespace-nowrap ${
                    item.type === 'deduction' ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    <div className="inline-flex items-center gap-0.5">
                      {item.type === 'deduction' ? (
                        <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                      {item.amount}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-800 whitespace-nowrap">
                    {item.remainingAvailable}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                      item.status === 'Cleared'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
