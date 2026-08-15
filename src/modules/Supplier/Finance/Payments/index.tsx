import React, { useState } from 'react';
import { CreditCard, FileText, Download, Receipt, Clock } from 'lucide-react';
import Badge from '@/components/ui/badge';
import DataTable, { Column } from '@/components/tables/data-table';
import Select from '@/components/ui/select';

export interface PaymentItem {
    id: string;
    date: string;
    description: string;
    amount: string;
    status: 'Paid' | 'Unpaid' | 'Pending';
}

export default function Payments() {
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

    const history: PaymentItem[] = [
        { id: 'PMT-2026-004', date: 'Jul 01, 2026', description: 'Platform Service Fee', amount: '€15.00', status: 'Paid' },
        { id: 'PMT-2026-003', date: 'Jun 15, 2026', description: 'Premium Job Lead Access', amount: '€5.00', status: 'Paid' },
        { id: 'PMT-2026-002', date: 'May 20, 2026', description: 'Profile Verification Fee', amount: '€10.00', status: 'Paid' },
        { id: 'PMT-2026-001', date: 'Apr 01, 2026', description: 'Account Setup Fee', amount: '€25.00', status: 'Paid' },
    ];

    const filteredHistory = history.filter(item => {
        if (selectedStatusFilter === 'all') return true;
        return item.status.toLowerCase() === selectedStatusFilter.toLowerCase();
    });

    const columns: Column<PaymentItem>[] = [
        { id: 'id', label: 'Payment ID', render: (row) => <span className="font-bold text-slate-900">{row.id}</span> },
        { id: 'date', label: 'Date', render: (row) => <span className="text-xs text-slate-500">{row.date}</span> },
        { id: 'description', label: 'Description', render: (row) => <span className="font-semibold text-slate-800">{row.description}</span> },
        { id: 'amount', label: 'Amount', render: (row) => <span className="font-bold text-slate-900">{row.amount}</span> },
        {
            id: 'status',
            label: 'Status',
            render: (row) => (
                <Badge variant="secondary" className={
                    row.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 font-semibold' :
                        'bg-red-50 text-red-700 font-semibold'
                }>
                    {row.status}
                </Badge>
            )
        },
        {
            id: 'actions',
            label: 'Actions',
            render: () => (
                <button className="text-xs text-[#ff4a1f] hover:underline font-semibold flex items-center gap-1 transition-all cursor-pointer">
                    <Download size={13} /> PDF Receipt
                </button>
            )
        },
    ];

    const filterContent = (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Status Filter</label>
                <Select value={selectedStatusFilter} onChange={(e) => setSelectedStatusFilter(e.target.value)} showSearch={false}>
                    <option value="all">All Payments</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                </Select>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased">
            {/* Header matching Active Jobs & Team Management */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Platform Payments</h1>
                    <p className="text-xs text-slate-500 font-medium">Manage your platform fees, billing history, and payment methods.</p>
                </div>
            </div>

            {/* Top Stats Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Outstanding Balance */}
                <div className="bg-white p-3.5 rounded-md border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600">
                            <Receipt size={16} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 mb-0.5">€0.00</h3>
                        <p className="text-xs font-medium text-slate-500">Outstanding Balance</p>
                    </div>
                </div>

                {/* Total Paid */}
                <div className="bg-white p-3.5 rounded-md border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-50 text-[#ff4a1f]">
                            <FileText size={16} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 mb-0.5">€55.00</h3>
                        <p className="text-xs font-medium text-slate-500">Total Fees Paid</p>
                    </div>
                </div>

                {/* Last Payment Date */}
                <div className="bg-white p-3.5 rounded-md border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 text-slate-600">
                            <Clock size={16} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 mb-0.5">Jul 1, 2026</h3>
                        <p className="text-xs font-medium text-slate-500">Last Payment Date</p>
                    </div>
                </div>

                {/* Payment Method Card */}
                <div className="bg-white p-3.5 rounded-md border border-slate-200 shadow-2xs flex flex-col justify-between border-indigo-100 ring-1 ring-indigo-50">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900 text-white">
                            <CreditCard size={16} strokeWidth={2.5} />
                        </div>
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-semibold text-[10px]">Default</Badge>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 mb-0.5">Visa **** 4242</h3>
                            <p className="text-xs font-medium text-slate-500">Expires 12/2028</p>
                        </div>
                        <button className="text-xs text-[#ff4a1f] hover:underline font-bold transition-all cursor-pointer">
                            Update
                        </button>
                    </div>
                </div>
            </div>

            {/* Direct DataTable matching Active Jobs & Team Management */}
            <div className="p-0">
                <DataTable
                    columns={columns}
                    data={filteredHistory}
                    compact={true}
                    searchPlaceholder="Search payments by ID, description..."
                    hideViewToggle={true}
                    filterContent={filterContent}
                />
            </div>
        </div>
    );
}
