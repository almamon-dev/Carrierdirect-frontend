import React from 'react';
import { Package, MapPin, ArrowRight, Clock, Search } from 'lucide-react';
import Badge from '@/components/ui/badge';
import Input from '@/components/ui/input';
import { formatDisplayDate } from '@/lib/utils';
import { SupplierOrderItem } from '../../ActiveJobs/types';
import { checkHasRealDriver } from '../../ActiveJobs/utils/orderMapper';

interface AssignDriverQueueProps {
    queueTab: 'pending' | 'assigned';
    onTabChange: (tab: 'pending' | 'assigned') => void;
    pendingCount: number;
    assignedCount: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filteredQueue: SupplierOrderItem[];
    selectedOrderId: string;
    onSelectOrder: (id: string) => void;
}

export const AssignDriverQueue: React.FC<AssignDriverQueueProps> = ({
    queueTab,
    onTabChange,
    pendingCount,
    assignedCount,
    searchQuery,
    onSearchChange,
    filteredQueue,
    selectedOrderId,
    onSelectOrder,
}) => {
    return (
        <div className="lg:col-span-6 bg-white dark:bg-[#1e2329] rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs p-4 md:p-5 space-y-4 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Shipments Dispatch Queue</h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Select a job below to instantly allocate your driver</p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-[3px] text-xs">
                    <button
                        type="button"
                        onClick={() => onTabChange('pending')}
                        className={`px-3 py-1 rounded-[3px] text-[11px] font-semibold cursor-pointer transition-colors ${
                            queueTab === 'pending' ? 'bg-white dark:bg-[#1e2329] text-[#ff4a1f] shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                    >
                        Driver Pending ({pendingCount})
                    </button>
                    <button
                        type="button"
                        onClick={() => onTabChange('assigned')}
                        className={`px-3 py-1 rounded-[3px] text-[11px] font-semibold cursor-pointer transition-colors ${
                            queueTab === 'assigned' ? 'bg-white dark:bg-[#1e2329] text-[#ff4a1f] shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                    >
                        Assigned ({assignedCount})
                    </button>
                </div>
            </div>

            <div>
                <Input
                    type="text"
                    icon={<Search size={14} className="text-slate-400" />}
                    placeholder="Search by Job ID, customer, route, or driver..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-8 text-xs rounded-[4px]"
                />
            </div>

            <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
                {filteredQueue.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                        <Package size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="font-semibold">No shipments in this queue</p>
                        <p className="text-[11px]">All matching active shipments have been dispatched.</p>
                    </div>
                ) : (
                    filteredQueue.map((item) => {
                        const rawStatus = (item.status_raw || item.status || 'confirmed').toLowerCase().trim();
                        const hasRealDriver = checkHasRealDriver(item);
                        const isAssigned = (rawStatus === 'in_transit' || rawStatus === 'picked_up') || hasRealDriver;
                        const isSelected = String(item.id) === String(selectedOrderId) || String(item.order_id) === String(selectedOrderId) || (Boolean(item.rawId) && String(item.rawId) === String(selectedOrderId));

                        const dName = item.driver_name || (typeof item.driver === 'string' ? item.driver : (item.driver as any)?.name);
                        const dEmail = item.driver_email || (item.driver as any)?.email;

                        const origin = item.pickup_city || 'Origin';
                        const dest = item.delivery_city || 'Destination';

                        return (
                            <div
                                key={item.id}
                                onClick={() => onSelectOrder(String(item.id))}
                                className={`p-3 rounded-[4px] border transition-all cursor-pointer text-xs ${
                                    isSelected
                                        ? 'border-[#ff4a1f] bg-orange-50/50 dark:bg-[#ff4a1f]/10 shadow-xs'
                                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#12161c]'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-[#ff4a1f]">{item.order_id || item.order_no || `ORD-${item.id}`}</span>
                                        <span className="text-slate-700 dark:text-slate-200 font-semibold truncate max-w-[140px]">{item.customer_name || 'Customer'}</span>
                                    </div>

                                    {isAssigned ? (
                                        <div className="flex flex-col items-end">
                                            <Badge variant="info" className="text-[10px] font-bold">✓ {hasRealDriver ? dName : 'Driver Assigned'}</Badge>
                                            {dEmail && <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 max-w-[150px] truncate text-right" title={dEmail}>{dEmail}</span>}
                                        </div>
                                    ) : (
                                        <Badge variant="warning" className="text-[10px] font-bold animate-pulse">Pending Dispatch</Badge>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={12} className="text-[#ff4a1f] shrink-0" />
                                        <span>{origin}</span>
                                        <ArrowRight size={10} className="text-slate-400 shrink-0" />
                                        <span>{dest}</span>
                                    </div>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.net_payout || item.amount || '—'}</span>
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-1">
                                        <Clock size={11} />
                                        <span>Pickup: {formatDisplayDate(item.pickup_date || item.created_at)}</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); onSelectOrder(String(item.id)); }}
                                        className={`text-[11px] font-bold flex items-center gap-1 hover:underline cursor-pointer ${
                                            isSelected ? 'text-[#ff4a1f]' : 'text-slate-600 dark:text-slate-400'
                                        }`}
                                    >
                                        <span>{isAssigned && hasRealDriver ? 'Reassign Driver' : 'Assign This Job'}</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AssignDriverQueue;
