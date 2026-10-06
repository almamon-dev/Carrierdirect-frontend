import React from 'react';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface TableFilterContentProps {
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    startDate: string;
    setStartDate: (val: string) => void;
    endDate: string;
    setEndDate: (val: string) => void;
    onResetFilters: () => void;
}

export const TableFilterContent: React.FC<TableFilterContentProps> = ({
    statusFilter,
    setStatusFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onResetFilters,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 font-sans">
            <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Settlement Status
                </label>
                <Select
                    size="sm"
                    value={statusFilter}
                    onChange={(val) => {
                        const v = typeof val === 'object' && val?.target ? val.target.value : (val?.id ?? val?.value ?? val);
                        setStatusFilter(v);
                    }}
                    showSearch={false}
                    placeholder="All Statuses"
                    options={[
                        { id: 'all', name: 'All Statuses' },
                        { id: 'paid', name: 'Settled & Paid' },
                        { id: 'due', name: 'Outstanding Due' },
                        { id: 'overdue', name: 'Overdue' },
                    ]}
                />
            </div>

            <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    From Date
                </label>
                <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-[30px] text-xs py-1"
                />
            </div>

            <div className="flex items-end gap-2">
                <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        To Date
                    </label>
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-[30px] text-xs py-1"
                    />
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onResetFilters}
                    className="h-[30px] px-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 flex items-center gap-1 shrink-0 cursor-pointer"
                    title="Reset Filters"
                >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                </Button>
            </div>
        </div>
    );
};

export default TableFilterContent;
