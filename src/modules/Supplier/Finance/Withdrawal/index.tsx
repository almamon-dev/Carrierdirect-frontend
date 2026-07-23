import React, { useState } from 'react';
import { Euro, ShieldCheck, AlertCircle, ArrowUpRight, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import Badge from '@/components/ui/badge';
import DataTable, { Column } from '@/components/tables/data-table';
import Select from '@/components/ui/select';

export interface WithdrawalItem {
    id: string;
    date: string;
    reference: string;
    amount: string;
    fee: string;
    netAmount: string;
    method: string;
    status: 'Completed' | 'Processing' | 'Failed';
}

export default function Withdrawal() {
    const [isStripeConnected, setIsStripeConnected] = useState(false);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

    // Dummy withdrawal history
    const history: WithdrawalItem[] = [
        { id: 'WD-89234', date: 'Jul 15, 2026', reference: 'Auto-Payout', amount: '€4,250.00', fee: '€25.00', netAmount: '€4,225.00', method: 'Stripe (**** 4242)', status: 'Completed' },
        { id: 'WD-89230', date: 'Jul 01, 2026', reference: 'Manual Payout', amount: '€3,800.00', fee: '€15.00', netAmount: '€3,785.00', method: 'Stripe (**** 4242)', status: 'Completed' },
        { id: 'WD-89215', date: 'Jun 15, 2026', reference: 'Auto-Payout', amount: '€5,100.00', fee: '€30.00', netAmount: '€5,070.00', method: 'Stripe (**** 4242)', status: 'Completed' },
    ];

    const filteredHistory = history.filter(item => {
        if (selectedStatusFilter === 'all') return true;
        return item.status.toLowerCase() === selectedStatusFilter.toLowerCase();
    });

    const columns: Column<WithdrawalItem>[] = [
        { id: 'id', label: 'Transaction ID', render: (row) => <span className="font-bold text-slate-900">{row.id}</span> },
        { id: 'date', label: 'Date', render: (row) => <span className="text-xs text-slate-500">{row.date}</span> },
        { id: 'reference', label: 'Reference', render: (row) => <span className="text-xs text-slate-500">{row.reference}</span> },
        { id: 'method', label: 'Destination', render: (row) => <span className="font-semibold text-slate-800">{row.method}</span> },
        { id: 'amount', label: 'Gross Amount', render: (row) => <span className="font-semibold text-slate-800">{row.amount}</span> },
        { id: 'fee', label: 'Fees', render: (row) => <span className="font-semibold text-red-600">-{row.fee}</span> },
        { id: 'netAmount', label: 'Net Amount', render: (row) => <span className="font-bold text-emerald-600">{row.netAmount}</span> },
        { 
            id: 'status', 
            label: 'Status', 
            render: (row) => (
                <Badge variant="secondary" className={
                    row.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 font-semibold' :
                    row.status === 'Processing' ? 'bg-amber-50 text-amber-700 font-semibold' :
                    'bg-red-50 text-red-700 font-semibold'
                }>
                    {row.status}
                </Badge>
            )
        },
    ];

    const filterContent = (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Payout Status</label>
                <Select value={selectedStatusFilter} onChange={(e) => setSelectedStatusFilter(e.target.value)} showSearch={false}>
                    <option value="all">All Payouts</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                    <option value="failed">Failed</option>
                </Select>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased">
            {/* Header matching Active Jobs & Team Management */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Earnings & Payouts</h1>
                    <p className="text-xs text-slate-500 font-medium">Manage your Stripe Connect account and payout history.</p>
                </div>
            </div>

            {/* High-Impact Action Required Banner when Stripe is not connected */}
            {!isStripeConnected && (
                <div className="bg-gradient-to-r from-red-500 via-rose-500 to-[#ff4a1f] text-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in border border-red-400/60">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30 shadow-2xs">
                            <AlertCircle className="w-5 h-5 text-white animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-white tracking-tight">Action Required: Complete Payout Onboarding</h3>
                                <span className="px-2 py-0.5 bg-white text-red-600 text-[10px] font-bold rounded-full shadow-2xs uppercase tracking-wider">
                                    Action Required
                                </span>
                            </div>
                            <p className="text-xs text-white/90 font-normal mt-0.5">
                                Connect your Stripe Express account to enable automatic payouts, withdraw available balance (€12,450.00), and receive earnings directly to your bank.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsStripeConnected(true)}
                        className="h-9 px-4 bg-white text-red-600 hover:bg-slate-50 font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5 shrink-0 hover:scale-105"
                    >
                        <span>Setup Stripe Account</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Top Stats Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Balance Card */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-50 text-[#ff4a1f]">
                            <Euro size={16} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 mb-0.5">€12,450.00</h3>
                            <p className="text-xs font-medium text-slate-500">Available Balance</p>
                        </div>
                        <button 
                            className="text-xs text-[#ff4a1f] hover:underline font-bold disabled:text-slate-400 disabled:hover:no-underline transition-all flex items-center gap-1 cursor-pointer" 
                            disabled={!isStripeConnected}
                        >
                             Withdraw <ArrowUpRight size={12} />
                        </button>
                    </div>
                </div>

                {/* Pending Clearance Card */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50 text-amber-600">
                            <Clock size={16} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 mb-0.5">€3,200.00</h3>
                        <p className="text-xs font-medium text-slate-500">Pending Clearance</p>
                    </div>
                </div>

                {/* Total Earnings Card */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600">
                            <TrendingUp size={16} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 mb-0.5">€145,280.00</h3>
                        <p className="text-xs font-medium text-slate-500">Total Earnings</p>
                    </div>
                </div>

                {/* Stripe Connect Card */}
                <div className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    !isStripeConnected 
                        ? 'bg-red-50/30 border-red-300 ring-2 ring-red-500/20 shadow-xs' 
                        : 'bg-white border-slate-200 shadow-2xs'
                }`}>
                    <div className="flex justify-between items-start mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isStripeConnected ? 'bg-[#635BFF]/10 text-[#635BFF]' : 'bg-red-100 text-red-600'
                        }`}>
                            {isStripeConnected ? <ShieldCheck size={16} strokeWidth={2.5} /> : <AlertCircle size={16} strokeWidth={2.5} />}
                        </div>
                        {isStripeConnected ? (
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                                Connected
                            </Badge>
                        ) : (
                            <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full shadow-2xs animate-pulse">
                                Action Required
                            </span>
                        )}
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 mb-0.5">Stripe Connect</h3>
                            <p className="text-xs font-medium text-slate-500">
                                {isStripeConnected ? 'Securely linked.' : 'Setup required for payouts'}
                            </p>
                        </div>
                        {!isStripeConnected ? (
                            <button 
                                className="text-xs text-[#635BFF] hover:underline font-bold transition-all flex items-center gap-1 cursor-pointer" 
                                onClick={() => setIsStripeConnected(true)}
                            >
                                Setup
                            </button>
                        ) : (
                            <button className="text-xs text-[#635BFF] hover:underline font-bold transition-all flex items-center gap-1 cursor-pointer">
                                Dashboard
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Direct DataTable matching Active Jobs & Team Management */}
            <div className="p-0">
                <DataTable 
                    columns={columns} 
                    data={filteredHistory} 
                    compact={true} 
                    searchPlaceholder="Search payouts by transaction ID, method..."
                    hideViewToggle={true} 
                    filterContent={filterContent}
                />
            </div>
        </div>
    );
}
