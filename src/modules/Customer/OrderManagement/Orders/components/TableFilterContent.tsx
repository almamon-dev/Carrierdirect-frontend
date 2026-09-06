import React from 'react';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface TableFilterContentProps {
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    vehicleFilter: string;
    setVehicleFilter: (val: string) => void;
    paymentFilter: string;
    setPaymentFilter: (val: string) => void;
    startDate: string;
    setStartDate: (val: string) => void;
    endDate: string;
    setEndDate: (val: string) => void;
    onResetFilters: () => void;
}

export const TableFilterContent: React.FC<TableFilterContentProps> = ({
    statusFilter,
    setStatusFilter,
    vehicleFilter,
    setVehicleFilter,
    paymentFilter,
    setPaymentFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onResetFilters,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 font-sans">
            <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Order Status
                </label>
                <Select
                    size="sm"
                    value={statusFilter}
                    onChange={(val) => {
                        const v = typeof val === 'object' && val?.target ? val.target.value : val;
                        setStatusFilter(v);
                    }}
                    showSearch={false}
                    placeholder="All Statuses"
                >
                    <option value="all">All Statuses</option>
                    <option value="in_transit">In Transit</option>
                    <option value="pod_review">POD Review</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </Select>
            </div>

            <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Vehicle Type
                </label>
                <Select
                    size="sm"
                    value={vehicleFilter}
                    onChange={(val) => {
                        const v = typeof val === 'object' && val?.target ? val.target.value : val;
                        setVehicleFilter(v);
                    }}
                    showSearch={false}
                    placeholder="All Vehicles"
                >
                    <option value="all">All Vehicles</option>
                    <option value="Covered Van">Covered Van</option>
                    <option value="Flatbed">Flatbed Truck</option>
                    <option value="Trailer">Trailer (40ft)</option>
                    <option value="Container">Container</option>
                    <option value="Refrigerated">Refrigerated</option>
                </Select>
            </div>

            <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Payment Status
                </label>
                <Select
                    size="sm"
                    value={paymentFilter}
                    onChange={(val) => {
                        const v = typeof val === 'object' && val?.target ? val.target.value : val;
                        setPaymentFilter(v);
                    }}
                    showSearch={false}
                    placeholder="All Payments"
                >
                    <option value="all">All Payments</option>
                    <option value="paid">Paid</option>
                    <option value="escrow">In Escrow</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                </Select>
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
