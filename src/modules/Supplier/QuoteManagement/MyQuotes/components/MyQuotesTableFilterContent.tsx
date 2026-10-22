/**
 * Supplier My Quotes Filter Bar Component
 * Minimal Filters: Status, Request ID, and Reset.
 */

import React from "react";
import Select from "@/components/ui/select";
import Input from "@/components/ui/input";
import { RotateCcw, Hash } from "lucide-react";

interface MyQuotesTableFilterContentProps {
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    requestIdFilter: string;
    setRequestIdFilter: (val: string) => void;
    onResetFilters: () => void;
}

export const MyQuotesTableFilterContent: React.FC<MyQuotesTableFilterContentProps> = ({
    statusFilter,
    setStatusFilter,
    requestIdFilter,
    setRequestIdFilter,
    onResetFilters,
}) => {
    const hasActiveFilters = statusFilter !== "all" || Boolean(requestIdFilter);

    return (
        <div className="w-full mb-3.5 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-end">
                {/* 1. Status Filter */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Status
                    </label>
                    <Select value={statusFilter} onChange={(val) => setStatusFilter(val)} showSearch={false}>
                        <option value="all">All Statuses</option>
                        <option value="pending">⏳ Pending Review</option>
                        <option value="won">🏆 Won / Booked</option>
                        <option value="negotiation">💬 In Negotiation</option>
                        <option value="awaiting_payment">💳 Awaiting Payment</option>
                        <option value="rejected">❌ Rejected / Lost</option>
                        <option value="expired">⌛ Expired</option>
                    </Select>
                </div>

                {/* 2. Request ID Filter & Reset */}
                <div className="min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                            Request ID
                        </label>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={onResetFilters}
                                className="text-[10.5px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                                title="Reset filters"
                            >
                                <RotateCcw size={10} /> Reset
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="e.g. REQ-0012 or 12"
                            value={requestIdFilter}
                            onChange={(e) => setRequestIdFilter(e.target.value)}
                            className="h-9 text-xs pl-8"
                        />
                        <Hash size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
};
