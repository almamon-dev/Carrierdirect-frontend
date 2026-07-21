import React, { useState } from 'react';
import { Euro, ExternalLink, ShieldCheck, AlertCircle, Download, ArrowUpRight, TrendingUp, Clock } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import DataTable from '@/components/tables/data-table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Withdrawal() {
    const [isStripeConnected, setIsStripeConnected] = useState(false);

    // Dummy withdrawal history
    const history = [
        { id: 'WD-89234', date: 'Jul 15, 2026', reference: 'Auto-Payout', amount: '€4,250.00', fee: '€25.00', netAmount: '€4,225.00', method: 'Stripe (**** 4242)', status: 'Completed' },
        { id: 'WD-89230', date: 'Jul 01, 2026', reference: 'Manual Payout', amount: '€3,800.00', fee: '€15.00', netAmount: '€3,785.00', method: 'Stripe (**** 4242)', status: 'Completed' },
        { id: 'WD-89215', date: 'Jun 15, 2026', reference: 'Auto-Payout', amount: '€5,100.00', fee: '€30.00', netAmount: '€5,070.00', method: 'Stripe (**** 4242)', status: 'Completed' },
    ];

    const columns = [
        { id: 'id', label: 'Transaction ID', render: (row: any) => <span className="text-[13px] font-semibold text-slate-800">{row.id}</span> },
        { id: 'date', label: 'Date', render: (row: any) => <span className="text-[12px] text-slate-600">{row.date}</span> },
        { id: 'reference', label: 'Reference', render: (row: any) => <span className="text-[12px] text-slate-500">{row.reference}</span> },
        { id: 'method', label: 'Destination', render: (row: any) => <span className="text-[12px] text-slate-600">{row.method}</span> },
        { id: 'amount', label: 'Gross Amount', render: (row: any) => <span className="text-[12px] font-medium text-slate-700">{row.amount}</span> },
        { id: 'fee', label: 'Fees', render: (row: any) => <span className="text-[12px] text-red-600">-{row.fee}</span> },
        { id: 'netAmount', label: 'Net Amount', render: (row: any) => <span className="text-[13px] font-bold text-emerald-600">{row.netAmount}</span> },
        { 
            id: 'status', 
            label: 'Status', 
            render: (row: any) => (
                <Badge variant="secondary" className={`h-5 px-1.5 text-[10px] ${
                    row.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                    row.status === 'Processing' ? 'bg-amber-50 text-amber-700' :
                    'bg-red-50 text-red-700'
                }`}>
                    {row.status}
                </Badge>
            )
        },
    ];

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-4 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900">Earnings & Payouts</h1>
                    <p className="text-[12px] text-slate-500 mt-0.5">Manage your Stripe Connect account and payout history.</p>
                </div>
            </div>

            {/* Top Stats Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Balance Card */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col w-full relative">
                    <div className="flex justify-between items-start w-full mb-1.5">
                        <div className="w-7 h-7 rounded-md shrink-0 flex items-center justify-center bg-blue-50 text-blue-600">
                            <Euro size={14} strokeWidth={2.5} />
                        </div>
                        <span className="text-[18px] font-black text-slate-900">€12,450.00</span>
                    </div>
                    <h3 className="font-bold text-[12px] text-slate-900 leading-tight mb-0.5">
                        Available Balance
                    </h3>
                    <p className="text-[10px] text-slate-500 leading-snug mb-2 truncate">
                        Cleared funds ready for payout.
                    </p>
                    <div className="mt-auto pt-1">
                        <button 
                            className="text-[11px] text-blue-600 hover:text-blue-700 hover:underline font-semibold flex items-center gap-1 disabled:text-slate-400 disabled:hover:no-underline transition-all" 
                            disabled={!isStripeConnected}
                        >
                             Withdraw Funds <ArrowUpRight size={12} />
                        </button>
                    </div>
                </div>

                {/* Pending Clearance Card */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col w-full relative">
                    <div className="flex justify-between items-start w-full mb-1.5">
                        <div className="w-7 h-7 rounded-md shrink-0 flex items-center justify-center bg-amber-50 text-amber-600">
                            <Clock size={14} strokeWidth={2.5} />
                        </div>
                        <span className="text-[18px] font-black text-slate-900">€3,200.00</span>
                    </div>
                    <h3 className="font-bold text-[12px] text-slate-900 leading-tight mb-0.5">
                        Pending Clearance
                    </h3>
                    <p className="text-[10px] text-slate-500 leading-snug mb-2 truncate">
                        Earnings processing by Stripe.
                    </p>
                </div>

                {/* Total Earnings Card */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col w-full relative">
                    <div className="flex justify-between items-start w-full mb-1.5">
                        <div className="w-7 h-7 rounded-md shrink-0 flex items-center justify-center bg-emerald-50 text-emerald-600">
                            <TrendingUp size={14} strokeWidth={2.5} />
                        </div>
                        <span className="text-[18px] font-black text-slate-900">€145,280.00</span>
                    </div>
                    <h3 className="font-bold text-[12px] text-slate-900 leading-tight mb-0.5">
                        Total Earnings
                    </h3>
                    <p className="text-[10px] text-slate-500 leading-snug mb-2 truncate">
                        Lifetime earnings overview.
                    </p>
                </div>

                {/* Stripe Connect Card */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col w-full relative">
                    <div className="flex justify-between items-start w-full mb-1.5">
                        <div className={`w-7 h-7 rounded-md shrink-0 flex items-center justify-center ${isStripeConnected ? 'bg-[#635BFF]/10 text-[#635BFF]' : 'bg-red-50 text-red-500'}`}>
                            {isStripeConnected ? <ShieldCheck size={14} strokeWidth={2.5} /> : <AlertCircle size={14} strokeWidth={2.5} />}
                        </div>
                        {isStripeConnected ? 
                            <Badge className="bg-emerald-50 text-emerald-700 h-4 px-1 text-[8px] font-bold border border-emerald-100">Connected</Badge> : 
                            <Badge className="bg-red-50 text-red-700 h-4 px-1 text-[8px] font-bold border border-red-100">Action Required</Badge>
                        }
                    </div>
                    <h3 className="font-bold text-[12px] text-slate-900 leading-tight mb-0.5">
                        Stripe Connect
                    </h3>
                    <p className="text-[10px] text-slate-500 leading-snug mb-2 truncate">
                        {isStripeConnected ? 'Routed securely to bank.' : 'Connect to receive payouts.'}
                    </p>
                    <div className="mt-auto pt-1 flex justify-start">
                        {!isStripeConnected ? (
                            <button 
                                className="text-[11px] text-[#635BFF] hover:text-[#5249EC] hover:underline font-semibold flex items-center gap-1 transition-all" 
                                onClick={() => setIsStripeConnected(true)}
                            >
                                Setup Stripe
                                <ArrowUpRight size={12} />
                            </button>
                        ) : (
                            <button className="text-[11px] text-[#635BFF] hover:text-[#5249EC] hover:underline font-semibold flex items-center gap-1 transition-all">
                                View Dashboard
                                <ExternalLink size={12} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <Card className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                    <CardTitle className="text-[14px]">Payout History</CardTitle>
                    <Button variant="ghost" className="h-6 text-[11px] px-2 text-slate-500 hover:text-slate-900 gap-1.5">
                        <Download size={12} />
                        Export
                    </Button>
                </CardHeader>
                <div className="p-0 border-t border-slate-100">
                    <DataTable columns={columns} data={history} hideViewToggle={true} />
                </div>
            </Card>
        </div>
    );
}
