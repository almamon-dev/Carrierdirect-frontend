import React from 'react';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import { RotateCcw } from 'lucide-react';

interface WithdrawalTableFilterContentProps {
    statusFilter?: string;
    setStatusFilter?: (val: string) => void;
    methodFilter?: string;
    setMethodFilter?: (val: string) => void;
    startDate?: string;
    setStartDate?: (val: string) => void;
    endDate?: string;
    setEndDate?: (val: string) => void;
    onResetFilters?: () => void;
}

export const WithdrawalTableFilterContent: React.FC<WithdrawalTableFilterContentProps> = ({
    statusFilter = 'all',
    setStatusFilter,
    methodFilter = 'all',
    setMethodFilter,
    startDate = '',
    setStartDate,
    endDate = '',
    setEndDate,
    onResetFilters,
}) => {
    const hasActiveFilters =
        statusFilter !== 'all' ||
        methodFilter !== 'all' ||
        Boolean(startDate) ||
        Boolean(endDate);

    return (
        <div className="w-full font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 items-end">
                <div>
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Payout Status
                    </label>
                    <Select
                        value={statusFilter}
                        onChange={(val: any) => setStatusFilter?.(typeof val === 'object' ? val.id : val)}
                        showSearch={false}
                    >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="processing">Processing</option>
                        <option value="failed">Failed</option>
                    </Select>
                </div>

                <div>
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Destination / Method
                    </label>
                    <Select
                        value={methodFilter}
                        onChange={(val: any) => setMethodFilter?.(typeof val === 'object' ? val.id : val)}
                        showSearch={false}
                    >
                        <option value="all">All Methods</option>
                        <option value="stripe">Stripe Connect</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="automatic">Automatic Payout</option>
                    </Select>
                </div>

                <div>
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Start Date
                    </label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate?.(e.target.value)}
                        className="h-9 text-xs"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                            End Date
                        </label>
                        {hasActiveFilters && onResetFilters && (
                            <button
                                type="button"
                                onClick={onResetFilters}
                                className="text-[10.5px] font-semibold text-[#ff4a1f] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                <RotateCcw size={10} /> Reset
                            </button>
                        )}
                    </div>
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate?.(e.target.value)}
                        className="h-9 text-xs"
                    />
                </div>
            </div>
        </div>
    );
};
