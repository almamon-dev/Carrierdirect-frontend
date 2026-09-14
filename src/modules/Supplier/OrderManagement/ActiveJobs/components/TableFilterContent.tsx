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
    podFilter: string;
    setPodFilter: (val: string) => void;
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
    podFilter,
    setPodFilter,
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
                    Job Status
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
                        { id: 'confirmed', name: 'Confirmed' },
                        { id: 'driver_assigned', name: 'Driver Assigned' },
                        { id: 'in_transit', name: 'In Transit' },
                        { id: 'pod_review', name: 'POD Review' },
                        { id: 'completed', name: 'Completed' },
                        { id: 'cancelled', name: 'Cancelled' },
                    ]}
                />
            </div>

            <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Vehicle Type
                </label>
                <Select
                    size="sm"
                    value={vehicleFilter}
                    onChange={(val) => {
                        const v = typeof val === 'object' && val?.target ? val.target.value : (val?.id ?? val?.value ?? val);
                        setVehicleFilter(v);
                    }}
                    showSearch={false}
                    placeholder="All Vehicles"
                    options={[
                        { id: 'all', name: 'All Vehicles' },
                        { id: 'Covered Van', name: 'Covered Van' },
                        { id: 'Flatbed', name: 'Flatbed Truck' },
                        { id: 'Trailer', name: 'Trailer (40ft)' },
                        { id: 'Container', name: 'Container' },
                        { id: 'Refrigerated', name: 'Refrigerated' },
                    ]}
                />
            </div>

            <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    POD Status
                </label>
                <Select
                    size="sm"
                    value={podFilter}
                    onChange={(val) => {
                        const v = typeof val === 'object' && val?.target ? val.target.value : (val?.id ?? val?.value ?? val);
                        setPodFilter(v);
                    }}
                    showSearch={false}
                    placeholder="All PODs"
                    options={[
                        { id: 'all', name: 'All PODs' },
                        { id: 'not_uploaded', name: 'Not Uploaded' },
                        { id: 'pending', name: 'In Review' },
                        { id: 'approved', name: 'Approved' },
                        { id: 'rejected', name: 'Rejected' },
                    ]}
                />
            </div>

            <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Pickup Date From
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
                        Pickup Date To
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
