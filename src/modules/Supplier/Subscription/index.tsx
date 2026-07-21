import React from 'react';
import { CreditCard, FileText, CheckCircle, Download, Plus, Receipt, Clock, ArrowUpRight } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import DataTable from '@/components/tables/data-table';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Switch from '@/components/ui/switch';

export default function Subscription() {
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
                <button className="text-[11px] text-[#FF4A1F] hover:underline font-semibold flex items-center gap-1 transition-all">
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
                    <h1 className="text-[18px] font-bold text-slate-900">Subscription & Billing</h1>
                    <p className="text-[12px] text-slate-500 mt-0.5">Manage your active subscription plan, billing cycle, and payment methods.</p>
                </div>
                <Button variant="primary" className="h-8 text-[12px] px-3 gap-1.5 shadow-sm">
                    Upgrade Plan
                </Button>
            </div>

            {/* Top Stats Strip - Ultra Compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* Outstanding Balance */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center bg-emerald-50 text-emerald-600">
                            <Receipt size={14} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[13px] font-bold text-slate-800 mb-0.5">€0.00</h3>
                        <p className="text-[10px] font-semibold text-slate-500">Outstanding Balance</p>
                    </div>
                </div>

                {/* Active Plan */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center bg-[#FFF0ED] text-[#FF4A1F]">
                            <FileText size={14} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[13px] font-bold text-slate-800 mb-0.5">Professional Plan</h3>
                        <p className="text-[10px] font-semibold text-slate-500">Active Subscription</p>
                    </div>
                </div>

                {/* Next Billing Date */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center bg-slate-100 text-slate-600">
                            <Clock size={14} strokeWidth={2.5} />
                        </div>
                        <div className="flex items-center gap-1.5" title="Auto-Renewal">
                            <span className="text-[10px] font-bold text-slate-500">Auto</span>
                            <Switch defaultChecked={true} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[13px] font-bold text-slate-800 mb-0.5">Aug 1, 2026</h3>
                        <p className="text-[10px] font-semibold text-slate-500">Next Billing Date</p>
                    </div>
                </div>

                {/* Payment Method Card */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between border-indigo-100 ring-1 ring-indigo-50">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center bg-slate-900 text-white">
                            <CreditCard size={14} strokeWidth={2.5} />
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-700 h-4 px-1 text-[8px] font-bold border border-emerald-100">Default</Badge>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <h3 className="text-[13px] font-bold text-slate-800 mb-0.5">Visa **** 4242</h3>
                            <p className="text-[10px] font-semibold text-slate-500">Expires 12/2028</p>
                        </div>
                        <button className="text-[10px] text-[#FF4A1F] hover:underline font-bold transition-all">
                            Update
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
