import React from 'react';
import { CreditCard, FileText, CheckCircle, Download, Plus, Receipt, Clock } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import DataTable from '@/components/tables/data-table';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export default function Payments() {
    // Dummy billing history
    const history = [
        { id: 'INV-2026-004', date: 'Jul 01, 2026', description: 'Professional Plan Subscription', amount: '€49.00', status: 'Paid' },
        { id: 'INV-2026-003', date: 'Jun 01, 2026', description: 'Professional Plan Subscription', amount: '€49.00', status: 'Paid' },
        { id: 'INV-2026-002', date: 'May 01, 2026', description: 'Professional Plan Subscription', amount: '€49.00', status: 'Paid' },
        { id: 'INV-2026-001', date: 'Apr 01, 2026', description: 'Annual Setup Fee', amount: '€199.00', status: 'Paid' },
    ];

    const columns = [
        { id: 'id', label: 'Invoice', render: (row: any) => <span className="text-[13px] font-semibold text-slate-800">{row.id}</span> },
        { id: 'date', label: 'Date', render: (row: any) => <span className="text-[12px] text-slate-600">{row.date}</span> },
        { id: 'description', label: 'Description', render: (row: any) => <span className="text-[12px] font-medium text-slate-700">{row.description}</span> },
        { id: 'amount', label: 'Amount', render: (row: any) => <span className="text-[13px] font-bold text-slate-900">{row.amount}</span> },
        { 
            id: 'status', 
            label: 'Status', 
            render: (row: any) => (
                <Badge variant="secondary" className={`h-5 px-1.5 text-[10px] ${
                    row.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    'bg-red-50 text-red-700 border border-red-100'
                }`}>
                    {row.status}
                </Badge>
            )
        },
        { 
            id: 'actions', 
            label: 'Actions', 
            render: () => (
                <button className="text-[11px] text-blue-600 hover:text-blue-700 hover:underline font-semibold flex items-center gap-1 transition-all">
                    <Download size={12} /> PDF
                </button>
            )
        },
    ];

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-4 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900">Billing & Payments</h1>
                    <p className="text-[12px] text-slate-500 mt-0.5">Manage your payment methods and subscription invoices.</p>
                </div>
            </div>

            {/* Top Stats Strip - Ultra Compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* Outstanding Balance */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col w-full relative">
                    <div className="flex justify-between items-start w-full mb-1.5">
                        <div className="w-7 h-7 rounded-md shrink-0 flex items-center justify-center bg-emerald-50 text-emerald-600">
                            <Receipt size={14} strokeWidth={2.5} />
                        </div>
                        <span className="text-[18px] font-black text-slate-900">€0.00</span>
                    </div>
                    <h3 className="font-bold text-[12px] text-slate-900 leading-tight mb-0.5">
                        Outstanding Balance
                    </h3>
                    <p className="text-[10px] text-slate-500 leading-snug mb-2 truncate">
                        All your invoices are fully paid.
                    </p>
                </div>

                {/* Active Plan */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col w-full relative">
                    <div className="flex justify-between items-start w-full mb-1.5">
                        <div className="w-7 h-7 rounded-md shrink-0 flex items-center justify-center bg-indigo-50 text-indigo-600">
                            <FileText size={14} strokeWidth={2.5} />
                        </div>
                        <span className="text-[18px] font-black text-slate-900">Pro</span>
                    </div>
                    <h3 className="font-bold text-[12px] text-slate-900 leading-tight mb-0.5">
                        Active Subscription
                    </h3>
                    <p className="text-[10px] text-slate-500 leading-snug mb-2 truncate">
                        Professional Supplier Plan
                    </p>
                </div>

                {/* Next Billing Date */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col w-full relative">
                    <div className="flex justify-between items-start w-full mb-1.5">
                        <div className="w-7 h-7 rounded-md shrink-0 flex items-center justify-center bg-slate-100 text-slate-600">
                            <Clock size={14} strokeWidth={2.5} />
                        </div>
                        <span className="text-[18px] font-black text-slate-900">Aug 1</span>
                    </div>
                    <h3 className="font-bold text-[12px] text-slate-900 leading-tight mb-0.5">
                        Next Billing Date
                    </h3>
                    <p className="text-[10px] text-slate-500 leading-snug mb-2 truncate">
                        €49.00 will be charged.
                    </p>
                </div>

                {/* Payment Method Card */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col w-full relative border-indigo-100 ring-1 ring-indigo-50">
                    <div className="flex justify-between items-start w-full mb-1.5">
                        <div className="w-7 h-7 rounded-md shrink-0 flex items-center justify-center bg-slate-900 text-white">
                            <CreditCard size={14} strokeWidth={2.5} />
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-700 h-4 px-1 text-[8px] font-bold border border-emerald-100">Default</Badge>
                    </div>
                    <h3 className="font-bold text-[12px] text-slate-900 leading-tight mb-0.5">
                        Visa ending in 4242
                    </h3>
                    <p className="text-[10px] text-slate-500 leading-snug mb-2 truncate">
                        Expires 12/2028
                    </p>
                    <div className="mt-auto pt-1 flex justify-start">
                        <button className="text-[11px] text-blue-600 hover:text-blue-700 hover:underline font-semibold flex items-center gap-1 transition-all">
                            Update Method
                        </button>
                    </div>
                </div>

            </div>

            {/* Invoices Table Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Billing History */}
                <Card className="lg:col-span-3 flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                        <CardTitle className="text-[13px]">Billing History</CardTitle>
                    </CardHeader>
                    <div className="p-0 border-t border-slate-100 flex-1">
                        <DataTable columns={columns} data={history} hideViewToggle={true} />
                    </div>
                </Card>
                
            </div>
        </div>
    );
}
