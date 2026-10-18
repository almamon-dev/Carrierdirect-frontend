import React from 'react';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import { RotateCcw } from 'lucide-react';
import { TransactionFilterTab } from '../types/transaction.types';

interface TransactionHeaderTabsProps {
    tabs: TransactionFilterTab[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function TransactionHeaderTabs({ tabs, activeTab, setActiveTab }: TransactionHeaderTabsProps) {
    return (
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 ${
                            isActive
                                ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        <span className={`text-[14px] ${isActive ? 'font-bold text-[#ff4a1f]' : 'font-medium'}`}>
                            {tab.label}
                        </span>
                        <span
                            className={`text-[12px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                                isActive
                                    ? 'bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] dark:text-orange-400'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                        >
                            {tab.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

interface TransactionFilterBarProps {
    typeFilter: string;
    setTypeFilter: (val: string) => void;
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    fromDate: string;
    setFromDate: (val: string) => void;
    toDate: string;
    setToDate: (val: string) => void;
    onReset: () => void;
}

export function TransactionFilterBar({
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    onReset,
}: TransactionFilterBarProps) {
    const hasActiveFilters = typeFilter !== 'all' || statusFilter !== 'all' || Boolean(fromDate) || Boolean(toDate);

    return (
        <div className="w-full font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 items-end">
                <div>
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Transaction Type
                    </label>
                    <Select
                        value={typeFilter}
                        onChange={(val: any) => setTypeFilter(val)}
                        showSearch={false}
                    >
                        <option value="all">All Types</option>
                        <option value="earning">Order Payment</option>
                        <option value="fee">Platform Fee</option>
                        <option value="payout">Payout to Stripe</option>
                        <option value="refund">Refund</option>
                    </Select>
                </div>

                <div>
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Status
                    </label>
                    <Select
                        value={statusFilter}
                        onChange={(val: any) => setStatusFilter(val)}
                        showSearch={false}
                    >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed / Paid</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </Select>
                </div>

                <div>
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        From Date
                    </label>
                    <Input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="h-9 text-xs"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                            To Date
                        </label>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={onReset}
                                className="text-[10.5px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                                title="Reset filters"
                            >
                                <RotateCcw size={10} /> Reset
                            </button>
                        )}
                    </div>
                    <Input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="h-9 text-xs"
                    />
                </div>
            </div>
        </div>
    );
}
